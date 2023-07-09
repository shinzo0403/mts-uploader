# MTS (mapbox tiling services) アップローダー

<br />

## NEW!!!

<br />

csv, shp ファイルにも対応しました。

- csv : wkt を持つカラムを自動で検索して geojson に変換します。wkt を複数持つファイルはエラーを吐きます

- shp : .dbf ファイルが必須です。存在しない場合はエラーを吐きます

<br />

エンコードを選択できるようにしました。（デフォルトは `utf-8`）

<br />

---

<br />

## 1. **ローカル実行**

<br />

コマンド

```sh
$ npm i

$ bash run.sh
    -u <user>
    -t <token>
    -d <data_dir>
    -e <encoding>
```

<br />

---

<br />

## 2. **引数**

<br />

タイルセット名選択（Studio で表示される名前）

```txt
タイルセット名: mytest
```

<br />

レイヤ名選択（tileset の中の layer 名）

```txt
レイヤ名: testlayer
```

<br />

アップロードする JSON / GeoJSON ファイルのパス

```txt
対象のファイルを選択してください（例：「1,2,3」）:
1) test.json
2) test_2.geojson
3) exit
Enter numbers: 1,2
```

※ 最大 5 つまで選択可能
