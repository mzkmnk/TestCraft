.\.venv\Scripts\activate.bat & start python .\backend\project\manage.py runserver &^
cd .\frontend\app &^
npm run build &^
start npx serve -s build -l 3000 &^
exit