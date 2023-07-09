import { wktToGeoJSON } from '@terraformer/wkt';
import csvParser from 'csv-parser';
import fs from 'fs';
import iconv from 'iconv-lite';
import JSONStream from 'jsonstream';
import { createRequire } from 'module';
import { Transform } from 'stream';
const require = createRequire(import.meta.url);
const shpStream = require('shp-stream');

/**
 * データ型を判定して、geojsonl のストリームを返す
 */
export default class GeoJsonL {
  public static convertToGeojsonL(path: string, decode: string) {
    const rs = this.convert(path, decode);
    const jsonlFile = path.split('.')[0] + '.geojsonl';

    const stream = rs.pipe(fs.createWriteStream(jsonlFile));

    return { stream, jsonlFile };
  }

  private static convert(path: string, decode: string) {
    // 拡張子に応じて変換処理を分岐
    const ext = path.split('.').pop();

    switch (ext) {
      case 'geojson':
      case 'json':
        return this.convertGeojson(path, decode);
      case 'csv':
        return this.convertCsv(path, decode);
      case 'shp':
        return this.convertShp(path, decode);
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }

  private static convertShp(path: string, decode: string) {
    const reader = shpStream.reader(path).createReadStream();

    const transform = new Transform({
      objectMode: true,
      transform: (row, _, done) => {
        const { geometry, properties } = row;
        const feature = {
          type: 'Feature',
          properties: properties,
          geometry: geometry,
        };

        const decoded = iconv.decode(
          Buffer.from(JSON.stringify(feature), 'binary'),
          decode
        );

        done(null, decoded + '\n');
      },
    });

    return reader.pipe(transform) as Transform;
  }

  private static convertGeojson(path: string, decode: string) {
    return fs
      .createReadStream(path)
      .pipe(iconv.decodeStream(decode))
      .pipe(JSONStream.parse(['features', true]))
      .pipe(JSONStream.stringify('', '\n', ''));
  }

  private static convertCsv(path: string, decode: string) {
    let wktColumn: string | undefined;

    const transform = new Transform({
      objectMode: true,
      transform: (row, _, done) => {
        if (!wktColumn) {
          wktColumn = this.hasWkt(row);
        }

        const { [wktColumn]: wkt, ...properties } = row;
        const geometry = wktToGeoJSON(wkt);

        const feature = {
          type: 'Feature',
          properties: properties,
          geometry: geometry,
        };

        done(null, JSON.stringify(feature) + '\n');
      },
    });

    return fs
      .createReadStream(path)
      .pipe(iconv.decodeStream(decode))
      .pipe(csvParser())
      .pipe(transform);
  }

  private static hasWkt(row: any) {
    let wktColumn: string | undefined;

    const rowArr = Object.entries(row);

    rowArr.forEach(([key, val]) => {
      try {
        if (typeof val !== 'string') return;

        if (val === '') return;

        // 無理矢理wktに変換してみる
        const geojson = wktToGeoJSON(val);

        // 変換できなかったら次へ
        if (!geojson) return;

        // feature か featureCollection だったら次へ
        if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection')
          return;

        // 既に wkt があったら、複数の wkt があるのでエラーを投げて終わる
        if (wktColumn) {
          throw new Error('Multiple WKT columns found');
        }

        // wkt があったら、そのカラム名を記録する
        wktColumn = key;
      } catch (error) {
        // 複数の wkt があるのでエラーを投げて終わる
        if (wktColumn) {
          throw new Error('Multiple WKT columns found');
        }

        // wkt がなかったら、次へ
        return;
      }
    });

    if (!wktColumn) {
      throw new Error('No WKT column found');
    }

    return wktColumn;
  }
}
