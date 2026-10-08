param([Parameter(Mandatory=$true)][string]$ElectronPath, [switch]$ResumeUi, [switch]$ResumeThemes)
$ErrorActionPreference = 'Stop'
$neroProject = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location -LiteralPath $neroProject
$neroChecks = if ($ResumeThemes) { @('test/tv-themes-ui.cjs') } elseif ($ResumeUi) { @('test/all-features-ui.cjs','test/tv-themes-ui.cjs') } else { @(
    'scripts/render-bikini-wardrobe-thumbnails.cjs',
    'test/bikini-costumes-preview.cjs',
    'test/bikini-wardrobe-production.cjs',
    'test/all-features-ui.cjs',
    'test/tv-themes-ui.cjs'
) }
foreach ($neroCheck in $neroChecks) {
    $neroLabel = [IO.Path]::GetFileNameWithoutExtension($neroCheck)
    $neroProcess = Start-Process -FilePath $ElectronPath -ArgumentList @('--disable-gpu', $neroCheck) -WindowStyle Hidden -PassThru -Wait -RedirectStandardOutput "final-$neroLabel-stdout.log" -RedirectStandardError "final-$neroLabel-stderr.log"
    Get-Content -LiteralPath "final-$neroLabel-stdout.log"
    if ($neroProcess.ExitCode -ne 0) {
        Get-Content -LiteralPath "final-$neroLabel-stderr.log"
        throw "$neroCheck failed with exit code $($neroProcess.ExitCode)"
    }
    Write-Output "PASS $neroCheck"
}
foreach ($neroTheme in @('bikini-bottom','stars-hollow','scranton')) {
    $env:NERO_STARTUP_THEME = $neroTheme
    $neroProcess = Start-Process -FilePath $ElectronPath -ArgumentList @('--disable-gpu','test/production-startup-smoke.cjs') -WindowStyle Hidden -PassThru -Wait -RedirectStandardOutput "final-startup-$neroTheme-stdout.log" -RedirectStandardError "final-startup-$neroTheme-stderr.log"
    Get-Content -LiteralPath "final-startup-$neroTheme-stdout.log"
    if ($neroProcess.ExitCode -ne 0) { Get-Content -LiteralPath "final-startup-$neroTheme-stderr.log"; throw "$neroTheme startup failed" }
}
Remove-Item Env:NERO_STARTUP_THEME
