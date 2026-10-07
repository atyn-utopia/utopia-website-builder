#!/usr/bin/env bash
#
# Deploy one site under projects/ to Vercel.
#
# WHY THIS SCRIPT EXISTS
# ----------------------
# Vercel reads the git HEAD commit author on every CLI deploy. Only the CLI
# login identity `chokchokchok` (utopiacoliving@gmail.com) is a paid member on
# the `chokchunynh` team scope, and no commit author in this repo is that
# identity -- the repo root is atyn.utopia@gmail.com, and the sites that carry
# their own .git are atyn.utopia@, chokchunynh@ or design.utco@. So a raw
# `vercel --prod` from projects/<site> is rejected as Blocked / Not authorized
# before the build even runs.
#
# The other two repos in the workspace (utopia-webcore, website-build-playbook)
# solve this by moving their .git aside during the upload. That is not safe
# here: a site without its own .git resolves up to the repo root, so we would
# have to hide the root .git -- which is shared by all 42 sites and by any other
# session working in this checkout.
#
# Instead we stage the site's files into a temp directory that is not inside any
# git repo at all, and deploy from there. The CLI finds no commit author, falls
# back to the logged-in identity, and the repo is never touched.
#
# USAGE
#   scripts/deploy-site.sh <site>              # deploy to production
#   scripts/deploy-site.sh <site> --preview    # deploy a preview instead
#   scripts/deploy-site.sh <site> --dry-run    # stage + check, stop before deploy
#   scripts/deploy-site.sh                     # infer <site> from the cwd
#   scripts/deploy-site.sh <site> -- --force   # pass extra args to vercel
#
# Requirements: logged in as chokchokchok (`vercel whoami`), and the site linked
# (projects/<site>/.vercel/project.json). This repo is NOT connected to GitHub --
# merging to main publishes nothing; this script is how a site goes live.

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXPECTED_USER="chokchokchok"
VERCEL_SCOPE="chokchunynh"

SITE=""
TARGET="production"
DRY_RUN=0
EXTRA_ARGS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --preview)  TARGET="preview"; shift ;;
    --dry-run)  DRY_RUN=1; shift ;;
    --prod|--production) TARGET="production"; shift ;;
    --)         shift; EXTRA_ARGS+=("$@"); break ;;
    -h|--help)  sed -n '2,40p' "${BASH_SOURCE[0]}"; exit 0 ;;
    -*)         echo "unknown option: $1" >&2; exit 2 ;;
    *)
      if [ -n "$SITE" ]; then
        echo "only one site at a time (got '$SITE' and '$1')" >&2
        echo "one site, one deploy -- each site goes live on its own schedule." >&2
        exit 2
      fi
      SITE="$1"; shift ;;
  esac
done

# Infer the site from the cwd when run from inside projects/<site>/.
if [ -z "$SITE" ]; then
  here="$(pwd)"
  case "$here" in
    "$REPO"/projects/*)
      rest="${here#"$REPO"/projects/}"
      SITE="${rest%%/*}" ;;
  esac
fi

if [ -z "$SITE" ]; then
  echo "usage: scripts/deploy-site.sh <site> [--preview] [--dry-run]" >&2
  echo "       (or run it from inside projects/<site>/)" >&2
  exit 2
fi

SITE="$(basename "$SITE")"          # tolerate `projects/foo` or `projects/foo/`
SRC="$REPO/projects/$SITE"

# ─── 1. Preflight: the three things that silently waste a deploy ───────────
if [ ! -d "$SRC" ]; then
  echo "no such site: projects/$SITE" >&2
  echo "available:" >&2
  (cd "$REPO/projects" && ls -d */ | sed 's#/$##' | sed 's/^/  /') >&2
  exit 1
fi

if [ ! -f "$SRC/.vercel/project.json" ]; then
  echo "projects/$SITE is not linked to a Vercel project." >&2
  echo "There is no .vercel/project.json, so a deploy would create a NEW project" >&2
  echo "under the team rather than updating the existing site." >&2
  echo "Link it first:  cd projects/$SITE && vercel link" >&2
  exit 1
fi

