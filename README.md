# decktime

DJ セット向けのフルスクリーン カウントダウン タイマー PWA. スマホ縦画面前提, 現在時刻 / 残り時間 / 経過時間の 3 分割ビュー, 遅延の少ない秒表示, スリープ抑止.

**English version → [README.en.md](./README.en.md)**

---

## 主な機能

- **3 画面分割**: 上 = 現在時刻, 中 = 残り時間 (カウントダウン), 下 = 経過時間 (カウントアップ). 全て `H:MM:SS` で秒まで表示.
- **HH:MM ペアでセット時間指定**: 開始時刻と終了時刻を入れる方式. 現場のタイムテーブルと合わせやすい.
- **段階的な色変化 + 点滅**: 残り 3 分以下で **黄色**, 残り 1 分以下で **黄色 + 点滅 (1Hz)**, 超過で **赤**.
- **開始前 START も許容**: セット開始時刻より前に START を押すと ELAPSED が負値でカウントされ, 開始時刻を跨ぐと自動で正に切り替わる.
- **保存プリセット (SAVED)**: 開始–終了ペアを最大 12 件保存, タップで即セットして戻る. 昇順表示. `×` で削除確認モーダル.
- **スリープ抑止 (Screen Wake Lock API)**: 右上に `SLEEP: OFF / ON` トグル. タップで手動切替. 手動で切ったあとは自動再取得しない.
- **破壊操作は自前モーダル**: RESET / OVERWRITE / DELETE はネイティブ `confirm()` ではなく Chakra Petch のカスタムモーダルを表示.
- **ゼロ依存**: 単一 `index.html` + 静的アイコンのみ. ビルドステップなし, フレームワークなし.

## 使い方

1. サイトを開く → 右下の `SET` をタップ.
2. `START` / `END` を選択 (デフォルト: 現在時刻 / +20 分). `−/+ 20m` の duration picker で 10 分刻みに増減可能.
3. よく使う時間帯は `↑ SAVE CURRENT` で保存. 次回以降は上部の SAVED から 1 タップで呼び出せる.
4. メイン画面の `START` で計測開始. スリープ抑止が自動で有効に (`SLEEP: OFF`).

## 技術スタック

- Vanilla HTML / CSS / JavaScript (単一 `index.html`)
- [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) (Google Fonts)
- Screen Wake Lock API (secure context 必須)
- `localStorage` — セッション状態と保存プリセット
- Cloudflare Pages にデプロイ想定 (静的ホスティングなら何でも動く)

## ローカルで動かす

```bash
# 任意の静的サーバで OK. localhost なら Wake Lock も動く.
cd decktime
python3 -m http.server 8787
# → http://localhost:8787/
```

**Wake Lock は Secure context 必須**なので, LAN の IP (HTTP) 経由では動作しない. 実挙動を試すには localhost か HTTPS (Cloudflare Pages / cloudflared tunnel / ngrok 等) 経由でアクセスする.

## Lint

```bash
bun run lint
```

`tools/lint-index.mjs` が `index.html` の構造チェック (単一 script ブロック, ID の参照/宣言整合, `document.getElementById` の使用集約) を実行する.

## デプロイ

Cloudflare Pages の Direct Upload:

1. `_headers`, `manifest.webmanifest`, `index.html`, `icon-*.png`, `icon.svg`, `favicon-32.png` を zip.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets.
3. zip をドラッグして Deploy.
4. Custom domains でサブドメイン (例: `timer.example.com`) を追加.

## ライセンス

MIT
