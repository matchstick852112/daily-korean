#!/bin/bash
# 分享版 iOS：生成未签名归档。个人凭据在工程里时停止，免得凭据混进要发给别人的包
set -euo pipefail
cd "$(dirname "$0")/.."
if ! xcodebuild -version >/dev/null 2>&1; then
  echo "本机缺少完整 Xcode，只有命令行工具，不能生成 iOS 安装包。"
  exit 2
fi
if [[ -f ios/App/App/PersonalResources/korean-private.json ]]; then
  echo "检测到个人版凭据。分享版构建已停止；先运行 node tools/prepare-personal-ios.mjs --clean。"
  exit 2
fi
VERSION=$(node -p 'require("./package.json").version')
npm run fonts
npx cap sync ios
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release -destination 'generic/platform=iOS' \
  -archivePath "$PWD/releases/ios/$VERSION/学韩语-分享版.xcarchive" CODE_SIGNING_ALLOWED=NO archive
echo "已生成未签名归档，不是可直接安装的 IPA。需要用 Apple 开发账号在 Xcode 里签名导出。"
