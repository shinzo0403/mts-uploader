import dotenv from 'dotenv';

dotenv.config();

/** アップロード用 URL */
export const UPLOAD_URL =
  'https://api.mapbox.com/tilesets/v1/sources/{MTS_USER}/{MTS_ID}?access_token={MTS_TOKEN}';

/** アップロード用 headers */
export const UPLOAD_HEADERS = {
  'Content-Type': 'multipart/form-data',
};

/** 作成用 URL */
export const CREATE_URL =
  'https://api.mapbox.com/tilesets/v1/{MTS_USER}.{MTS_ID}?access_token={MTS_TOKEN}';

/** 公開用 URL */
export const PUBLISH_URL =
  'https://api.mapbox.com/tilesets/v1/{MTS_USER}.{MTS_ID}/publish?access_token={MTS_TOKEN}';

/** 作成・公開用 headers */
export const CREATE_AND_PUBLISH_HEADERS = {
  'Content-Type': 'application/json',
};

/** tilesets ソース ID */
export const SOURCE_ID = 'mapbox://tileset-source/{MTS_USER}/{MTS_ID}';
