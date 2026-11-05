#!/bin/bash
# Mac 分享版：给同事装的 dmg，只出 Apple 芯片版。DeepSeek 凭据只进主进程读取的 korean-private.json，网页文件里没有；没有 Apple 开发者签名，只做临时签名
set -euo pipefail
cd "$(dirname "$0")/.."
VERSION=$(node -p 'require("./package.json").version')
OUT="releases/mac/$VERSION"
npm run fonts
rm -f "$OUT"/*.dmg
rm -rf desktop/app/www "$OUT"/mac "$OUT"/mac-arm64 # 只清打包产物，同目录的安装说明保留
cp -R www desktop/app/www
node tools/scan-key.mjs desktop/app/www desktop/app/main.cjs desktop/app/preload.cjs # 网页和代码里不能有凭据
trap 'rm -f desktop/app/korean-private.json' EXIT
node tools/prepare-mac.mjs
npx electron-builder --config desktop/electron-builder.json --mac --publish never
# 凭据只应出现在两个 app.asar 里（主进程读取），别的文件一律不该有
HITS=$(node tools/scan-key.mjs "$OUT" | grep '^命中：' || true)
if printf '%s\n' "$HITS" | grep -v '/Contents/Resources/app.asar$' | grep -q .; then echo '凭据出现在 app.asar 以外的文件里，停止。'; exit 1; fi
mv "$OUT/每日韩语-$VERSION-arm64.dmg" "$OUT/每日韩语-$VERSION-Apple芯片.dmg"
rm -rf "$OUT"/*.blockmap "$OUT"/mac "$OUT"/mac-arm64 "$OUT"/.icon-icns "$OUT"/builder-debug.yml
echo "已生成：$OUT/每日韩语-$VERSION-Apple芯片.dmg"
