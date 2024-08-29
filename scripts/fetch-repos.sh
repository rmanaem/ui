#!/bin/bash

# Define variables
ORG="OpenNeuroDatasets-JSONLD"
OUTPUT_FILE="../src/assets/repos.json"
GH_TOKEN="$GH_TOKEN"  # Use the GH_TOKEN passed from the GitHub Actions workflow
ANNOTATIONS_REPO="neurobagel/openneuro-annotations"

# Initialize an empty array to hold repository objects
REPOS=()
PAGE=1
PER_PAGE=100

# Function to fetch repository names
fetch_repos() {
    if [ -n "$GH_TOKEN" ]; then
        curl -s -H "Authorization: token $GH_TOKEN" "https://api.github.com/orgs/$ORG/repos?per_page=$PER_PAGE&page=$PAGE"
    else
        curl -s "https://api.github.com/orgs/$ORG/repos?per_page=$PER_PAGE&page=$PAGE"
    fi
}

# Fetch all repositories
while true; do
    RESPONSE=$(fetch_repos)

    # Check for API rate limit exceeded
    if echo "$RESPONSE" | jq -e '.message | contains("API rate limit exceeded")' >/dev/null 2>&1; then
        echo "Error: API rate limit exceeded. Exiting."
        exit 1
    fi

    # Parse the JSON response to extract repository names
    REPO_NAMES=$(echo "$RESPONSE" | jq -r '.[] | select(.name != ".github") | .name')

    # Check if no more repositories were returned
    if [ -z "$REPO_NAMES" ]; then
        break
    fi

    # Check each repository for the .jsonld file in the annotations repo
    for REPO_NAME in $REPO_NAMES; do
        JSONLD_FILE="${REPO_NAME}.jsonld"
        ANNOTATED=false
        TSV_EXISTS=false
        JSON_EXISTS=false

        # Fetch the contents of the annotations repository
        FILE_RESPONSE=$(curl -s -H "Authorization: token $GH_TOKEN" "https://api.github.com/repos/$ANNOTATIONS_REPO/contents/${JSONLD_FILE}")

        # Check if the FILE_RESPONSE is valid JSON before parsing
        if echo "$FILE_RESPONSE" | jq -e . >/dev/null 2>&1; then
            FILE_EXISTS=$(echo "$FILE_RESPONSE" | jq -r '.name // empty')
        else
            FILE_EXISTS=""
        fi

        if [ -n "$FILE_EXISTS" ]; then
            ANNOTATED=true
        fi

        # Check for participants.tsv in the repository
        TSV_RESPONSE=$(curl -s -H "Authorization: token $GH_TOKEN" "https://api.github.com/repos/$ORG/$REPO_NAME/contents/participants.tsv")
        if echo "$TSV_RESPONSE" | jq -e '.name // empty' >/dev/null 2>&1; then
            TSV_EXISTS=true
        fi

        # Check for participants.json in the repository
        JSON_RESPONSE=$(curl -s -H "Authorization: token $GH_TOKEN" "https://api.github.com/repos/$ORG/$REPO_NAME/contents/participants.json")
        if echo "$JSON_RESPONSE" | jq -e '.name // empty' >/dev/null 2>&1; then
            JSON_EXISTS=true
        fi

        # Add the repository information to the array
        REPOS+=("{\"name\": \"$REPO_NAME\", \"json_exists\": $JSON_EXISTS, \"tsv_exists\": $TSV_EXISTS, \"annotated\": $ANNOTATED}")
    done

    # Increment page number
    ((PAGE++))
done

# Create JSON output directly, handling empty array case
JSON_ARRAY=$(printf "%s," "${REPOS[@]}" | sed 's/,$//')  # Remove trailing comma
echo "[$JSON_ARRAY]" | jq '.' > "$OUTPUT_FILE"

echo "Repository information has been fetched and saved to $OUTPUT_FILE"
