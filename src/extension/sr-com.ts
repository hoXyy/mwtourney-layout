import type NodeCG from 'nodecg/types';
import { getPlayerData } from './util/sr-com';
import { Configschema } from 'src/types/generated';
import { PlayerData } from 'src/types/custom';

export async function initSrc(nodecg: NodeCG.ServerAPI<Configschema>) {
  const player1 = nodecg.Replicant<PlayerData>('player1');
  const player2 = nodecg.Replicant<PlayerData>('player2');

  player1.on('change', async (newVal, oldVal) => {
    if (player1.value) {
      if (newVal?.src && !newVal.manualPb) {
        if (newVal.src !== oldVal?.src) {
          const pb = await getPlayerData(newVal.src);
          player1.value.pb = pb;
        }
      }
    }
  });

  player2.on('change', async (newVal, oldVal) => {
    if (player2.value) {
      if (newVal?.src && !newVal.manualPb) {
        if (newVal.src !== oldVal?.src) {
          const pb = await getPlayerData(newVal.src);
          player2.value.pb = pb;
        }
      }
    }
  });
}
