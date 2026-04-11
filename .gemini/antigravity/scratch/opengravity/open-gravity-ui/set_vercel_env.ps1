$envFile = "C:\Users\Usuario\.gemini\antigravity\scratch\opengravity\open-gravity-ui\.env"
Get-Content $envFile | ForEach-Object {
    if ($_ -match "^([^=]+)=(.*)$") {
        $key = $matches[1].Trim()
        $val = $matches[2].Trim()
        if ($val -startsWith '"' -and $val -endsWith '"') { $val = $val.Substring(1, $val.Length - 2) }
        Write-Host "Setting $key on Vercel..."
        echo $val | vercel env add $key production
    }
}
