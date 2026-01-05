#!/bin/bash
# KULABOUR - Deployment Script
# Usage: ./deploy.sh [environment] [platform]
# Example: ./deploy.sh production android

set -e

ENVIRONMENT=${1:-preview}
PLATFORM=${2:-all}

echo "🚀 KULABOUR Deployment Script"
echo "================================"
echo "Environment: $ENVIRONMENT"
echo "Platform: $PLATFORM"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v eas &> /dev/null; then
        log_error "EAS CLI not found. Install with: npm install -g eas-cli"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js not found"
        exit 1
    fi
    
    log_info "Prerequisites OK ✓"
}

# Run tests
run_tests() {
    log_info "Running tests..."
    
    cd mobile-app
    npm run test -- --passWithNoTests || {
        log_error "Tests failed"
        exit 1
    }
    cd ..
    
    log_info "Tests passed ✓"
}

# Type check
type_check() {
    log_info "Running TypeScript check..."
    
    cd mobile-app
    npx tsc --noEmit --skipLibCheck || {
        log_error "TypeScript errors found"
        exit 1
    }
    cd ..
    
    log_info "TypeScript check passed ✓"
}

# Build app
build_app() {
    local profile=$1
    local platform=$2
    
    log_info "Building $platform for $profile..."
    
    cd mobile-app
    
    if [ "$platform" = "all" ]; then
        eas build --profile $profile --platform all --non-interactive
    else
        eas build --profile $profile --platform $platform --non-interactive
    fi
    
    cd ..
    
    log_info "Build completed ✓"
}

# Submit to stores
submit_app() {
    local platform=$1
    
    log_info "Submitting $platform to store..."
    
    cd mobile-app
    
    if [ "$platform" = "android" ]; then
        eas submit --platform android --latest --non-interactive
    elif [ "$platform" = "ios" ]; then
        eas submit --platform ios --latest --non-interactive
    else
        eas submit --platform all --latest --non-interactive
    fi
    
    cd ..
    
    log_info "Submission completed ✓"
}

# Main workflow
main() {
    check_prerequisites
    
    if [ "$ENVIRONMENT" = "production" ]; then
        log_warn "Production deployment - running full checks"
        run_tests
        type_check
    fi
    
    # Build
    build_app $ENVIRONMENT $PLATFORM
    
    # Submit to stores if production
    if [ "$ENVIRONMENT" = "production" ]; then
        read -p "Submit to app stores? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            submit_app $PLATFORM
        fi
    fi
    
    echo ""
    echo "================================"
    log_info "🎉 Deployment completed successfully!"
    echo "================================"
}

main
