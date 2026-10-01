$ErrorActionPreference = 'Stop'
$phaseRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$phaseFile = 'src/routes/missions.$missionId.$levelId.tsx'
$phaseBackup = Join-Path $phaseRoot ('.review-backup/star-colors-v9/' + $phaseFile)
$phaseTarget = [IO.Path]::GetFullPath((Join-Path $phaseRoot $phaseFile))
if (-not $phaseTarget.StartsWith($phaseRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid restore target' }
if (-not (Test-Path -LiteralPath $phaseBackup)) { throw 'Original phase backup is missing' }
$phaseSafety = Join-Path $phaseRoot ('.review-backup/before-star-colors-undo-' + [Guid]::NewGuid().ToString('N'))
$phaseSave = Join-Path $phaseSafety $phaseFile
New-Item -ItemType Directory -Path (Split-Path $phaseSave) -Force | Out-Null
Copy-Item -LiteralPath $phaseTarget -Destination $phaseSave
Copy-Item -LiteralPath $phaseBackup -Destination $phaseTarget
Write-Host "Previous Mission 4 restored. Current route saved at $phaseSafety."
Write-Host 'New color activity files remain unused. Player progress and all media are preserved.'
