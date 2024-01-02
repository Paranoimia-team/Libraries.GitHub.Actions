#!/usr/bin/env bash

while [ $# -gt 0 ] ; do
  case $1 in
    --owner) owner=$2;;
    --organization) organization=$2;;
    --token) token=$2;;
    --api_version) api_version=$2;;
    --team_slug) team_slug=$2;;
    --owner) owner=$2;;
    --repository) repository=$2;;
    --permission) permission=$2;;
  esac
  shift
done

data=$([ -z "$permission" ] && echo '{}' || echo '{"permission":"$permission"}')

curl \
    -L \
    -X PUT \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $token" \
    -H "X-GitHub-Api-Version: $api_version" \
    https://api.github.com/orgs/$organization/teams/$team_slug/repos/$owner/$repository \
    -d $data
