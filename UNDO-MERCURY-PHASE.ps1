$ErrorActionPreference = 'Stop'
$phaseRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$phaseBackup = Join-Path $phaseRoot '.review-backup/mercury-style-v4'
$phaseFiles = @('src/components/NovaSprite.tsx','src/components/StarLearningLab.tsx','src/routes/index.tsx','src/routes/__root.tsx')
foreach($phaseFile in $phaseFiles) { if(-not(Test-Path -LiteralPath (Join-Path $phaseBackup $phaseFile))) { throw "Missing backup: $phaseFile" } }
$phaseSafety = Join-Path $phaseRoot ('.review-backup/before-mercury-undo-' + [Guid]::NewGuid().ToString('N'))
foreach($phaseFile in $phaseFiles) {
  $phaseTarget = [IO.Path]::GetFullPath((Join-Path $phaseRoot $phaseFile))
  if(-not $phaseTarget.StartsWith($phaseRoot + [IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Invalid restore target'}
  $phaseSave = Join-Path $phaseSafety $phaseFile
  New-Item -ItemType Directory -Path (Split-Path $phaseSave) -Force | Out-Null
  Copy-Item -LiteralPath $phaseTarget -Destination $phaseSave
}
foreach($phaseFile in $phaseFiles){Copy-Item -LiteralPath (Join-Path $phaseBackup $phaseFile) -Destination (Join-Path $phaseRoot $phaseFile)}
Write-Host "Previous Nova/layout/font restored. Current files saved at $phaseSafety. Restart npm run dev."
Write-Host 'No videos, assets, music, or saved player progress were deleted.'
