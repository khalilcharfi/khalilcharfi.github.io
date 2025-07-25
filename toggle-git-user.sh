#!/usr/bin/env bash
# toggle-git-user.sh
# ---------------------------------------------
# Helper script to switch the local Git author
# for THIS repository to Khalil Charfi and
# restore the previous (global) identity.
#
# Usage:
#   ./toggle-git-user.sh apply    # set Khalil Charfi identity locally
#   ./toggle-git-user.sh restore  # remove local overrides
# ---------------------------------------------
set -euo pipefail

NAME="Khalil Charfi"
EMAIL="khalilcharfi8@gmail.com"

if [[ $# -ne 1 ]]; then
  echo "Usage: $(basename "$0") apply|restore" >&2
  exit 1
fi

case "$1" in
  apply)
    git config user.name  "$NAME"
    git config user.email "$EMAIL"
    echo "✅ Local git identity set to: $NAME <$EMAIL>"
    ;;
  restore)
    # Remove only the local overrides; fall back to global settings
    git config --unset user.name 2>/dev/null || true
    git config --unset user.email 2>/dev/null || true
    echo "✅ Local git identity removed. Git will now use global defaults."
    ;;
  *)
    echo "Unknown option: $1" >&2
    echo "Usage: $(basename "$0") apply|restore" >&2
    exit 1
    ;;
esac 