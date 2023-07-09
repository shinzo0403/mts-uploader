import { CreateMTS } from './apis/create.js';
import { PublishMTS } from './apis/publish.js';
import { UploadMTS } from './apis/upload.js';
import { getArgs } from './getArgs.js';
import { UploadMTSParams } from './types';

const index = async (input: UploadMTSParams) => {
  const uploadCommand = new UploadMTS({
    id: input.id,
    user: input.user,
    sourcePaths: input.sourcePaths,
    decode: input.decode,
  });

  const createCommand = new CreateMTS({
    id: input.id,
    user: input.user,
    layerName: input.layerName,
    datadir: input.datadir,
  });

  const publishCommand = new PublishMTS({
    id: input.id,
    user: input.user,
  });

  await uploadCommand.main();
  await createCommand.main();
  await publishCommand.main();

  return;
};

// ====================== ここで実行 ======================

(async () => {
  const input = await getArgs();

  await index(input);

  return process.exit(0);
})();
