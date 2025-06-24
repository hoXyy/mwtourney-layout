import { Configschema } from 'src/types/generated';
import type NodeCG from 'nodecg/types';
import { initSrc } from './sr-com';
import { initTimer } from './timer';

export default (nodecg: NodeCG.ServerAPI<Configschema>) => {
  initSrc(nodecg).then(() => {
    nodecg.log.info('Speedrun.com module ready.');
  });
  initTimer(nodecg).then(() => {
    nodecg.log.info('Timer module ready.');
  });
};