PROJECT_NAME="$(sed -n 's/.*"projectName" *: *"\([^"]*\)".*/\1/p' "$SRC/.vercel/project.json")"

# Run this from a neutral directory. Inside a linked project `vercel whoami`
# resolves the linked scope too, so a stale or wrong .vercel/project.json makes
# it answer "Not authorized" even when the login is fine -- which would send you
# chasing a login problem you do not have.
who="$(cd / && vercel whoami 2>/dev/null || true)"
if [ "$who" != "$EXPECTED_USER" ]; then
  echo "Vercel CLI is logged in as '${who:-<nobody>}', not '$EXPECTED_USER'." >&2
  echo "Only $EXPECTED_USER (utopiacoliving@gmail.com) can publish on this team." >&2
  echo "Fix:  vercel logout && vercel login" >&2
  exit 1
fi

echo "▸ site            projects/$SITE"
echo "▸ vercel project  ${PROJECT_NAME:-<unnamed>}"
echo "▸ identity        $who"
echo "▸ target          $TARGET"

# ─── 2. Stage the files outside every git repo ─────────────────────────────
STAGE_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/deploy-$SITE.XXXXXX")"
cleanup() { rm -rf "$STAGE_ROOT"; }
trap cleanup EXIT INT TERM
STAGE="$STAGE_ROOT/$SITE"
mkdir -p "$STAGE"

# .git            -- the whole point: no commit author for the CLI to read
# node_modules    -- Vercel runs its own install
# .next           -- Vercel runs its own build
# .env*.local     -- secrets; production values live in the Vercel project
# the rest        -- dev leftovers named in .gitignore, none of them shipped
echo "▸ staging files (no .git, no node_modules, no secrets)"
rsync -a \
  --exclude '.git' \
  --exclude '.git/' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.env.local' \
  --exclude '.env.*.local' \
  --exclude '*.tsbuildinfo' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude 'temporary screenshots' \
  --exclude '.blog-scripts' \
  --exclude '.cyclops-*' \
  --exclude '.hanabi-*' \
  "$SRC/" "$STAGE/"

# The link metadata is gitignored, so rsync above may not be enough on its own --
# copy it explicitly. Without it the CLI would prompt to create a new project.
mkdir -p "$STAGE/.vercel"
cp "$SRC/.vercel/project.json" "$STAGE/.vercel/project.json"

# ─── 3. Prove the staged tree is really outside git ────────────────────────
# If this assertion ever fails the deploy would be Blocked again, and the cause
# would look like a Vercel problem rather than a staging problem. Fail loudly.
if find "$STAGE" -name '.git' -maxdepth 3 -print -quit | grep -q .; then
  echo "staged tree still contains a .git -- refusing to deploy" >&2
  exit 1
fi
probe="$STAGE"
while [ "$probe" != "/" ]; do
  if [ -e "$probe/.git" ]; then
    echo "staging dir is inside a git repo ($probe) -- refusing to deploy" >&2
    echo "the CLI would read that repo's commit author and the deploy would be Blocked." >&2
    exit 1
  fi
  probe="$(dirname "$probe")"
done

if [ -e "$STAGE/.env.local" ]; then
  echo "staged tree contains .env.local -- refusing to upload secrets" >&2
  exit 1
fi

echo "▸ staged at       $STAGE"

if [ "$DRY_RUN" -eq 1 ]; then
  echo "▸ dry run: stopping before deploy"
  echo "  staged files: $(find "$STAGE" -type f | wc -l | tr -d ' ')"
  exit 0
fi

# ─── 4. Deploy ─────────────────────────────────────────────────────────────
VERCEL_ARGS=(deploy --yes --scope "$VERCEL_SCOPE")
[ "$TARGET" = "production" ] && VERCEL_ARGS+=(--prod)

echo "▸ deploying…"
OUT="$STAGE_ROOT/vercel.out"
if ! (cd "$STAGE" && vercel "${VERCEL_ARGS[@]}" ${EXTRA_ARGS[@]+"${EXTRA_ARGS[@]}"}) 2>&1 | tee "$OUT"; then
  echo "" >&2
  echo "✗ deploy failed. Read the output above -- the repo was not modified." >&2
  exit 1
fi

# The Ready URL is what we verify against. Never guess it from the project name.
URL="$(grep -Eo 'https://[a-zA-Z0-9._-]+' "$OUT" | tail -1)"
if [ -z "$URL" ]; then
  echo "⚠ deploy reported success but no URL was found in the output." >&2
  echo "  Check with: vercel ls ${PROJECT_NAME:-$SITE}" >&2
  exit 1
fi

echo ""
echo "▸ verifying $URL"
code="$(curl -s -o /dev/null -w '%{http_code}' "$URL" || true)"
if [ "$code" = "200" ]; then
  echo "✓ $URL responded 200"
else
  echo "⚠ $URL responded $code -- deploy went up but the page is not serving 200." >&2
  echo "  Open it and check before calling this done." >&2
  exit 1
fi

echo ""
echo "✓ $SITE deployed to $TARGET: $URL"
echo "  Open it and confirm the change is visible before calling it done."
