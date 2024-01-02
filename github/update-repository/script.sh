#!/usr/bin/env bash

while [ $# -gt 0 ] ; do
  case $1 in
    --api_version) api_version=$2;;
    --token) token=$2;;
    --repository) repository=$2;;
    --owner) owner=$2;;
    --name) name=$2;;
    --description) description=$2;;
    --delete_branch_on_merge) delete_branch_on_merge=$2;;
  esac
  shift
done

expressions=(
  '(if $name != "" then {name: $name} else {} end)'
  '(if $description != "" then {description: $description} else {} end)'
  '(if $delete_branch_on_merge != "" then {delete_branch_on_merge: $delete_branch_on_merge} else {} end)'
)

expression=$(IFS='+'; echo "${expressions[*]}")

body=$(
  jq \
    -n \
    --arg name "$name" \
    --arg description "$description" \
    --arg delete_branch_on_merge "$delete_branch_on_merge" \
    "$expression" \
)

echo "Body"
echo $body

curl \
  -L \
  -X PATCH \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $token" \
  -H "X-GitHub-Api-Version: $api_version" \
  https://api.github.com/repos/$owner/$repository \
  -d "$body" \
  -v
