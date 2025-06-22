Start-Process bun -ArgumentList "run", "dev" -RedirectStandardOutput "output.txt" -NoNewWindow
Get-Content ./output.txt -Wait