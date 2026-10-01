$ErrorActionPreference = 'Stop'
$phaseRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$phaseBackup = Join-Path $phaseRoot '.review-backup/missions-4-6-v8'
$phaseFiles = @('src/data/chapters.ts','src/data/starMissions.ts','src/components/CinematicStoryScene.tsx','src/routes/missions.$missionId.$levelId.tsx')
foreach($phaseFile in $phaseFiles) { if(-not(Test-Path -LiteralPath (Join-Path $phaseBackup $phaseFile))) { throw "Missing backup: $phaseFile" } }
$phaseSafety = Join-Path $phaseRoot ('.review-backup/before-missions-4-6-undo-' + [Guid]::NewGuid().ToString('N'))
foreach($phaseFile in $phaseFiles) {
  $phaseTarget = [IO.Path]::GetFullPath((Join-Path $phaseRoot $phaseFile))
  if(-not $phaseTarget.StartsWith($phaseRoot + [IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Invalid restore target'}
  $phaseSave = Join-Path $phaseSafety $phaseFile
  New-Item -ItemType Directory -Path (Split-Path $phaseSave) -Force | Out-Null
  Copy-Item -LiteralPath $phaseTarget -Destination $phaseSave
}
foreach($phaseFile in $phaseFiles){Copy-Item -LiteralPath (Join-Path $phaseBackup $phaseFile) -Destination (Join-Path $phaseRoot $phaseFile)}
Write-Host "Previous Mission 4-6 lock/story/gameplay phase restored. Current version saved at $phaseSafety."
Write-Host 'No player progress, videos, audio, or unrelated phases were deleted.'
