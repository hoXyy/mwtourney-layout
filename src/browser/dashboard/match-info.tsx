import { render } from '../render';
import { useReplicant } from '@nodecg/react-hooks';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { PlayerData } from 'src/types/custom';
import { useEffect, useState } from 'react';

export const MatchInfo = () => {
  const [tourneyStage, setTourneyStage] = useReplicant<string>('tourneyStage');
  const [player1Info, setPlayer1Info] = useReplicant<PlayerData>('player1');
  const [player2Info, setPlayer2Info] = useReplicant<PlayerData>('player2');

  const [localTourneyStage, setLocalTourneyStage] = useState('');
  const [localPlayer1Info, setLocalPlayer1Info] = useState<PlayerData>({
    name: '',
    src: '',
    pb: '',
    manualPb: false,
    extraInfo: '',
  });
  const [localPlayer2Info, setLocalPlayer2Info] = useState<PlayerData>({
    name: '',
    src: '',
    pb: '',
    manualPb: false,
    extraInfo: '',
  });

  useEffect(() => {
    if (typeof tourneyStage === 'undefined') return;

    setLocalTourneyStage(tourneyStage);
  }, [tourneyStage]);

  useEffect(() => {
    if (typeof player1Info === 'undefined') return;

    setLocalPlayer1Info(player1Info);
  }, [player1Info]);

  useEffect(() => {
    if (typeof player2Info === 'undefined') return;

    setLocalPlayer2Info(player2Info);
  }, [player2Info]);

  return (
    <DashboardThemeProvider>
      <Stack spacing={2}>
        <TextField
          variant="outlined"
          value={localTourneyStage}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setLocalTourneyStage(event.target.value);
          }}
          label="Tournament Stage"
          fullWidth
          helperText="Use <br> to go to a new line"
        />
        <Button
          variant="contained"
          onClick={() => {
            setTourneyStage(localTourneyStage);
          }}
          disabled={localTourneyStage === tourneyStage}>
          Update tournament stage
        </Button>
        <Divider />
        <Typography variant="h6">Player 1 Info</Typography>
        <TextField
          variant="outlined"
          value={localPlayer1Info.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = { ...localPlayer1Info, name: event.target.value };
            setLocalPlayer1Info(newVal);
          }}
          label="Name"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={localPlayer1Info.src}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = { ...localPlayer1Info, src: event.target.value };
            setLocalPlayer1Info(newVal);
          }}
          label="Speedrun.com name"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={localPlayer1Info.pb}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = { ...localPlayer1Info, pb: event.target.value };
            setLocalPlayer1Info(newVal);
          }}
          label="PB"
          fullWidth
          disabled={!localPlayer1Info.manualPb}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={localPlayer1Info?.manualPb}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const newVal = { ...localPlayer1Info, manualPb: event.target.checked };
                  setLocalPlayer1Info(newVal);
                }}
              />
            }
            label="Update PB manually"
          />
        </FormGroup>
        <TextField
          variant="outlined"
          value={localPlayer1Info.extraInfo}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = { ...localPlayer1Info, extraInfo: event.target.value };
            setLocalPlayer1Info(newVal);
          }}
          label="Extra Player Info"
          helperText="Used for Group Stage info, etc. - Use <br> for new line"
          fullWidth
        />
        <Button
          variant="contained"
          onClick={() => {
            setPlayer1Info(localPlayer1Info);
          }}
          disabled={localPlayer1Info === player1Info}>
          Update player 1 info
        </Button>
        <Divider />
        <Typography variant="h6">Player 2 Info</Typography>
        <TextField
          variant="outlined"
          value={localPlayer2Info.name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = { ...localPlayer2Info, name: event.target.value };
            setLocalPlayer2Info(newVal);
          }}
          label="Name"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={localPlayer2Info.src}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = { ...localPlayer2Info, src: event.target.value };
            setLocalPlayer2Info(newVal);
          }}
          label="Speedrun.com name"
          fullWidth
        />
        <TextField
          variant="outlined"
          value={localPlayer2Info.pb}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = { ...localPlayer2Info, pb: event.target.value };
            setLocalPlayer2Info(newVal);
          }}
          label="PB"
          fullWidth
          disabled={!localPlayer2Info.manualPb}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={localPlayer2Info?.manualPb}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const newVal = { ...localPlayer2Info, manualPb: event.target.checked };
                  setLocalPlayer2Info(newVal);
                }}
              />
            }
            label="Update PB manually"
          />
        </FormGroup>
        <TextField
          variant="outlined"
          value={localPlayer2Info.extraInfo}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const newVal = { ...localPlayer2Info, extraInfo: event.target.value };
            setLocalPlayer2Info(newVal);
          }}
          label="Extra Player Info"
          helperText="Used for Group Stage info, etc. - Use <br> for new line"
          fullWidth
        />
        <Button
          variant="contained"
          onClick={() => {
            setPlayer2Info(localPlayer2Info);
          }}
          disabled={localPlayer2Info === player2Info}>
          Update player 2 info
        </Button>
      </Stack>
    </DashboardThemeProvider>
  );
};

render(<MatchInfo />);
