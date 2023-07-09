interface UploadMTSParamsR {
  sourcePaths: string[];
  id: string;
  user: string;
  layerName: string;
  decode: string;
  datadir: string;
}

interface UploadMTSParamsO {
  minzoom: number;
  maxzoom: number;
  toGeojsonl: boolean;
}

export type UploadMTSParams = Required<UploadMTSParamsR> &
  Partial<UploadMTSParamsO>;

export interface MTSRecipe {
  version: number;
  layers: {
    [key: string]: {
      source: string;
      minzoom: number;
      maxzoom: number;
    };
  };
}
