import yargs from 'yargs';
import { UploadMTSParams } from './types';

export const getArgs = async (): Promise<UploadMTSParams> => {
  const argv = yargs.options({
    u: { type: 'string', demandOption: true }, // username
    i: { type: 'string', demandOption: true }, // id of the map
    l: { type: 'string', demandOption: true }, // name of the layer
    d: { type: 'string', demandOption: true }, // decode type
    p: { type: 'string', demandOption: true }, // path to the data directory
    f: { type: 'array', demandOption: true }, // files to upload
    t: { type: 'string', demandOption: true }, // access token
  }).argv;

  const arg = await argv;

  return {
    user: arg['u'],
    id: arg['i'],
    layerName: arg['l'],
    sourcePaths: arg['f'] as string[],
    decode: arg['d'],
    datadir: arg['p'],
  };
};
