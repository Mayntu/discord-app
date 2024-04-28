function Run-Django {
    Write-Host "Запуск Django проекта..."
    .\venv\Scripts\activate
    cd "backend\django_rest\discord"
    code .
    python manage.py runserver
}



Run-Django