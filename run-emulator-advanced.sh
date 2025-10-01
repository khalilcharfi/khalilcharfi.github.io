#!/bin/bash

# Function to get Android emulators
get_android_emulators() {
    if command -v emulator &> /dev/null; then
        emulator -list-avds 2>/dev/null | while read -r avd; do
            if [[ -n "$avd" ]]; then
                echo "Android: $avd"
            fi
        done
    fi
}

# Function to get iOS simulators
get_ios_simulators() {
    if command -v xcrun &> /dev/null; then
        xcrun simctl list devices 2>/dev/null | grep -E "iPhone|iPad" | grep "Shutdown" | sed 's/^[[:space:]]*//' | sed 's/ ([^)]*).*$//' | while read -r device; do
            if [[ -n "$device" ]]; then
                echo "iOS: $device"
            fi
        done
    fi
}

# Get all available emulators
echo "Scanning for available emulators..."
emulators=()

# Add Android emulators
while IFS= read -r line; do
    [[ -n "$line" ]] && emulators+=("$line")
done < <(get_android_emulators)

# Add iOS simulators
while IFS= read -r line; do
    [[ -n "$line" ]] && emulators+=("$line")
done < <(get_ios_simulators)

# Check if any emulators were found
if [[ ${#emulators[@]} -eq 0 ]]; then
    echo "No emulators found. Please make sure Android SDK or Xcode is properly installed."
    exit 1
fi

# Display options to the user
echo ""
echo "Select an emulator to run:"

select emulator in "${emulators[@]}"; do
    if [[ -n $emulator ]]; then
        echo "Starting $emulator..."
        
        # Determine if it's Android or iOS and run appropriate command
        if [[ $emulator == Android:* ]]; then
            # Extract AVD name (remove "Android:" prefix)
            avd_name=${emulator#"Android: "}
            echo "Launching Android emulator: $avd_name"
            emulator -avd "$avd_name" &
        elif [[ $emulator == iOS:* ]]; then
            # Extract device name (remove "iOS: " prefix)
            device_name=${emulator#"iOS: "}
            echo "Launching iOS simulator: $device_name"
            xcrun simctl boot "$device_name" 2>/dev/null
            open -a Simulator
        fi
        
        echo "Emulator started successfully!"
        break
    else
        echo "Invalid selection. Please try again."
    fi
done
