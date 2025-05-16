#!/bin/bash

# Check if ADB is available
if ! command -v adb &> /dev/null; then
    echo "Error: ADB is not installed or not in PATH"
    exit 1
fi

# Check if any devices are connected
DEVICES=$(adb devices | grep -v "List" | grep -v "^$" | wc -l)
if [ "$DEVICES" -eq 0 ]; then
    echo "No Android devices/emulators found. Please make sure your emulator is running."
    exit 1
fi

# Function to display usage
show_usage() {
    echo "Android Log Viewer"
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  -p, --package PACKAGE   Filter logs by package name (app ID)"
    echo "  -t, --tag TAG           Filter logs by tag"
    echo "  -l, --level LEVEL       Filter by minimum log level (V, D, I, W, E, F)"
    echo "  -c, --clear             Clear the log before viewing"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                      Show all logs"
    echo "  $0 -p com.example.app   Show logs for specific package"
    echo "  $0 -t ReactNative       Show logs with tag 'ReactNative'"
    echo "  $0 -l E                 Show only error logs and above"
    echo "  $0 -c                   Clear logs before viewing"
}

# Default values
PACKAGE=""
TAG=""
LEVEL=""
CLEAR=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        -p|--package)
            PACKAGE="$2"
            shift 2
            ;;
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        -l|--level)
            LEVEL="$2"
            shift 2
            ;;
        -c|--clear)
            CLEAR=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Clear logs if requested
if [ "$CLEAR" = true ]; then
    echo "Clearing logs..."
    adb logcat -c
fi

# Build the logcat command
LOGCAT_CMD="adb logcat"

# Add filters
if [ -n "$PACKAGE" ]; then
    echo "Filtering by package: $PACKAGE"
    LOGCAT_CMD="$LOGCAT_CMD | grep -i \"$PACKAGE\""
fi

if [ -n "$TAG" ]; then
    echo "Filtering by tag: $TAG"
    LOGCAT_CMD="$LOGCAT_CMD | grep -i \"$TAG\""
fi

if [ -n "$LEVEL" ]; then
    echo "Filtering by minimum level: $LEVEL"
    case "$LEVEL" in
        V|v) LOGCAT_CMD="$LOGCAT_CMD *:V" ;;
        D|d) LOGCAT_CMD="$LOGCAT_CMD *:D" ;;
        I|i) LOGCAT_CMD="$LOGCAT_CMD *:I" ;;
        W|w) LOGCAT_CMD="$LOGCAT_CMD *:W" ;;
        E|e) LOGCAT_CMD="$LOGCAT_CMD *:E" ;;
        F|f) LOGCAT_CMD="$LOGCAT_CMD *:F" ;;
        *)
            echo "Invalid log level: $LEVEL. Using default."
            ;;
    esac
fi

echo "Starting log viewer. Press Ctrl+C to exit."
echo "Command: $LOGCAT_CMD"

# Execute the command
eval "$LOGCAT_CMD"
