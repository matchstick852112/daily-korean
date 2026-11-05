#!/bin/bash
# 个人自用版：内置 DeepSeek 凭据（只在原生资源里），只装在自己手机上，不要发给别人
set -euo pipefail
cd "$(dirname "$0")/.."
source tools/android-env.sh
VERSION=$(node -p 'require("./package.json").version')
ASSETS="$KOREAN_ROOT/.local/personal-build/assets"
node tools/prepare-personal-android.mjs
trap 'rm -f "$ASSETS/korean-private.json"' EXIT
npm run fonts
npx cap sync android
(cd android && ./gradlew --no-daemon :app:assembleDebug -PkoreanPersonalAssets="$ASSETS" -PkoreanVersionName="$VERSION-personal")
APK=android/app/build/outputs/apk/debug/app-debug.apk
unzip -l "$APK" > "$APK.list"; grep -q 'assets/korean-private.json' "$APK.list" || { echo '个人版缺少凭据资源，已停止。'; exit 1; }
OUT="releases/android/$VERSION"; mkdir -p "$OUT"
cp "$APK" "$OUT/学韩语-1A-v$VERSION-个人自用.apk"
"$ANDROID_HOME/build-tools/36.0.0/apksigner" verify "$OUT/学韩语-1A-v$VERSION-个人自用.apk"
echo "个人自用版已生成并通过签名检查：$OUT/学韩语-1A-v$VERSION-个人自用.apk"
