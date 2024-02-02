@echo off
echo "cleaning up environment..."
if exist ".\backend\project\api\migrations" (rmdir /s /q ".\backend\project\api\migrations")
if exist ".\backend\project\db.sqlite3" (del ".\backend\project\db.sqlite3")

echo "setup environment..."
if not exist (.\.venv) (python -m venv .venv)
call .\.venv\Scripts\activate.bat

echo "installing requirements..."
pip install -r requirements.txt

echo "migrating database..."
mkdir .\backend\project\api\migrations
type nul > .\backend\project\api\migrations\__init__.py
python .\backend\project\manage.py makemigrations &&^
python .\backend\project\manage.py migrate

echo "loading fixtures..."
for %%f in (.\backend\project\api\fixtures\*.json) do (
    echo "loading %%f..."
    python .\backend\project\manage.py loaddata %%f
)

echo "creating superuser..."
python .\backend\project\manage.py createsuperuser

echo "installing frontend packages..."
cd .\frontend\app
npm install
exit 0