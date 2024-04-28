function Run-Flask {
    Write-Host "Запуск Flask проекта..."
    .\venv\Scripts\activate
    cd "backend\flask_sockets"
    code .
    python main.py
}



Run-Flask