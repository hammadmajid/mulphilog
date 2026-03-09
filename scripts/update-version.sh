#!/bin/bash

# Script to safely update version numbers in package.json and jsr.json
# Usage: ./scripts/update-version.sh <version>
# Example: ./scripts/update-version.sh 0.2.1

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Validate arguments
if [ $# -ne 1 ]; then
    echo -e "${RED}Error: Version number required${NC}"
    echo "Usage: $0 <version>"
    echo "Example: $0 0.2.1"
    exit 1
fi

VERSION=$1

# Validate version format (semantic versioning)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?$ ]]; then
    echo -e "${RED}Error: Invalid version format${NC}"
    echo "Version must follow semantic versioning (e.g., 0.2.1, 1.0.0-beta.1)"
    exit 1
fi

# Check if files exist
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found${NC}"
    exit 1
fi

if [ ! -f "jsr.json" ]; then
    echo -e "${RED}Error: jsr.json not found${NC}"
    exit 1
fi

# Get current versions
CURRENT_PACKAGE_VERSION=$(grep -oP '(?<="version": ")[^"]*' package.json)
CURRENT_JSR_VERSION=$(grep -oP '(?<="version": ")[^"]*' jsr.json)

echo -e "${YELLOW}Current versions:${NC}"
echo "  package.json: $CURRENT_PACKAGE_VERSION"
echo "  jsr.json: $CURRENT_JSR_VERSION"
echo ""
echo -e "${YELLOW}Updating to: $VERSION${NC}"
echo ""

# Create backup files
cp package.json package.json.bak
cp jsr.json jsr.json.bak

echo "Created backup files..."

# Update package.json - only replace the version field value
sed -i "s/\"version\": \"$CURRENT_PACKAGE_VERSION\"/\"version\": \"$VERSION\"/" package.json

# Update jsr.json - only replace the version field value
sed -i "s/\"version\": \"$CURRENT_JSR_VERSION\"/\"version\": \"$VERSION\"/" jsr.json

# Verify changes
NEW_PACKAGE_VERSION=$(grep -oP '(?<="version": ")[^"]*' package.json)
NEW_JSR_VERSION=$(grep -oP '(?<="version": ")[^"]*' jsr.json)

if [ "$NEW_PACKAGE_VERSION" != "$VERSION" ] || [ "$NEW_JSR_VERSION" != "$VERSION" ]; then
    echo -e "${RED}Error: Version update failed${NC}"
    echo "Restoring backup files..."
    mv package.json.bak package.json
    mv jsr.json.bak jsr.json
    exit 1
fi

# Remove backup files
rm package.json.bak jsr.json.bak

echo -e "${GREEN}✓ Successfully updated versions to $VERSION${NC}"
echo ""
echo "Updated files:"
echo "  package.json: $CURRENT_PACKAGE_VERSION → $VERSION"
echo "  jsr.json: $CURRENT_JSR_VERSION → $VERSION"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Update CHANGELOG.md"
echo "  2. Commit changes: git add . && git commit -m \"chore: release v$VERSION\""
echo "  3. Create tag: git tag v$VERSION"
echo "  4. Push: git push && git push --tags"
