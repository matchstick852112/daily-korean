#!/bin/bash
# 分享版：不带任何连接凭据，AI 伙伴显示「未开通」，其他功能都能用
set -euo pipefail
cd "$(dirname "$0")/.."
source tools/android-env.sh
VERSION=$(node -p 'require("./package.json").version')
npm run fonts
npx cap sync android
(cd android && ./gradlew --no-daemon :app:assembleDebug -PkoreanVersionName="$VERSION")
APK=android/app/build/outputs/apk/debug/app-debug.apk
unzip -l "$APK" > "$APK.list"
if grep -q korean-private.json "$APK.list"; then echo '分享版里出现了凭据文件，已停止。'; exit 1; fi
OUT="releases/android/$VERSION"; mkdir -p "$OUT"
cp "$APK" "$OUT/学韩语-1A-v$VERSION-分享版.apk"
"$ANDROID_HOME/build-tools/36.0.0/apksigner" verify "$OUT/学韩语-1A-v$VERSION-分享版.apk"
echo "分享版已生成并通过签名检查：$OUT/学韩语-1A-v$VERSION-分享版.apk"
