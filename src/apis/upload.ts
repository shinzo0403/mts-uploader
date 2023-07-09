import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import * as C from '../__constants__.js';
import Logger from '../logs/logger.js';
import GeoJsonL from './__data__.js';
import { HelperMTS } from './__helpers__.js';

interface UploadMTSParamsR {
  sourcePaths: string[];
  id: string;
  user: string;
  decode: string;
}

class UploadMTS {
  private helper: HelperMTS;
  private url: string;
  private headers = C.UPLOAD_HEADERS;
  private decode: string;

  constructor(private params: UploadMTSParamsR) {
    this.helper = new HelperMTS(params.id, params.user);

    this.url = this.helper.replaceUrl(C.UPLOAD_URL);
    this.decode = params.decode;
  }

  public async main(): Promise<void> {
    Logger.line('green', 'start', 'upload start');

    // ファイルパスを回して、アップロードする
    for (const sourcePath of this.params.sourcePaths) {
      Logger.log('uploading your file', {
        color: 'magenta',
        emoji: ['🛜', 3],
        newLine: true,
      });

      const filel = await this.transformToGeojsonl(sourcePath);

      this.checkFileSize(filel);

      const formData = this.createFormData(filel);

      await this.fetch(formData);

      await this.helper.sleep(10);

      // delete file
      this.deleteFilel(filel);
    }

    Logger.line('green', 'end', 'upload end');
    await this.helper.sleep(5);
  }

  /**
   * @desc リクエストボディを作成する
   * @param filel geojsonl ファイルパス
   * @returns FormData
   */
  private createFormData(filel: string): FormData {
    // check if file exists
    if (!fs.existsSync(filel)) {
      throw new Error(`🚨🚨🚨 File ${filel} not found 🚨🚨🚨`);
    }

    const stream = fs.createReadStream(filel);

    const formData = new FormData();
    formData.append('file', stream);
    formData.append('username', this.params.user);
    formData.append('id', this.params.id);

    return formData;
  }

  private async fetch(formData: FormData): Promise<void> {
    const headers = this.headers;

    Logger.log('fetching your file', {
      color: 'magenta',
      emoji: ['🛜', 3],
      newLine: true,
    });
    Logger.log('fetching....', { color: 'yellow' });

    try {
      const response = await axios.post(this.url, formData, {
        headers,
      });

      if (response.status === 200) {
        Logger.log('fetching success', {
          color: 'green',
          emoji: ['🛜', 3],
          newLine: true,
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
  }

  /**
   * @desc geojson - featureCollection を geojsonl に変換する
   * @param file geojson ファイルパス
   * @returns geojsonl ファイルパス
   */
  private async transformToGeojsonl(file: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const { stream, jsonlFile } = GeoJsonL.convertToGeojsonL(
        file,
        this.decode
      );

      Logger.log('Start parsing into JSON', {
        color: 'magenta',
        emoji: ['💫', 3],
        newLine: true,
      });
      Logger.log('parsing....', { color: 'yellow' });

      stream.on('error', (err) => {
        Logger.log('parsing failed', {
          color: 'red',
        });
        reject(err);
      });

      stream.on('finish', () => {
        Logger.log('parsing success', {
          color: 'green',
          emoji: ['💫', 3],
          newLine: true,
        });
        resolve(jsonlFile);
      });
    });
  }

  private deleteFilel(filel: string): void {
    fs.unlinkSync(filel);

    if (fs.existsSync(filel)) {
      throw new Error(`🚨🚨🚨 Delete JSONL file failed 🚨🚨🚨`);
    }

    Logger.log('delete JSONL file success', {
      color: 'green',
      emoji: ['🗑', 3],
      newLine: true,
    });
  }

  /**
   * @desc ファイルサイズが 10GB 以下かチェックする
   * @param file
   */
  private checkFileSize(file: string): void {
    console.log('🛰🛰🛰 Checking your geojson file size 🛰🛰🛰');

    const stats = fs.statSync(file);
    const fileSizeInBytes = stats.size;
    const fileSizeInGigaBytes = fileSizeInBytes / 1000000000.0;
    if (fileSizeInGigaBytes > 10) {
      throw new Error(
        `🚨🚨🚨 File ${file} is too big. Max size is 10GB 🚨🚨🚨`
      );
    } else {
      Logger.log('file size check success', {
        color: 'green',
        emoji: ['🛰', 3],
        newLine: true,
      });
    }
  }
}

export { UploadMTS };
