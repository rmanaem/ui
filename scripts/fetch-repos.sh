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

    # Debug: Output the response to check if we're getting data
    echo "Response: $RESPONSE" >> debug.log

    # Parse the JSON response to extract repository names
    REPO_NAMES=$(echo "$RESPONSE" | jq -r '.[] | select(.name != ".github") | .name')

    # Debug: Output the repository names to verify they are being extracted
    echo "Repository Names: $REPO_NAMES" >> debug.log

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

        # Debug: Output the result of the file existence check
        echo "Checking $JSONLD_FILE: $FILE_EXISTS" >> debug.log

        if [ -n "$FILE_EXISTS" ]; then
            ANNOTATED=true
        fi

        # Add the repository information to the array
        REPOS+=("{\"name\": \"$REPO_NAME\", \"annotated\": $ANNOTATED}")
        echo "$REPO_NAME is annotated: $ANNOTATED"
    done

    # Increment page number
    ((PAGE++))
done

# Write repository information to the JSON file
echo "[${REPOS[*]}]" | jq '.' > "$OUTPUT_FILE"

# Debug: Output final JSON file content
cat "$OUTPUT_FILE" >> debug.log
echo "Repository information has been fetched and saved to $OUTPUT_FILE"
