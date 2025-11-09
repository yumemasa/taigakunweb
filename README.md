# ETEC完全

このリポジトリは ETEC Class2 の学習アプリケーション（Next.js）です。

概要:
- Next.js (app directory)
- TypeScript / React（クライアントコンポーネント中心）
- localStorage に学習履歴を保存（キー: `etec_history`）

公開手順（簡易）:
1. GitHub に新しいリポジトリを作成（Public/Private を選択）
2. リモートを追加して push
   ```cmd
   git remote add origin https://github.com/<your-username>/<repo>.git
   git push -u origin main
   ```
3. Vercel にログインして "New Project" から GitHub のこのリポジトリを選択
   - Framework: Next.js（自動設定）
   - Build command: `next build`（通常自動検出）

ローカル開発:
```cmd
npm install
npm run dev
```

備考:
- localStorage の履歴はブラウザごとに保存されます。共有環境で同じ歴史を見せたい場合は履歴をエクスポート/インポートする仕組みを追加する必要があります。
