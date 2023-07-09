import axios from 'axios';
import * as C from '../__constants__.js';
import Logger from '../logs/logger.js';
import { HelperMTS } from './__helpers__.js';

interface PublishMTSParamsR {
  id: string;
  user: string;
}

class PublishMTS {
  private helper: HelperMTS;
  private url: string;
  private headers = C.CREATE_AND_PUBLISH_HEADERS;

  private tileset_id: string;

  constructor(private params: PublishMTSParamsR) {
    this.helper = new HelperMTS(params.id, params.user);

    this.url = this.helper.replaceUrl(C.PUBLISH_URL);
    this.tileset_id = `${params.user}.${params.id}`;
  }

  public async main(): Promise<void> {
    Logger.line('green', 'start', 'publish start');

    const headers = this.headers;
    const data = {
      tileset_id: this.tileset_id,
    };

    // fetch
    Logger.log('publishing your data', {
      color: 'magenta',
      emoji: ['🛜', 3],
      newLine: true,
    });
    Logger.log('publishing....', { color: 'yellow' });

    try {
      const response = await axios.post(this.url, data, { headers });

      if (response.status === 200) {
        Logger.log('Fetching success', {
          color: 'green',
          emoji: ['🎉', 3],
        });
        Logger.line('green', 'start', 'MTS Response', '=');
        Logger.log(response.data, { color: 'green' });
        Logger.line('green', 'end', '', '=');
      } else {
        Logger.line('red', 'start', 'MTS Response', '=');
        Logger.log(response.data, { color: 'red' });
        Logger.line('red', 'end', '', '=');
        throw new Error(`🚨🚨🚨 Fetching failed 🚨🚨🚨`);
      }
    } catch (error) {
      Logger.line('red', 'start', 'MTS Response', '=');
      Logger.log(error, { color: 'red' });
      Logger.line('red', 'end', '', '=');
      throw new Error(`🚨🚨🚨 Fetching failed 🚨🚨🚨`);
    }

    Logger.line('green', 'end', 'publish end');
  }
}

export { PublishMTS };
