# 复用探索队已下载的 JDK 21 / Android SDK / Gradle 缓存；模拟器镜像放在本项目里
KOREAN_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$KOREAN_ROOT/../../探索队App-七年级-v1/tools/android-env.sh"
export ANDROID_AVD_HOME="$KOREAN_ROOT/.toolchains/avd"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"
mkdir -p "$ANDROID_AVD_HOME"
