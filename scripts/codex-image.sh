#!/usr/bin/env bash
# Generate one raster image through Codex's built-in image tool.
#
#   scripts/codex-image.sh <out.png> "<prompt>" [reference-image ...]
#
# Used by Lylia (agents/lylia.md) for logo concepts. One image per call — run
# several calls in parallel for several concepts. Exits non-zero unless
# <out.png> exists and is a PNG when Codex finishes.
#
# Env overrides:
#   CODEX_BIN    path to the codex binary (default: the one bundled in Codex.app)
#   CODEX_MODEL  model slug (default: gpt-5.5 — the user config's default model
#                is rejected by the bundled CLI as "requires a newer version")
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "usage: $0 <out.png> \"<prompt>\" [reference-image ...]" >&2
  exit 2
fi

out=$1
prompt=$2
shift 2

bin=${CODEX_BIN:-}
if [ -z "$bin" ]; then
  if command -v codex >/dev/null 2>&1; then
    bin=$(command -v codex)
  else
    bin=/Applications/Codex.app/Contents/Resources/codex
  fi
fi
[ -x "$bin" ] || { echo "codex binary not found ($bin) — install Codex.app or set CODEX_BIN" >&2; exit 1; }

model=${CODEX_MODEL:-gpt-5.5}
mkdir -p "$(dirname "$out")"
outdir=$(cd "$(dirname "$out")" && pwd)
outname=$(basename "$out")
rm -f "$outdir/$outname"

refs=()
for r in "$@"; do refs+=(-i "$r"); done

instructions="Use your image generation tool to create exactly ONE image for this brief:

$prompt

Then copy the generated PNG, unmodified and still PNG, to ./$outname in the current directory. Do not convert, resize or re-encode it. Reply with only the final path."

log=$(mktemp -t codex-image)
# stdin from /dev/null: codex exec otherwise blocks reading extra input.
"$bin" exec --skip-git-repo-check --ephemeral -s workspace-write -m "$model" \
  -C "$outdir" ${refs[@]+"${refs[@]}"} "$instructions" </dev/null >"$log" 2>&1 || {
  grep -v -E 'codex_models_manager|rmcp::' "$log" | tail -20 >&2
  rm -f "$log"
  exit 1
}

if ! file "$outdir/$outname" 2>/dev/null | grep -q 'PNG image data'; then
  echo "codex finished but $outdir/$outname is missing or not a PNG" >&2
  grep -v -E 'codex_models_manager|rmcp::' "$log" | tail -20 >&2
  rm -f "$log"
  exit 1
fi
rm -f "$log"
echo "$outdir/$outname"
