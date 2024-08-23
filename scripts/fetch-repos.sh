#!/bin/bash

# Define variables
ORG="OpenNeuroDatasets-JSONLD"
OUTPUT_FILE="repos.json"
TOKEN="$TOKEN"  # Use the token passed from the GitHub Actions workflow

# Initialize an empty array to hold repository names
REPOS=()
PAGE=1
PER_PAGE=100

# Fetch all repositories
while true; do
    # Make the API call
    if [ -n "$TOKEN" ]; then
        RESPONSE=$(curl -s -H "Authorization: token $TOKEN" "https://api.github.com/orgs/$ORG/repos?per_page=$PER_PAGE&page=$PAGE")
    else
        RESPONSE=$(curl -s "https://api.github.com/orgs/$ORG/repos?per_page=$PER_PAGE&page=$PAGE")
    fi

    # Parse the JSON response to extract repository names
    NAMES=$(echo "$RESPONSE" | jq -r '.[].name')

    # Check if no more repositories were returned
    if [ -z "$NAMES" ]; then
        break
    fi

    # Append repository names to the array
    for NAME in $NAMES; do
        REPOS+=("\"$NAME\"")
    done

    # Increment page number
    ((PAGE++))
done

# Write repository names to the JSON file
echo "[${REPOS[*]}]" > "$OUTPUT_FILE"
echo "Repository names have been fetched and saved to $OUTPUT_FILE"
