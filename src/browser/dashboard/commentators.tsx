import { useReplicant } from '@nodecg/react-hooks';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import { render } from '../render';
import { useEffect, useState } from 'react';
import { Stack, Button, Divider, TextField, Tooltip, Fab } from '@mui/material';

const App = () => {
  const [commentators, setCommentators] = useReplicant<string[]>('commentators');

  const [localCommentators, setLocalCommentators] = useState<string[]>([]);

  useEffect(() => {
    if (typeof commentators === 'undefined') return;

    setLocalCommentators(commentators);
  }, [commentators]);

  return (
    <DashboardThemeProvider>
      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            setLocalCommentators([...localCommentators, '']);
          }}>
          <b>Add commentator</b>
        </Button>
        <Divider />
        {localCommentators.map((commentator, commentatorIndex) => {
          return (
            <div
              key={commentatorIndex}
              style={{
                display: 'flex',
                gap: '5px',
              }}>
              <div style={{ flexGrow: 1, padding: '10px' }}>
                <TextField
                  key={commentatorIndex}
                  variant="outlined"
                  value={commentator}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const newState = localCommentators.map((oldName, index) => {
                      if (index === commentatorIndex) {
                        return event.target.value;
                      }

                      return oldName;
                    });

                    setLocalCommentators(newState);
                  }}
                  label="Nickname"
                  fullWidth
                />
              </div>

              <div style={{ flexShrink: 0, flexBasis: 'auto', padding: '10px' }}>
                <Tooltip title="Remove commentator">
                  <Fab
                    color="primary"
                    aria-label="delete"
                    onClick={() => {
                      const newVal = Array.from(localCommentators);
                      newVal.splice(commentatorIndex, 1);
                      setLocalCommentators(newVal);
                    }}>
                    <DeleteIcon />
                  </Fab>
                </Tooltip>
              </div>
            </div>
          );
        })}
        <Button
          variant="contained"
          onClick={() => {
            setCommentators(localCommentators);
          }}
          disabled={localCommentators === commentators}>
          <b>Update commentators</b>
        </Button>
      </Stack>
    </DashboardThemeProvider>
  );
};

render(<App />);
