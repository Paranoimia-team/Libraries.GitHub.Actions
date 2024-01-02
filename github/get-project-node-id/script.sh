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
        organization(login: "$organization") 
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
        "query": $(get_query | tr -d '\n' | tr -d ' ' | jq -Rs)
    }
EOF
}

body=$(get_body | jq -c)

echo "Body"
echo $body

result=$( \
    curl \
        -X POST \
        -H "Authorization: Bearer $token" \
        https://api.github.com/graphql \
        -d '$body' \
        -v
)

OUTPUT=$GITHUB_OUTPUT
"result=$result" | tee -a "$OUTPUT"
