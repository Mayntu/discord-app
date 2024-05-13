function Run-Flask {
    Write-Host "Запуск Flask проекта..."
    .\venv\Scripts\activate
    cd "backend\flask_webrtc"
    code .
    python signaling_server.py
}



Run-Flask