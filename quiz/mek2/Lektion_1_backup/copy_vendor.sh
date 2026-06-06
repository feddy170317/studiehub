#!/bin/bash
# Kopier vendor-filer fra referencekvizzen til Lektion 1-quizzen

SOURCE="/c/Users/pif-m/OneDrive/Desktop/AI/Studiehub/quiz/mek2/Laering_MEK2_Quiz/assets/vendor"
TARGET="/c/Users/pif-m/OneDrive/Desktop/AI/Kurser/Mek/MEK\ 2\ opagver/Lektion\ 1/2_Quiz/assets/vendor"

if [ ! -d "$SOURCE" ]; then
  echo "ERROR: Source vendor dir not found: $SOURCE"
  exit 1
fi

echo "Copying vendor from: $SOURCE"
echo "To: $TARGET"

cp -r "$SOURCE/fonts" "$TARGET/" 2>/dev/null && echo "✓ fonts copied"
cp -r "$SOURCE/katex" "$TARGET/" 2>/dev/null && echo "✓ katex copied"
cp -r "$SOURCE/gsap" "$TARGET/" 2>/dev/null && echo "✓ gsap copied"

echo ""
echo "Done! Quiz is ready. Open index.html in a browser."
