param(
    [string]$Root = $PSScriptRoot,
    [int]$Port = 8731
)

$dataDir = Join-Path $Root "server-data"
if (-not (Test-Path $dataDir)) { New-Item -ItemType Directory -Path $dataDir | Out-Null }
$stateFile = Join-Path $dataDir "state.json"
$playersFile = Join-Path $dataDir "players.json"
if (-not (Test-Path $stateFile)) { '{"currentRound":0}' | Set-Content -Path $stateFile -Encoding utf8 }
if (-not (Test-Path $playersFile)) { '[]' | Set-Content -Path $playersFile -Encoding utf8 }

$lanIp = $null
try {
    $lanIp = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop |
        Where-Object { $_.IPAddress -notlike "169.254.*" -and $_.IPAddress -ne "127.0.0.1" -and $_.PrefixOrigin -ne "WellKnown" } |
        Select-Object -First 1).IPAddress
} catch {}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$lanBound = $false

if ($lanIp) {
    $listener.Prefixes.Add("http://$lanIp`:$Port/")
    try {
        $listener.Start()
        $lanBound = $true
    } catch {
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("http://localhost:$Port/")
        $listener.Start()
    }
} else {
    $listener.Start()
}

Write-Host "Matrix Mystery Mania server running."
Write-Host "  On this computer: http://localhost:$Port/"
if ($lanBound) {
    Write-Host "  For phones on the same WiFi: http://$lanIp`:$Port/"
} elseif ($lanIp) {
    Write-Host ""
    Write-Host "  Phones on the same WiFi can't reach this yet (Windows needs permission for network access)."
    Write-Host "  Fix it with ONE of these, then restart this script:"
    Write-Host "    1) Right-click start-server.bat -> Run as administrator"
    Write-Host "    2) Or run once in an Administrator PowerShell window:"
    Write-Host "       netsh http add urlacl url=http://$lanIp`:$Port/ user=Everyone"
} else {
    Write-Host "  Could not detect a LAN IP automatically. Run 'ipconfig' and use your IPv4 address with port $Port."
}

$mime = @{
    ".html" = "text/html"; ".css" = "text/css"; ".js" = "application/javascript";
    ".json" = "application/json"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg";
    ".png" = "image/png"; ".gif" = "image/gif"; ".webp" = "image/webp";
    ".jfif" = "image/jpeg"; ".avif" = "image/avif"; ".mpeg" = "audio/mpeg";
    ".mp3" = "audio/mpeg"; ".wav" = "audio/wav"; ".pdf" = "application/pdf";
}

function Send-JsonRaw($res, [string]$jsonString, [int]$status = 200) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonString)
    $res.StatusCode = $status
    $res.ContentType = "application/json"
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
}

function To-JsonArrayString($arr) {
    if ($null -eq $arr -or $arr.Count -eq 0) { return "[]" }
    if ($arr.Count -eq 1) { return "[" + ($arr[0] | ConvertTo-Json -Depth 20 -Compress) + "]" }
    return ($arr | ConvertTo-Json -Depth 20 -Compress)
}

function Read-JsonBody($req) {
    $reader = New-Object System.IO.StreamReader($req.InputStream, $req.ContentEncoding)
    $body = $reader.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($body)) { return $null }
    return $body | ConvertFrom-Json
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    $res.Headers.Add("Cache-Control", "no-store")
    try {
        $path = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)

        if ($path -eq "/api/state" -and $req.HttpMethod -eq "GET") {
            $json = Get-Content $stateFile -Raw
            Send-JsonRaw $res $json
        }
        elseif ($path -eq "/api/state" -and $req.HttpMethod -eq "POST") {
            $body = Read-JsonBody $req
            $state = [PSCustomObject]@{
                currentRound = [int]$body.currentRound
                updatedAt    = (Get-Date).ToString("o")
            }
            ($state | ConvertTo-Json -Compress) | Set-Content -Path $stateFile -Encoding utf8
            Send-JsonRaw $res ($state | ConvertTo-Json -Compress)
        }
        elseif ($path -eq "/api/players" -and $req.HttpMethod -eq "GET") {
            $players = Get-Content $playersFile -Raw | ConvertFrom-Json
            if ($null -eq $players) { $players = @() }
            Send-JsonRaw $res (To-JsonArrayString $players)
        }
        elseif ($path -eq "/api/players" -and $req.HttpMethod -eq "POST") {
            $body = Read-JsonBody $req
            $players = Get-Content $playersFile -Raw | ConvertFrom-Json
            if ($null -eq $players) { $players = @() }

            switch ($body.action) {
                "register" {
                    $players = @($players) + $body.record
                }
                "update" {
                    foreach ($p in $players) {
                        if ($p.id -eq $body.id) {
                            foreach ($prop in $body.patch.PSObject.Properties) {
                                $p | Add-Member -NotePropertyName $prop.Name -NotePropertyValue $prop.Value -Force
                            }
                        }
                    }
                }
                "reset" {
                    $players = @()
                }
            }

            $jsonOut = To-JsonArrayString $players
            $jsonOut | Set-Content -Path $playersFile -Encoding utf8
            Send-JsonRaw $res $jsonOut
        }
        else {
            if ($path -eq "/") { $path = "/index.html" }
            $filePath = Join-Path $Root ($path.TrimStart("/"))
            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = $mime[$ext]
                if (-not $contentType) { $contentType = "application/octet-stream" }
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $res.ContentType = $contentType
                $res.ContentLength64 = $bytes.Length
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $res.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
                $res.OutputStream.Write($msg, 0, $msg.Length)
            }
        }
    } catch {
        $res.StatusCode = 500
        $msg = [System.Text.Encoding]::UTF8.GetBytes("500 Server Error: $($_.Exception.Message)")
        try { $res.OutputStream.Write($msg, 0, $msg.Length) } catch {}
    } finally {
        $res.OutputStream.Close()
    }
}
