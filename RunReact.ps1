function Run-React {
    Write-Host "Запуск React приложения..."
    cd "frontend"
    code .
    npm i
    npm run dev
}




Run-React