#!/usr/bin/env bash

while [ $# -gt 0 ] ; do
  case $1 in
    --owner) owner=$2;;
    --repository) repository=$2;;
    --token) token=$2;;
    --api_version) api_version=$2;;
    --ruleset_path) ruleset_path=$2;;
  esac
  shift
done

curl \
    -L \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $token" \
    -H "X-GitHub-Api-Version: $api_version" \
    https://api.github.com/repos/$owner/$repository/rulesets \
    -d "@$ruleset_path" \
    -v
