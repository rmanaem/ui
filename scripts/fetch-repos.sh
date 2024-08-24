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
        
        # Check if the .jsonld file exists in the annotations repository
        FILE_EXISTS=$(curl -s -H "Authorization: token $GH_TOKEN" "https://api.github.com/repos/$ANNOTATIONS_REPO/contents/${JSONLD_FILE}" | jq -r '.name // empty')

        if [ -n "$FILE_EXISTS" ]; then
            ANNOTATED=true
        fi

        # Add the repository information to the array
        REPOS+=("{\"name\": \"$REPO_NAME\", \"annotated\": $ANNOTATED}")
    done

    # Increment page number
    ((PAGE++))
done

# Refactor JSON output handling
if [ ${#REPOS[@]} -eq 0 ]; then
    # If no repositories were found, write an empty array
    echo "[]" > "$OUTPUT_FILE"
else
    # Join the REPOS array into a single JSON array
    JSON_ARRAY=$(printf "%s," "${REPOS[@]}" | sed 's/,$//')  # Remove trailing comma
    echo "[$JSON_ARRAY]" | jq '.' > "$OUTPUT_FILE"
fi

echo "Repository information has been fetched and saved to $OUTPUT_FILE"
