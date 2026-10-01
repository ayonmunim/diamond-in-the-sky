$ErrorActionPreference = 'Stop'
$phaseRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$phaseFiles = @('src/components/StarLearningLab.tsx','src/routes/missions.$missionId.$levelId.tsx')
$phaseBackup = Join-Path $phaseRoot '.review-backup/gas-story-v7'
foreach($phaseFile in $phaseFiles) { if(-not(Test-Path -LiteralPath (Join-Path $phaseBackup $phaseFile))) { throw "Missing backup: $phaseFile" } }
$phaseSafety = Join-Path $phaseRoot ('.review-backup/before-gas-story-undo-' + [Guid]::NewGuid().ToString('N'))
foreach($phaseFile in $phaseFiles) {
  $phaseTarget = [IO.Path]::GetFullPath((Join-Path $phaseRoot $phaseFile))
  if(-not $phaseTarget.StartsWith($phaseRoot + [IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Invalid target'}
  $phaseSave = Join-Path $phaseSafety $phaseFile
  New-Item -ItemType Directory -Path (Split-Path $phaseSave) -Force | Out-Null
  Copy-Item -LiteralPath $phaseTarget -Destination $phaseSave
}
foreach($phaseFile in $phaseFiles){Copy-Item -LiteralPath (Join-Path $phaseBackup $phaseFile) -Destination (Join-Path $phaseRoot $phaseFile)}
Write-Host "Previous L1/L2 restored. Current version saved at $phaseSafety. No videos or saved progress deleted."
