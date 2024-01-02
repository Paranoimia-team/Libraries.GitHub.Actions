#!/usr/bin/env bash

while [ $# -gt 0 ] ; do
  case $1 in
    --organization) organization=$2;;
    --project) project=$2;;
    --token) token=$2;;
  esac
  shift
done

get_query()
{
cat <<EOF
    query 
    { 
        organization(login: $organization) 
        { 
            projectV2(number: $project) 
            { 
                id 
            }
        } 
    }
EOF
}

get_body()
{
cat <<EOF
    {
        "query": "$(get_query)"
    }
EOF
}

result=$( \
    curl \
        -X POST \
        -H "Authorization: Bearer $token" \
        https://api.github.com/graphql \
        -d '$(get_body)' \
        -v
)

"result=$result" >> "$GITHUB_OUTPUT"
