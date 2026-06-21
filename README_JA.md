# Sub2API Kiro

Claude Code 系クライアント、Kiro アカウント、マルチプラットフォームのアカウントスケジューリングに対応した AI API ゲートウェイ。

[English](README.md) | [简体中文](README_CN.md) | [繁體中文](README_TW.md) | 日本語

> 本プロジェクトは [Wei-Shaw/sub2api](https://github.com/Wei-Shaw/sub2api) の独立メンテナンス版（フォーク）です。オリジナルの LGPL-3.0-or-later ライセンスと帰属表示を維持しつつ、Kiro を中心とした製品方向を追加しています。

## 概要

Sub2API Kiro は、サブスクリプションのクォータをチームやクライアントに配分するためのセルフホスト型 AI API ゲートウェイです。Sub2API のアカウントスケジューリング、グループ管理、課金、管理 UI、OpenAI/Anthropic 互換エンドポイントを引き継ぎつつ、Claude Code 系ワークフロー向けに第一級の Kiro サポートを追加しています。

Kiro アカウントを Anthropic、OpenAI、Gemini、Antigravity のアカウントと一つのゲートウェイ上で併用する、実用的なセルフホスト運用を想定してメンテナンスされています。

## 更新履歴

### 2026-06-21
- Kiro 向けに **Claude Opus 4.8** のサポートを追加：`claude-opus-4-8` と `claude-opus-4-8-thinking` を Kiro のモデルリストに追加し、上流モデル `claude-opus-4.8` にマッピングしました。
- デプロイガイド（[deploy/usage-guide-zh-TW.html](deploy/usage-guide-zh-TW.html)）に「AI モデルの追加・変更」の章を追加し、コード編集 → 再ビルド → 検証の流れを説明しています。

## 主な特徴

- **Kiro プラットフォーム対応**：Kiro アカウントの認可、トークン更新、リクエスト転送、モデルマッピング、使用量/クォータ表示。
- **Claude Code フレンドリー**：Kiro アカウントを Claude Messages 風エンドポイント経由でコーディングエージェント系クライアントに提供できます。
- **マルチプラットフォームゲートウェイ**：Anthropic、OpenAI、Gemini、Antigravity、Kiro のアカウントをグループ化・スケジューリング・テスト・監視できます。
- **アカウントスケジューリング**：スティッキーセッション、モデルルーティング、同時実行制御、レート制限、一時クールダウンのロジック。
- **課金と管理 UI**：API キーの配布、ユーザー/グループ管理、使用ログ、決済連携、管理ダッシュボード。
- **Docker ファーストなデプロイ**：Compose ファイルに Kiro のサーバーデプロイ手順とオプションの Social Auth コールバック設定を含みます。

## Kiro に関する注意

Kiro は「API キーをコピペすれば使える」単純なプロバイダーではありません。通常は更新が必要な OAuth 系の認証情報を使用します。

サポートされている Kiro アカウントの接続方式：

- サーバー/Docker デプロイ向けのデバイス認可。
- Google/GitHub/Cognito による Social Auth（手動でのコールバック/コード貼り付けのフォールバックあり）。
- サーバー側でアクセス可能な既存 Kiro トークンのインポート。

リモートの Docker サーバーではデバイス認可を推奨します。Kiro の Social Auth はコールバック URL `http://127.0.0.1:49153/oauth/callback` を使用しますが、リモートデプロイではブラウザ上の `127.0.0.1` はユーザーのマシンを指し、コンテナではありません。手動でのコールバック貼り付け、SSH トンネリング、またはトレードオフを理解した上で明示的にポート `49153` を公開してください。

## 対応プラットフォーム

| プラットフォーム | 主な用途 |
|------|----------|
| Anthropic | Claude API / Claude Code 互換ルーティング |
| OpenAI | OpenAI 互換 API、Responses、Chat Completions |
| Gemini | Gemini / Code Assist アカウントスケジューリング |
| Antigravity | Antigravity アカウント経由の Claude / Gemini |
| Kiro | Kiro 認証情報による Claude Code 系アクセス |

利用可能なモデルは、各上流アカウントと管理者が設定したモデルマッピングに依存します。

## Docker クイックスタート

このフォークの推奨イメージ：

```bash
docker pull ghcr.io/weiopenai/sub2api-kiro:latest
```

Compose デプロイ：

```bash
git clone https://github.com/weiopenai/sub2api-kiro.git
cd sub2api-kiro/deploy
cp .env.example .env
docker compose up -d
docker compose logs -f sub2api
```

> 新規サーバー向けの詳しいデプロイ手順（繁体字中国語）は [deploy/install-zh-TW.html](deploy/install-zh-TW.html) を参照してください。

手動クローン：

```bash
git clone https://github.com/weiopenai/sub2api-kiro.git
cd sub2api-kiro/deploy
cp .env.example .env
docker compose -f docker-compose.local.yml up -d
```

ローカル Docker で Kiro Social Auth の自動コールバックを使う場合は、必要に応じてポート `49153` を公開し、以下を設定します：

```env
KIRO_SOCIAL_CALLBACK_LISTEN_HOST=0.0.0.0
KIRO_SOCIAL_CALLBACK_BIND_HOST=127.0.0.1
```

通常のリモートサーバーでのデバイス認可では、これらは空のままにしてください。

## 開発

バックエンド：

```bash
cd backend
go test ./internal/pkg/kiro ./internal/handler/admin ./internal/server/routes ./cmd/server
go run ./cmd/server
```

フロントエンド：

```bash
cd frontend
pnpm install
pnpm run typecheck
pnpm run dev
```

Docker ビルド：

```bash
docker build -t sub2api:kiro-dev .
```

## 上流（アップストリーム）同期方針

このフォークは製品として独立していますが、`Wei-Shaw/sub2api` の有用な上流修正（特にセキュリティ、スケジューラ、課金、プロバイダー互換性の修正）は選択的に取り込むべきです。

推奨ワークフロー：

```bash
git remote add upstream https://github.com/Wei-Shaw/sub2api.git
git fetch upstream
git cherry-pick <upstream-fix-commit>
```

Kiro 固有の製品方向と競合する場合は、無条件のマージを避けてください。

## 帰属表示

本プロジェクトは [Wei-Shaw/sub2api](https://github.com/Wei-Shaw/sub2api) を基にしています。基盤を提供してくれたオリジナルの作者およびコントリビューターに感謝します。

Go モジュールパスは、リスクの高い import パス変更を避けるため、現時点では `github.com/Wei-Shaw/sub2api` のままです。公開リポジトリ、Docker イメージ、ドキュメントは `weiopenai/sub2api-kiro` の下でメンテナンスされています。

## 免責事項

本プロジェクトは技術的な学習、研究、セルフホスト型ゲートウェイの実験を目的としています。サブスクリプションアカウントを用いたゲートウェイの利用は、上流プロバイダーの利用規約に違反する可能性があります。アカウントのリスク、クォータの使用、課金の挙動、各プロバイダー規約の遵守については、利用者ご自身の責任となります。

## ライセンス

[GNU Lesser General Public License v3.0](LICENSE) 以降の下でライセンスされています。

オリジナル著作権：

Copyright (c) 2026 Wesley Liddick
