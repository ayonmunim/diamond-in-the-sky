$ErrorActionPreference = 'Stop'
$phaseRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$phaseFiles = @('src/components/ColorMission.tsx','src/routes/missions.$missionId.$levelId.tsx','src/data/starMissions.ts')
$phaseSaveRoot = Join-Path $phaseRoot ('.review-backup/before-distance-undo-' + [Guid]::NewGuid().ToString('N'))
foreach ($phaseFile in $phaseFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $phaseRoot ('.review-backup/distance-v11/' + $phaseFile)))) { throw "Missing backup: $phaseFile" }
}
foreach ($phaseFile in $phaseFiles) {
  $phaseTarget = [IO.Path]::GetFullPath((Join-Path $phaseRoot $phaseFile))
  if (-not $phaseTarget.StartsWith($phaseRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid target' }
  $phaseSave = Join-Path $phaseSaveRoot $phaseFile
  New-Item -ItemType Directory -Force (Split-Path $phaseSave) | Out-Null
  Copy-Item -LiteralPath $phaseTarget -Destination $phaseSave
  Copy-Item -LiteralPath (Join-Path $phaseRoot ('.review-backup/distance-v11/' + $phaseFile)) -Destination $phaseTarget
}
Write-Host "Previous Mission 4 arrows and Mission 5 restored. Current files saved at $phaseSaveRoot."
Write-Host 'Player progress and media are preserved. New components remain unused.'
