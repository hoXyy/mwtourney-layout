import mainBg from './img/main.png';
import mainBgNoBox from './img/main_nobox.png';
import { useReplicant } from '@nodecg/react-hooks';
import './css/style.css';
import { render } from '../render';
import { PlayerData } from 'src/types/custom';
import { Score } from 'src/types/generated/score';
import { Timer } from 'src/types/generated/timer';

const App = () => {
  const [player1] = useReplicant<PlayerData>('player1');
  const [player2] = useReplicant<PlayerData>('player2');
  const [showScore] = useReplicant<boolean>('showScore');
  const [score] = useReplicant<Score>('score');
  const [commentators] = useReplicant<string[]>('commentators');
  const [tourneyStage] = useReplicant<string>('tourneyStage');
  const [timer] = useReplicant<Timer>('timer');

  return (
    <>
      <div id="backgrounds">
        <img src={showScore ? mainBg : mainBgNoBox} className="bg" />
      </div>
      {showScore && score && (
        <div id="score">
          {player1?.name} {score.player1} - {score.player2} {player2?.name}
        </div>
      )}
      {player1 && (
        <div id="player1" className="player">
          {player1.name && <span>{player1.name}</span>}
          {player1.pb && <span>{player1.pb}</span>}
          {player1.finishTime && <span>Finish Time: {player1.finishTime}</span>}
          {player1.extraInfo && (
            <>
              <br />
              {player1.extraInfo.split('<br>').map((line) => {
                return <span key={line}>{line}</span>;
              })}
            </>
          )}
        </div>
      )}
      {player2 && (
        <div id="player2" className="player">
          {player2.name && <span>{player2.name}</span>}
          {player2.pb && <span>{player2.pb}</span>}
          {player2.finishTime && <span>Finish Time: {player2.finishTime}</span>}
          {player2.extraInfo && (
            <>
              <br />
              {player2.extraInfo.split('<br>').map((line) => {
                return <span key={line}>{line}</span>;
              })}
            </>
          )}
        </div>
      )}
      {commentators && commentators.length > 0 && (
        <div id="commentators">
          <p>Commentators:</p>
          {commentators.map((commentator) => (
            <span key={commentator}>{commentator}</span>
          ))}
        </div>
      )}
      {tourneyStage && (
        <div id="tournament-stage">
          <p>Current stage:</p>
          {tourneyStage.split('<br>').map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      )}
      {timer && (
        <div id="timer" className={timer.phase}>
          {timer.time}
        </div>
      )}
    </>
  );
};

render(<App />);
