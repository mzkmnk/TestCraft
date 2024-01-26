python -m venv .venv &^
.\.venv\Scripts\activate.bat &^
pip install -r requirements.txt &^
python .\backend\project\manage.py makemigrations &^
python .\backend\project\manage.py migrate &^
cd .\frontend\app &^
npm install &^
exit