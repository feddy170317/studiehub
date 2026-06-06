# Kopier vendor-filer fra referencekvizzen til Lektion 1-quizzen

$SOURCE = "C:\Users\pif-m\OneDrive\Desktop\AI\Studiehub\quiz\mek2\Laering_MEK2_Quiz\assets\vendor"
$TARGET = "C:\Users\pif-m\OneDrive\Desktop\AI\Kurser\Mek\MEK 2 opagver\Lektion 1\2_Quiz\assets\vendor"

if (-not (Test-Path $SOURCE)) {
  Write-Host "ERROR: Source vendor dir not found: $SOURCE"
  exit 1
}

Write-Host "Copying vendor from: $SOURCE"
Write-Host "To: $TARGET"
Write-Host ""

# Copy fonts
Copy-Item -Path "$SOURCE\fonts" -Destination $TARGET -Recurse -Force -ErrorAction Continue
Write-Host "✓ fonts copied"

# Copy katex
Copy-Item -Path "$SOURCE\katex" -Destination $TARGET -Recurse -Force -ErrorAction Continue
Write-Host "✓ katex copied"

# Copy gsap
Copy-Item -Path "$SOURCE\gsap" -Destination $TARGET -Recurse -Force -ErrorAction Continue
Write-Host "✓ gsap copied"

Write-Host ""
Write-Host "Done! Quiz is ready. Open index.html in a browser."
