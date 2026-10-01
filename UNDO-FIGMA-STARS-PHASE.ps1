$ErrorActionPreference = 'Stop'
$phaseRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$phaseFiles = @('src/components/ColorMission.tsx', 'src/components/color-mission.css')
$phaseSaveRoot = Join-Path $phaseRoot ('.review-backup/before-figma-stars-undo-' + [Guid]::NewGuid().ToString('N'))
foreach ($phaseFile in $phaseFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $phaseRoot ('.review-backup/figma-stars-v10/' + $phaseFile)))) { throw "Missing backup: $phaseFile" }
}
foreach ($phaseFile in $phaseFiles) {
  $phaseTarget = [IO.Path]::GetFullPath((Join-Path $phaseRoot $phaseFile))
  if (-not $phaseTarget.StartsWith($phaseRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid target' }
  $phaseSave = Join-Path $phaseSaveRoot $phaseFile
  New-Item -ItemType Directory -Force (Split-Path $phaseSave) | Out-Null
  Copy-Item -LiteralPath $phaseTarget -Destination $phaseSave
  Copy-Item -LiteralPath (Join-Path $phaseRoot ('.review-backup/figma-stars-v10/' + $phaseFile)) -Destination $phaseTarget
}
Write-Host "Previous Mission 4 graphics restored. Current files saved at $phaseSaveRoot. Player progress is unchanged."
