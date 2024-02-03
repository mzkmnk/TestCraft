#!/bin/bash
#mac linux unix系
#export VENV_PATH=
#chmod +x load_sh.sh

source "${VENV_PATH}/bin/activate"

PROJECT_ROOT="$(dirname "$0")"

python $PROJECT_ROOT/manage.py makemigrations
python $PROJECT_ROOT/manage.py migrate

FIXTURES_DIR="$PROJECT_ROOT/api/fixtures"

echo "PROJECT_ROOT: $PROJECT_ROOT"
echo "FIXTURES_DIR: $FIXTURES_DIR"

for file in $FIXTURES_DIR/*.json; do
    echo "Loading $file..."
    python $PROJECT_ROOT/manage.py loaddata "$file"
done

deactivate