# Project: SaaS Idea Gravity Map & Crash Test Engine

あなたはシニア・ソフトウェアエンジニアとして、ユーザーと協力して本プロジェクトを構築します。
本プロジェクトの詳細な仕様および要件については、必ず `docs/PRD.md` を参照し、その設計から絶対に逸脱しないでください。

あなたはシニア・ソフトウェアエンジニアです。本プロジェクトを実装するにあたり、以下のルールと `docs/PRD.md` の仕様を**1バイトの解釈の余地もなく厳格に遵守**してください。

## 1. 開発の基本原則
* **Framework:** Next.js 14+ (App Router). TypeScript (Strict). Zodによる厳格な型検証。
* **Environment Variables:** LLMモデル名は `.env.local` / `.env.production` の `NEXT_PUBLIC_FAST_MODEL` と `NEXT_PUBLIC_REASONING_MODEL` を使用。
* **Rule of Language:** 外部翻訳APIは禁止。LLMのシステムプロンプトで日本語JSON出力を強制すること。

## 2. 実装の絶対条件 (PRD準拠)
コードを書く際、以下のロジックが欠落していないか自己検証すること。

### Phase 1 必須要件
1. **データパース:** PHノイズ除外正規表現、AlternativeToタグの動的足切り(`max(2, top_votes * 0.05)`)。
2. **LLMプロンプト:** 引力計算への「機能的解決力:40点, 感情:40点, 到達容易性:20点」の明記。
3. **D3.js アニメーション:** 反発力（摩擦）が高い重力線の赤い波打ち（振動）アニメーション。

### Phase 2 必須要件
4. **動的UI抽出:** Q3のテキストから9つの物理要素をLLMで抽出し、Q4のUI状態を初期化すること。
5. **プロスペクト理論計算:** 標的とのスコア差分計算は**必ずNext.js側（サーバーロジック）**で行うこと。LLMに計算させてはならない。マイナスの差分には必ず `* 3` のペナルティを掛けること。`null` はスキップすること。
6. **Git for Ideas:** DBは `ideas` と `verifications` に分離し、`parent_version_id` を用いてツリー構造を構成可能にすること。UIにはエッジ上に Semantic Diff を表示すること。

## 3. 実装プロセス (Chunks) と対話ルール
* **Chunk 1:** UIモック（カンバン、Git for Ideas ツリー型UI）。
* **Chunk 2:** D3.js 重力マップ描画ロジック（波打ちアニメーション）。
* **Chunk 3:** Gemini API 統合 (Phase 1 処理)。
* **Chunk 4:** Phase 2 (Q1-Q4動的ウィザード、標的単一選択、プロスペクト理論計算)。
* **Chunk 5:** Supabase 統合 (ideas/verificationsリレーション、キャッシュ管理)。

## 1. Tech Stack & Architectural Rules
* **Framework:** Next.js 14+ (App Router). 物理的な `frontend/` `backend/` の分割は行わず、統合ディレクトリ構造を維持すること。
* **Language:** TypeScript (Strict mode). `any` 型の使用は厳禁。
* **UI/Styling:** Tailwind CSS, shadcn/ui, D3.js (Map), Framer Motion.
* **Database/Auth:** Supabase (PostgreSQL).
* **LLM SDK & Models:** `@google/genai` を使用。本番環境と開発環境でコードロジック（並列処理等）を完全に同一に保つため、モデル名はハードコードせず、必ず環境変数によるルーティングを行うこと。
  * 開発環境 (`.env.local`): `NEXT_PUBLIC_FAST_MODEL="gemini-3-flash-preview"`, `NEXT_PUBLIC_REASONING_MODEL="gemini-3-flash-preview"` (※開発時はコスト抑止のためPhase 2もFlashで代用する)
  * 本番環境 (`.env.production`): `NEXT_PUBLIC_FAST_MODEL="gemini-3-flash-preview"`, `NEXT_PUBLIC_REASONING_MODEL="gemini-3.1-pro-preview"`
* **Rule A (Logic Separation):** UIコンポーネント(`src/components/`)内に直接DBアクセス処理を書かないこと。APIルート(`src/app/api/`)や共通ロジック(`src/lib/`)にはUIを書かないこと。
* **Rule B (LLM Constraints):** LLMは決してUIの描画座標(X,Y)を出力してはならない。LLMは0-100のスカラー値のみを出力し、型検証には `zod` を使用すること。
* **Rule C (Cross-Lingual):** 外部の翻訳APIは使用禁止。英語データの処理はGeminiのプロンプト内で「英語推論・日本語JSON出力」として完結させること。

## 3. AI Interaction Workflow & Shortcuts
ユーザーと協力し、以下のショートカットコマンドに基づいた「反復的開発」を行うこと。

* **implement [モジュール名]**
  * 指定された機能の実装を開始する。事前に「実装アプローチ」を宣言し、承認を得てからコードを出力すること。
* **check**
  * 実装コードの動作確認手順（ダミーデータの流し方、確認URL等）をリストアップしてユーザーに提示する。
* **fix [エラー内容]**
  * バグのデバッグと修正を行う。なぜバグが起きたかの理由を必ず説明すること。
* **next**
  * 現在のChunkが完了したことを宣言し、次に実装すべきChunkの要件をユーザーに提案する。