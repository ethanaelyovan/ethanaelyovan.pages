# make-forza-manifest.ps1
# Lists the photos inside every car folder of assets\forza and writes assets\forza\manifest.js,
# which the website reads. Run it whenever you add, remove or rename photos:
#
#     powershell -ExecutionPolicy Bypass -File make-forza-manifest.ps1
#
# (run it from the folder that contains index.html)
$root = Join-Path $PSScriptRoot 'assets\forza'
$exts = '.webp', '.jpg', '.jpeg', '.png', '.avif'
$map  = [ordered]@{}

foreach ($dir in (Get-ChildItem -Path $root -Directory | Sort-Object Name)) {
    $files = Get-ChildItem -Path $dir.FullName -File |
        Where-Object { $exts -contains $_.Extension.ToLower() } |
        Sort-Object { [regex]::Replace($_.Name, '\d+', { param($m) $m.Value.PadLeft(10, '0') }) }   # imagef2 before imagef10
    $map[$dir.Name] = @($files | ForEach-Object { $_.Name })
}

$json = $map | ConvertTo-Json -Depth 3
"window.FORZA_MANIFEST = $json;" | Set-Content -Path (Join-Path $root 'manifest.js') -Encoding UTF8

Write-Host 'Wrote assets\forza\manifest.js'
foreach ($k in $map.Keys) { Write-Host ('  {0}: {1} photos' -f $k, @($map[$k]).Count) }