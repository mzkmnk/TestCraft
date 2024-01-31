for fixture in ~/programming/TestCraft/backend/project/api/fixtures/*.json; do
    echo "Loading $fixture"
    python ~/programming/TestCraft/backend/project/manage.py loaddata "$fixture"
done
