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
        "query": $(get_query | jq -Rs)
    }
EOF
}

body=$(get_body | jq -c)

echo "Body"
echo $body

response=$( \
    curl \
        -X POST \
        -H "Authorization: Bearer $token" \
        https://api.github.com/graphql \
        -d "$body" \
        -v
)

node_id=$(echo $response | jq -r ".data.organization.projectV2.id")

echo "Node id:$node_id;"

echo "GitHub output:$GITHUB_OUTPUT;"
echo "node_id=$node_id" >> "$GITHUB_OUTPUT"
