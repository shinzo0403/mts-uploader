import axios from 'axios';
import * as C from '../__constants__.js';
import Logger from '../logs/logger.js';
import { MTSRecipe } from '../types';
import { HelperMTS } from './__helpers__.js';

interface CreateMTSParamsR {
  id: string;
  user: string;
  datadir: string;
  layerName: string;
  minzoom?: number;
  maxzoom?: number;
}

class CreateMTS {
  private helper: HelperMTS;
  private url: string;
  private headers = C.CREATE_AND_PUBLISH_HEADERS;

  private tileset_id: string;
  private name: string;
  private datadir: string;

  constructor(private params: CreateMTSParamsR) {
    this.helper = new HelperMTS(params.id, params.user);

    this.url = this.helper.replaceUrl(C.CREATE_URL);
    this.tileset_id = `${params.user}.${params.id}`;
    this.name = params.id;
    this.datadir = params.datadir;

    this.params.minzoom = params.minzoom;
    this.params.maxzoom = params.maxzoom;
  }

  public async main(): Promise<void> {
    Logger.line('green', 'start', 'create start');

    const headers = this.headers;
    const recipe = this.createRecipe();
    const data = {
      recipe,
      tileset_id: this.tileset_id,
      name: this.name,
    };

    Logger.log('your formData', { color: 'magenta', emoji: ['🚀', 3] });
    Logger.log(data, { color: 'magenta' });

    // fetch
    Logger.log('fetching your recipe', {
      color: 'magenta',
      emoji: ['🛜', 3],
      newLine: true,
    });
    Logger.log('fetching....', { color: 'yellow' });

    try {
      const response = await axios.post(this.url, data, { headers });

      if (response.status === 200) {
        Logger.log('Fetching succeeded', { color: 'green', emoji: ['🎉', 3] });
        Logger.line('green', 'start', 'MTS Response', '=');
        Logger.log(response.data, { color: 'green' });
        Logger.line('green', 'end', '', '=');
      } else {
        Logger.log('Fetching failed', { color: 'red', emoji: ['🚨', 3] });
        Logger.log(response.data, { error: true });
      }
    } catch (error) {
      Logger.log('Fetching failed', { color: 'red', emoji: ['🚨', 3] });
      Logger.line('red', 'start', 'error');
      Logger.log(error, { color: 'red', error: true });
    }

    Logger.line('green', 'end', 'create end', '-');
    await this.helper.sleep(5);
  }

  private createRecipe(): MTSRecipe {
    const sourceId = this.helper.replaceId();

    const recipe = {
      version: 1,
      layers: {
        [this.params.layerName]: {
          source: sourceId,
          minzoom: this.params.minzoom ?? 2,
          maxzoom: this.params.maxzoom ?? 16,
        },
      },
    };

    // this.storeRecipe(recipe);

    return recipe;
  }

  //   private storeRecipe(recipe: MTSRecipe): void {
  //     const recipePath = this.datadir + '/recipe';
  //     const recipeName = this.params.id + '_recipe.json';
  //     const recipePathAndName = recipePath + '/' + recipeName;

  //     if (!fs.existsSync(recipePath)) {
  //       fs.mkdirSync(recipePath);
  //     }

  //     fs.writeFileSync(recipePathAndName, JSON.stringify(recipe));

  //     // --------------------
  //     Logger.log('your recipe is stored');
  //   }
}

export { CreateMTS };
