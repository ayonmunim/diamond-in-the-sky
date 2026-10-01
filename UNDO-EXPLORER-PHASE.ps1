$ErrorActionPreference = 'Stop'
$phaseRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$phaseFile = 'src/components/UniverseExplorer.tsx'
$phaseBackup = Join-Path $phaseRoot ('.review-backup/explorer-v5/' + $phaseFile)
if (-not (Test-Path -LiteralPath $phaseBackup)) { throw 'Explorer backup is missing. No files changed.' }
$phaseTarget = [IO.Path]::GetFullPath((Join-Path $phaseRoot $phaseFile))
if (-not $phaseTarget.StartsWith($phaseRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid restore target' }
$phaseSafety = Join-Path $phaseRoot ('.review-backup/before-explorer-undo-' + [Guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Path $phaseSafety | Out-Null
Copy-Item -LiteralPath $phaseTarget -Destination (Join-Path $phaseSafety 'UniverseExplorer.tsx')
Copy-Item -LiteralPath $phaseBackup -Destination $phaseTarget
Write-Host "Previous explorer restored. Current explorer saved at $phaseSafety."
Write-Host 'New helper files and images remain unused. No videos or player progress were removed.'
