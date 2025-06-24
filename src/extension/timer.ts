import type NodeCG from 'nodecg/types';
import type { PlayerData } from 'src/types/custom';
import type { Configschema } from 'src/types/generated';
import { Timer } from 'src/types/generated/timer';
import livesplitCore from 'livesplit-core';
import { msToTimeStr } from './util/helpers';

const LS_TIMER_PHASE = {
  NotRunning: 0,
  Running: 1,
  Ended: 2,
  Paused: 3,
};

export async function initTimer(nodecg: NodeCG.ServerAPI<Configschema>) {
  const player1 = nodecg.Replicant<PlayerData>('player1');
  const player2 = nodecg.Replicant<PlayerData>('player2');
  const timerRep = nodecg.Replicant<Timer>('timer');
  let runnersFinished = false;

  const liveSplitRun = livesplitCore.Run.new();
  liveSplitRun.pushSegment(livesplitCore.Segment.new('finish'));

  const timer = livesplitCore.Timer.new(liveSplitRun) as livesplitCore.Timer;

  const resetTimerRepToDefault = (): void => {
    timerRep.value = {
      time: '00:00',
      milliseconds: 0,
      timestamp: 0,
      phase: 'stopped',
    };
    nodecg.log.debug('[Timer] Replicant restored to default');
  };

  const setTime = (ms: number): void => {
    timerRep.value!.time = msToTimeStr(ms);
    timerRep.value!.milliseconds = ms;
    nodecg.log.debug(`[Timer] Set to ${msToTimeStr(ms)}/${ms}`);
  };

  async function startTimer(force?: boolean): Promise<void> {
    try {
      // Error if the timer is disabled.
      if (!force) {
        throw new Error('Timer changes are disabled');
      }
      // Error if the timer is finished.
      if (timerRep.value!.phase === 'finished') {
        throw new Error('Timer is in the finished state');
      }
      // Error if the timer isn't stopped or paused (and we're not forcing it).
      if (!force && !['stopped', 'paused'].includes(timerRep.value!.phase)) {
        throw new Error('Timer is not stopped/paused');
      }

      if (timer.currentPhase() === LS_TIMER_PHASE.NotRunning) {
        timer.start();
        nodecg.log.debug('[Timer] Started');
      } else {
        timer.resume();
        nodecg.log.debug('[Timer] Resumed');
      }
      setGameTime(timerRep.value!.milliseconds);
      timerRep.value!.phase = 'running';
    } catch (err) {
      nodecg.log.debug('[Timer] Cannot start/resume timer:', err);
      throw err;
    }
  }

  const pauseTimer = async (): Promise<void> => {
    try {
      // Error if the timer isn't running.
      if (timerRep.value!.phase !== 'running') {
        throw new Error('Timer is not running');
      }

      timer.pause();
      timerRep.value!.phase = 'paused';
      nodecg.log.debug('[Timer] Paused');
    } catch (err) {
      nodecg.log.debug('[Timer] Cannot pause timer:', err);
      throw err;
    }
  };

  const resetTimer = async (force?: boolean): Promise<void> => {
    try {
      // Error if the timer is disabled.
      if (!force) {
        throw new Error('Timer changes are disabled');
      }
      // Error if the timer is stopped.
      if (timerRep.value!.phase === 'stopped') {
        throw new Error('Timer is stopped');
      }

      timer.reset(false);
      resetTimerRepToDefault();
      player1.value!.finishTime = undefined;
      player2.value!.finishTime = undefined;
      runnersFinished = false;
      nodecg.log.debug('[Timer] Reset');
    } catch (err) {
      nodecg.log.debug('[Timer] Cannot reset timer:', err);
      throw err;
    }
  };

  const stopTimer = async (): Promise<void> => {
    try {
      // Error if timer is not running.
      if (!['running', 'paused'].includes(timerRep.value!.phase)) {
        throw new Error('Timer is not running/paused');
      }

      // Stop the timer if all the teams have finished (or no teams exist).
      if (timerRep.value!.phase === 'paused') {
        timer.resume();
      }
      timer.split();
      timerRep.value!.phase = 'finished';
      nodecg.log.debug('[Timer] Finished');
    } catch (err) {
      nodecg.log.debug('[Timer] Cannot stop timer:', err);
      throw err;
    }
  };

  const setGameTime = (ms: number): void => {
    if (timerRep.value?.phase === 'stopped') {
      livesplitCore.TimeSpan.fromSeconds(0).with((t) => timer.setLoadingTimes(t));
      timer.initializeGameTime();
    }
    livesplitCore.TimeSpan.fromSeconds(ms / 1000).with((t) => timer.setGameTime(t));
    nodecg.log.debug(`[Timer] Game time set to ${ms}`);
  };

  const tick = (): void => {
    if (timerRep.value?.phase === 'running') {
      // Calculates the milliseconds the timer has been running for and updates the replicant.
      const time = timer.currentTime().gameTime() as livesplitCore.TimeSpanRef;
      const ms = Math.floor(time.totalSeconds() * 1000);
      setTime(ms);
      timerRep.value.timestamp = Date.now();
    }
  };

  if (timerRep.value?.phase === 'running') {
    const missedTime = Date.now() - timerRep.value.timestamp;
    const previousTime = timerRep.value.milliseconds;
    const timeOffset = previousTime + missedTime;
    setTime(timeOffset);
    nodecg.log.info(`[Timer] Recovered ${(missedTime / 1000).toFixed(2)} seconds of lost time`);
    startTimer(true).catch(() => {
      /* catch error if needed, for safety */
    });
  }

  nodecg.listenFor('timerStart', () => {
    startTimer(true).then().catch();
  });

  nodecg.listenFor('timerPause', () => {
    pauseTimer().then().catch();
  });

  nodecg.listenFor('timerReset', (force) => {
    resetTimer(force).then().catch();
  });

  nodecg.listenFor('timerFinish', () => {
    stopTimer().then().catch();
  });

  nodecg.listenFor('finishPlayer1', () => {
    player1.value!.finishTime = timerRep.value!.time;
  });

  nodecg.listenFor('finishPlayer2', () => {
    player2.value!.finishTime = timerRep.value!.time;
  });

  // Stop timer when both runners finished
  timerRep.on('change', () => {
    if (player1.value?.finishTime && player2.value?.finishTime && !runnersFinished) {
      runnersFinished = true;
      nodecg.sendMessage('timerFinish');
    }
  });

  setInterval(tick, 100);
}
