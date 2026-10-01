$ErrorActionPreference = 'Stop'
$novaProject = [IO.Path]::GetFullPath($PSScriptRoot)
$novaBackup = Join-Path $novaProject '.review-backup/nova-mission-v3'
$novaFiles = @('src/components/StarLearningLab.tsx', 'src/components/star-learning-lab.css', 'src/routes/missions.$missionId.$levelId.tsx', 'src/routes/index.tsx', 'src/components/Nova.tsx', 'src/components/CinematicStoryScene.tsx', 'src/routes/__root.tsx', 'src/styles.css')
foreach ($novaFile in $novaFiles) {
  if (-not (Test-Path -LiteralPath (Join-Path $novaBackup $novaFile))) { throw "Missing backup: $novaFile" }
}
# Preserve any later edits before restoring this phase. No files are deleted.
$novaSafety = Join-Path $novaProject ('.review-backup/before-nova-undo-' + [Guid]::NewGuid().ToString('N'))
foreach ($novaFile in $novaFiles) {
  $novaTarget = [IO.Path]::GetFullPath((Join-Path $novaProject $novaFile))
  if (-not $novaTarget.StartsWith($novaProject + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Target is outside project' }
  $novaSaved = Join-Path $novaSafety $novaFile
  New-Item -ItemType Directory -Path (Split-Path $novaSaved) -Force | Out-Null
  Copy-Item -LiteralPath $novaTarget -Destination $novaSaved
}
foreach ($novaFile in $novaFiles) {
  Copy-Item -LiteralPath (Join-Path $novaBackup $novaFile) -Destination (Join-Path $novaProject $novaFile)
}
Write-Host 'Restored the phase before Nova / five-level / landscape changes. Restart npm run dev.'
Write-Host "Your replaced files are preserved at: $novaSafety"
Write-Host 'Videos, audio, new unused assets, and browser-saved progress were not deleted.'
