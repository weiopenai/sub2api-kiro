# Sub2API Kiro

面向 Claude Code 類客戶端、Kiro 帳號和多平台帳號排程的 AI API 閘道。

[English](README.md) | [简体中文](README_CN.md)

> 本專案是基於 [Wei-Shaw/sub2api](https://github.com/Wei-Shaw/sub2api) 的獨立維護分支。專案繼續保留原始 LGPL-3.0-or-later 授權條款和來源署名，但產品方向會圍繞 Kiro、Claude Code 類客戶端和自部署閘道情境獨立演進。

## 專案定位

Sub2API Kiro 是一個自部署 AI API 閘道，用於把多個上游訂閱帳號的額度統一分發給使用者和客戶端。它保留了 Sub2API 原有的帳號排程、分組、計費、管理後台、OpenAI/Anthropic 相容介面，並加入了完整的 Kiro 平台支援。

這個版本更適合我們自己的生產情境：Kiro 帳號需要和 Anthropic、OpenAI、Gemini、Antigravity 等帳號一起被統一管理、排程和計費。

## 核心能力

- **Kiro 平台適配**：Kiro 授權、token 重新整理、請求轉發、模型對映、用量/額度視窗顯示。
- **適配 Claude Code 類客戶端**：Kiro 帳號可透過 Claude Messages 風格介面提供給 Coding Agent 客戶端使用。
- **多平台閘道**：Anthropic、OpenAI、Gemini、Antigravity、Kiro 帳號統一分組、排程、測試和監控。
- **帳號排程**：黏性工作階段、模型路由、併發限制、RPM 限速、臨時冷卻等能力。
- **計費與管理 UI**：API Key 分發、使用者/分組管理、用量日誌、支付整合、後台儀表板。
- **Docker 優先部署**：Compose 配置包含 Kiro 伺服器部署說明和可選 Social Auth 回呼配置。

## Kiro 使用說明

Kiro 不是普通「複製 API Key」即可使用的平台。它主要依賴可重新整理的 OAuth 類憑證。

目前支援的 Kiro 帳號接入方式：

- 裝置授權，推薦用於伺服器和 Docker 部署。
- Google/GitHub/Cognito Social Auth，並支援手動貼上 callback/code。
- 匯入伺服端可存取的既有 Kiro token。

遠端 Docker 伺服器上推薦使用裝置授權。Kiro Social Auth 的預設回呼地址是 `http://127.0.0.1:49153/oauth/callback`；在遠端部署時，瀏覽器裡的 `127.0.0.1` 指的是使用者本機，不是伺服器容器。可以使用手動貼上回呼、SSH 通道，或在明確理解風險後對映 `49153` 連接埠。

## 支援平台

| 平台 | 典型用途 |
|------|----------|
| Anthropic | Claude API / Claude Code 相容路由 |
| OpenAI | OpenAI 相容介面、Responses、Chat Completions |
| Gemini | Gemini / Code Assist 帳號排程 |
| Antigravity | 透過 Antigravity 帳號存取 Claude / Gemini |
| Kiro | 透過 Kiro 憑證為 Claude Code 類客戶端提供存取 |

具體可用模型取決於管理員配置的上游帳號和模型對映。

## Docker 快速開始

本分支推薦映像檔：

```bash
ghcr.io/weiopenai/sub2api-kiro:latest
```

Compose 部署：

```bash
git clone https://github.com/weiopenai/sub2api-kiro.git
cd sub2api-kiro/deploy
cp .env.example .env   # 編輯 .env 設定密碼、連接埠等
docker compose up -d
docker compose logs -f sub2api
```

本機 Docker 如需 Kiro Social Auth 自動回呼，可以額外開放 `49153` 並設定：

```env
KIRO_SOCIAL_CALLBACK_LISTEN_HOST=0.0.0.0
KIRO_SOCIAL_CALLBACK_BIND_HOST=127.0.0.1
```

普通遠端伺服器部署建議保持為空，使用裝置授權。

## 開發

後端：

```bash
cd backend
go test ./internal/pkg/kiro ./internal/handler/admin ./internal/server/routes ./cmd/server
go run ./cmd/server
```

前端：

```bash
cd frontend
pnpm install
pnpm run typecheck
pnpm run dev
```

Docker 建構：

```bash
docker build -t sub2api:kiro-dev .
```

## 上游同步策略

本專案會作為獨立產品維護，但仍可選擇性同步 `Wei-Shaw/sub2api` 的重要修復，尤其是安全、排程、計費和供應商相容相關變更。

建議流程：

```bash
git remote add upstream https://github.com/Wei-Shaw/sub2api.git
git fetch upstream
git cherry-pick <upstream-fix-commit>
```

不要盲目合併上游大版本，避免破壞 Kiro 方向的穩定性。

## 來源說明

本專案衍生自 [Wei-Shaw/sub2api](https://github.com/Wei-Shaw/sub2api)。感謝原作者和社群貢獻者提供的基礎工程。

目前 Go module path 仍保留為 `github.com/Wei-Shaw/sub2api`，目的是避免大規模 import path 改名帶來的風險。公開倉庫、Docker 映像檔和文件由 `xiangking/sub2api-kiro` 獨立維護。

## 免責聲明

本專案僅用於技術學習、研究和自部署閘道實驗。使用訂閱帳號閘道可能違反上游服務條款。帳號風險、額度使用、計費行為和合規責任由使用者自行承擔。

## 授權條款

本專案基於 [GNU 寬通用公共授權條款 v3.0](LICENSE) 或更高版本授權。

原始版權聲明：

Copyright (c) 2026 Wesley Liddick
