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
    
    # Debug: Print the RESPONSE to see what is being returned
    echo "RESPONSE: $RESPONSE"  # Debugging line

    # Check if the RESPONSE is valid JSON before parsing
    if echo "$RESPONSE" | jq -e . >/dev/null 2>&1; then
        # Parse the JSON response to extract repository names
        REPO_NAMES=$(echo "$RESPONSE" | jq -r '.[] | select(.name != ".github") | .name')
    else
        echo "Error: Invalid JSON received from GitHub API"
        exit 1
    fi

    # Check if no more repositories were returned
    if [ -z "$REPO_NAMES" ]; then
        break
    fi

    # Check each repository for the .jsonld file in the annotations repo
    for REPO_NAME in $REPO_NAMES; do
        JSONLD_FILE="${REPO_NAME}.jsonld"
        ANNOTATED=false

        # Fetch the contents of the annotations repository
        FILE_RESPONSE=$(curl -s -H "Authorization: token $GH_TOKEN" "https://api.github.com/repos/$ANNOTATIONS_REPO/contents/${JSONLD_FILE}")

        # Debug: Print the FILE_RESPONSE to see what is being returned
        echo "FILE_RESPONSE for $JSONLD_FILE: $FILE_RESPONSE"  # Debugging line

        # Check if the FILE_RESPONSE is valid JSON before parsing
        if echo "$FILE_RESPONSE" | jq -e . >/dev/null 2>&1; then
            FILE_EXISTS=$(echo "$FILE_RESPONSE" | jq -r '.name // empty')
        else
            FILE_EXISTS=""
        fi

        if [ -n "$FILE_EXISTS" ]; then
            ANNOTATED=true
        fi

        # Add the repository information to the array
        REPOS+=("{\"name\": \"$REPO_NAME\", \"annotated\": $ANNOTATED}")
    done

    # Increment page number
    ((PAGE++))
done

# Create JSON output directly, handling empty array case
JSON_ARRAY=$(printf "%s," "${REPOS[@]}" | sed 's/,$//')  # Remove trailing comma
echo "[$JSON_ARRAY]" | jq '.' > "$OUTPUT_FILE"

echo "Repository information has been fetched and saved to $OUTPUT_FILE"
