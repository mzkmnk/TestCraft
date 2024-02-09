call .\.venv\Scripts\activate.bat
echo "loading fixtures..."
for %%f in (.\backend\project\api\fixtures\*.json) do (
    echo "loading %%f..."
    python .\backend\project\manage.py loaddata %%f
)
pause
