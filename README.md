# TestCraft - 学校の制作課題

## React起動時の問題点

通常、Reactアプリケーションを起動する際には `npm start` コマンドを使用します。しかし、このプロジェクトでは `useEffect` フックが2回実行されるという問題が発生しています。

### 解決策

`npm run build`
`npx serve -s build -l 3000`