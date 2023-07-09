#!/bin/bash

# bash run.sh
#   -u <user>
#   -t <token>
#   -d <data_dir>
#   -e <encoding>

# パラメーターのデフォルト値
ENCODING="utf-8"

# パラメーターを解析する
while getopts :hu:t:d:e: OPT
do
    case $OPT in
        u) USER=$OPTARG;;
        t) TOKEN=$OPTARG;;
        d) DATA_DIR=$OPTARG;;
        e) ENCODING=$OPTARG;;
        h) cat help.txt
           exit 0;;
        \?) echo "Invalid option -$OPTARG" >&2
            exit 1;;
    esac
done

# 必須フラグが設定されていない場合はエラー
for VAR in USER TOKEN DATA_DIR
do
    if [ -z "${!VAR}" ]; then
        echo "$VAR is required." >&2
        exit 1
    fi
done

# ID 入力
# 英数字、ハイフンのみ
read -p $'\e[33mInput your tileset id\e[0m ' ID

if [[ $ID =~ ^[0-9a-zA-Z-]+$ ]]; then
    echo " "
    echo "Your tileset id: $ID"
    echo " "
else
    echo "Tileset id is alphanumeric characters and hyphens only."
    exit 1
fi

# レイヤ名入力
# 英数字、アンダースコアのみ
read -p $'\e[33mInput your layer id:\e[0m ' LAYER_NAME

if [[ $LAYER_NAME =~ ^[0-9a-zA-Z_]+$ ]]; then
    echo " "
    echo "Your layer name: $LAYER_NAME"
    echo " "
else
    echo "Layer names can only contain alphanumeric characters and underscores."
    exit 1
fi


# 対象ファイルのパスリストを作成
# ファイル名の拡張子が .json, .geojson, .csv, .shp のものを対象とする
# スペースで複数選択できる

IFS=$'\n' read -d '' -r -a files < <(ls $DATA_DIR/*.json $DATA_DIR/*.geojson $DATA_DIR/*.csv $DATA_DIR/*.shp)

# Add an "exit" option
files+=("exit")

# Display the files with their numbers
echo " "
echo $'\e[33mPlease select the target file (ex：「1,2,3」):\e[0m '

index=0
for file in "${files[@]}"
do
    file_name=$(basename "${file}")
    index=$((index+1))
    echo $index")" ${file_name}
done


# Read user input
read -p "Enter numbers: " input

IFS=',' read -ra input <<< "$input"
selected_files=()
for i in "${input[@]}"; do
    # Subtract 1 because arrays are 0-indexed
    index=$((i-1))

    # Check if input is a number and within the array bounds
    if [[ "$i" =~ ^[0-9]+$ ]] && (( index >= 0 )) && (( index < ${#files[@]} )); then
        # Check for the "exit" option
        if [[ "${files[$index]}" == "exit" ]]; then
            echo "Exit..."
            exit 0
        fi

        selected_files+=("${files[$index]}")
    else
        echo "Invalid selection: $i"
    fi
done

echo " "
echo "Selected files:"
echo " "
for file in "${selected_files[@]}"
do
    file_name=$(basename "${file}")
    echo ${file_name}
done
echo " "

# 確認メッセージを表示する
while true
do
    read -p $'\e[33mAre you sure to execute? (input \'understood\' to start):\e[0m ' answer
    if [[ $answer == 'understood' ]]; then
        break
    else
        echo "Aborted."
        exit 1
    fi
done

# トークンを環境変数に設定
export MAPBOX_ACCESS_TOKEN=$TOKEN

# 全ての変数を渡す
npm run ts-esm -- src/index.ts \
    -u $USER \
    -i $ID \
    -p $DATA_DIR \
    -l $LAYER_NAME \
    -d $ENCODING \
    -f "${selected_files[@]}" \
    -t $TOKEN
