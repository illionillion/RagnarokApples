# ビルド方法

- まずは`npm i`を実行してモジュールをインストール
- `npm run start`でElectronアプリ起動
  - その前に`.env`ファイルを作る
  - Windows
    - `ni .env`
  - Mac
    - `touch .env`
  - 以下を入力

```
# asarファイルダウンロード先
ASAR_URL = "URLを入力"
# ローカルで読み込ませたいフォルダ先
LOCAL_BUILD_DIR = "フォルダ名を入力"
# シナリオのJSONデータのURL
SCENARIO_DATA_JSON = "URLを入力"
# シナリオBGMのJSONデータのURL
SCENARIO_AUDIO_DATA_JSON = "URLを入力"
# シナリオマップのJSONデータのURL
SCENARIO_MAP_DATA_JSON = "URLを入力"

```

- `npm run build-win`でElectronアプリインストーラー作成
  - Macの場合は`npm run build-mac`
- `npm run asar-pack 対象ディレクトリ名 render.asar`でasarファイル作成
- 詳しくは[package.json](./package.json)を参照