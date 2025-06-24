import { useReplicant } from '@nodecg/react-hooks';
import { render } from '../render';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import type { Timer as TimerType } from 'src/types/generated/timer';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { PlayerData } from 'src/types/custom';

export const Timer = () => {
  const [timer] = useReplicant<TimerType>('timer');
  const [player1] = useReplicant<PlayerData>('player1');
  const [player2] = useReplicant<PlayerData>('player2');

  return (
    <DashboardThemeProvider>
      {timer && (
        <Stack spacing={2}>
          <Typography variant="h3" sx={{ textAlign: 'center' }}>
            <b>{timer?.time}</b>
          </Typography>
          <Grid container padding={1}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                disabled={timer.phase === 'finished'}
                onClick={async () => {
                  if (timer.phase === 'stopped' || timer.phase === 'paused') {
                    await nodecg.sendMessage('timerStart');
                  } else if (timer.phase === 'running') {
                    await nodecg.sendMessage('timerPause');
                  }
                }}>
                {timer.phase === 'running' ? 'Pause Timer' : 'Start Timer'}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                disabled={timer.phase === 'stopped'}
                onClick={async () => {
                  await nodecg.sendMessage('timerReset', true);
                }}>
                Reset Timer
              </Button>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            fullWidth
            disabled={
              timer.phase === 'stopped' ||
              timer.phase === 'finished' ||
              player1?.finishTime !== undefined
            }
            onClick={async () => {
              await nodecg.sendMessage('finishPlayer1', true);
            }}>
            Finish Player 1 {player1?.name && <>({player1.name})</>}
          </Button>
          <Button
            variant="contained"
            fullWidth
            disabled={
              timer.phase === 'stopped' ||
              timer.phase === 'finished' ||
              player2?.finishTime !== undefined
            }
            onClick={async () => {
              await nodecg.sendMessage('finishPlayer2', true);
            }}>
            Finish Player 2 {player2?.name && <>({player2.name})</>}
          </Button>
        </Stack>
      )}
    </DashboardThemeProvider>
  );
};

render(<Timer />);
