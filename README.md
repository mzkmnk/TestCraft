# TestCraft - 学校の制作課題

## React起動時の問題点

通常、Reactアプリケーションを起動する際には `npm start` コマンドを使用します。しかし、このプロジェクトでは `useEffect` フックが2回実行されるという問題が発生しています。

### 解決策

```
npm run build
npx serve -s build -l 3000
```

### 個人的メモ
gunicornのsystemdのサービスファイルの保管場所
```/etc/systemd/system/gunicorn.service```

gunicornの起動方法
`gunicorn --workers 3 <project名>wsgi:application`

gunicorn本番環境設定
```
sudo systemctl daemon-reload
sudo systemctl start gunicorn.service
sudo systemctl enable gunicorn.service
```

サービス開始
サービス停止
サービス状態確認
```
sudo systemctl start gunicorn.service
sudo systemctl stop gunicorn.service
sudo systemctl status gunicorn.service
```

ssl証明書の発行方法
```
sudo yum update
sudo certbot --apache -d <ドメイン名>
```

Apacheファイルの格納場所
```
/etc/httpd/conf/httpd.conf
```
アパッチ再起動
```
sudo systemctl restart httpd
```

apiコール確認コマンド
```
url -X POST https://api.testcrafts.net/api/login -H "Content-Type: application/json" -d '{"username":"username","password":"password"}'
```