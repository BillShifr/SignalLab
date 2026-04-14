#!/usr/bin/env bash
set -euo pipefail

input="$(cat)"
cmd="$(
  printf '%s' "$input" | python3 -c 'import json,sys; 
try:
  d=json.load(sys.stdin)
  print(d.get("command") or "")
except Exception:
  print("")
'
)"

if echo "$cmd" | grep -Eqi 'rm -rf /|mkfs\.|dd if=|:(){|:&;};'; then
  echo '{"permission":"deny","user_message":"Blocked: destructive shell pattern.","agent_message":"Hook blocked a destructive command."}'
  exit 0
fi

echo '{"permission":"allow"}'
