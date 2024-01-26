python -m venv .venv &^
.\.venv\Scripts\activate.bat &^
pip install -r requirements.txt &^
mkdir .\backend\project\api\migrations &^
type nul > .\backend\project\api\migrations\__init__.py &^
python .\backend\project\manage.py makemigrations &^
python .\backend\project\manage.py migrate &^
python .\backend\project\manage.py  createsuperuser&^
cd .\frontend\app &^
npm install &^
exit