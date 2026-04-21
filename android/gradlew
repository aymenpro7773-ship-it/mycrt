#!/bin/sh

# Standard Gradle Wrapper script
# (Simplified for the sake of making it work)

APP_HOME="`pwd -P`"
export GRADLE_USER_HOME="$APP_HOME/.gradle"

if [ -f "$APP_HOME/gradle/wrapper/gradle-wrapper.jar" ]; then
    java -jar "$APP_HOME/gradle/wrapper/gradle-wrapper.jar" "$@"
else
    gradle "$@"
fi
