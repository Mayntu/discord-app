Start-Process powershell -WorkingDirectory $PWD -ArgumentList "-NoExit", "-Command", "& .\RunDjango.ps1"
Start-Process powershell -WorkingDirectory $PWD -ArgumentList "-NoExit", "-Command", "& .\RunFlask.ps1"
Start-Process powershell -WorkingDirectory $PWD -ArgumentList "-NoExit", "-Command", "& .\RunFlaskRTC.ps1"
Start-Process powershell -WorkingDirectory $PWD -ArgumentList "-NoExit", "-Command", "& .\RunReact.ps1"