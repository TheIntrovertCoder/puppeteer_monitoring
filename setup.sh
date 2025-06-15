echo Installing bun
powershell -c "Clear-Host; irm bun.sh/install.ps1 | iex; Clear-Host; Write-Host 'Completed - Installing Bun'; Start-Process powershell; exit"