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
#   CODEX_MODEL  model slug (default: none — Codex uses the model in ~/.codex/config.toml.
#                A pinned slug goes stale: gpt-5.5 was refused for ChatGPT accounts on
#                2026-10-15. Set this only when the config default is rejected.)
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
    # Codex.app 26.1007 moved the bundled CLI into codex-cli/bin/; older
    # builds keep it directly under Resources/.
    for candidate in \
      /Applications/Codex.app/Contents/Resources/codex-cli/bin/codex \
      /Applications/Codex.app/Contents/Resources/codex; do
      if [ -x "$candidate" ]; then bin=$candidate; break; fi
    done
    bin=${bin:-/Applications/Codex.app/Contents/Resources/codex-cli/bin/codex}
  fi
fi
[ -x "$bin" ] || { echo "codex binary not found ($bin) — install Codex.app or set CODEX_BIN" >&2; exit 1; }

model_args=()
[ -n "${CODEX_MODEL:-}" ] && model_args=(-m "$CODEX_MODEL")
mkdir -p "$(dirname "$out")"
outdir=$(cd "$(dirname "$out")" && pwd)
outname=$(basename "$out")
rm -f "$outdir/$outname"

refs=()
for r in "$@"; do refs+=(-i "$r"); done

instructions="Use your image generation tool to create exactly ONE image for this brief:

$prompt

The background must be a real alpha channel — no drawn checkerboard, no glow or halo around the artwork.

Then copy the generated PNG, unmodified and still PNG, to ./$outname in the current directory. Do not convert, resize or re-encode it. Reply with only the final path."

log=$(mktemp -t codex-image)
# stdin from /dev/null: codex exec otherwise blocks reading extra input.
# `--` before the prompt: -i/--image takes several values and would otherwise
# swallow the prompt as one more image path.
"$bin" exec --skip-git-repo-check --ephemeral -s workspace-write ${model_args[@]+"${model_args[@]}"} \
  -C "$outdir" ${refs[@]+"${refs[@]}"} -- "$instructions" </dev/null >"$log" 2>&1 || {
  grep -v -E 'codex_models_manager|rmcp::' "$log" | tail -20 >&2
  rm -f "$log"
  exit 1
}

# RGBA, not just PNG: Codex sometimes returns an RGB image with a transparency
# checkerboard painted into it, which looks transparent in a viewer and isn't.
if ! file "$outdir/$outname" 2>/dev/null | grep -q 'PNG image data.*RGBA'; then
  echo "codex finished but $outdir/$outname is missing, not a PNG, or has no alpha channel (RGBA) — regenerate" >&2
  grep -v -E 'codex_models_manager|rmcp::' "$log" | tail -20 >&2
  rm -f "$log"
  exit 1
fi
rm -f "$log"
echo "$outdir/$outname"
