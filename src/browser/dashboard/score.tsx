import { useReplicant } from '@nodecg/react-hooks';
import { render } from '../render';
import { PlayerData } from 'src/types/custom';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Score as ScoreType } from 'src/types/generated/score';
import { Add, Remove } from '@mui/icons-material';

export const Score = () => {
  const [score, setScore] = useReplicant<ScoreType>('score');
  const [showScore, setShowScore] = useReplicant<boolean>('showScore');
  const [player1Info] = useReplicant<PlayerData>('player1');
  const [player2Info] = useReplicant<PlayerData>('player2');

  return (
    <DashboardThemeProvider>
      <Stack spacing={2}>
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={showScore}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setShowScore(event.target.checked);
                }}
              />
            }
            label="Show score"
          />
        </FormControl>

        <Grid container spacing={2}>
          <Grid item xs={5}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {player1Info?.name} - {score?.player1}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const newVal = (score?.player1 ?? 0) + 1;
                      setScore({ player2: score?.player2 ?? 0, player1: newVal });
                    }}>
                    <Add />
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const newVal = (score?.player1 ?? 0) - 1;
                      setScore({ player2: score?.player2 ?? 0, player1: newVal });
                    }}>
                    <Remove />
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          <Grid item xs={1}>
            <Divider orientation="vertical" />
          </Grid>
          <Grid item xs={5}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ textAlign: 'center' }}>
                {player2Info?.name} - {score?.player2}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const newVal = (score?.player2 ?? 0) + 1;
                      setScore({ player1: score?.player1 ?? 0, player2: newVal });
                    }}>
                    <Add />
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const newVal = (score?.player2 ?? 0) - 1;
                      setScore({ player1: score?.player1 ?? 0, player2: newVal });
                    }}>
                    <Remove />
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
        <Divider />
        <Button
          variant="contained"
          onClick={() => {
            setScore({ player1: 0, player2: 0 });
          }}>
          Reset score
        </Button>
      </Stack>
    </DashboardThemeProvider>
  );
};

render(<Score />);
