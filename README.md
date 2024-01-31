# TestCraft - 学校の制作課題

## React起動時の問題点

通常、Reactアプリケーションを起動する際には `npm start` コマンドを使用します。しかし、このプロジェクトでは `useEffect` フックが2回実行されるという問題が発生しています。

### 解決策

```
npm run build
npx serve -s build -l 3000
```

### 個人的メモ

#### mysqlの接続コマンド
dbにアクセスするコマンド
```
mysql -h エンドポイント -P 3306 -u ユーザー名 -p データベース名
```
##### mysql内でのコマンド
確認したいデータベース `use <database名>;`

##### データベース内でのコマンド
テーブル一覧表示 `show tables;`
テーブル一括削除方法
```
SET FOREIGN_KEY_CHECKS = 0;
SELECT Concat('DROP TABLE ', table_name, ';') FROM information_schema.tables WHERE table_schema = 'djangodb';
SET FOREIGN_KEY_CHECKS = 1;
```

gunicornのsystemdのサービスファイルの保管場所
```/etc/systemd/system/gunicorn.service```

#### gunicornの起動方法
`gunicorn --workers 3 <project名>wsgi:application`

gunicorn本番環境設定
```
sudo systemctl daemon-reload
sudo systemctl start gunicorn.service
sudo systemctl enable gunicorn.service
```

なぜかgunicornの設定ファイルを変更しても動かないため、仮想環境に入り`TestCraft/backend/project`で`/home/ec2-user/TestCraft/.venv/bin/gunicorn --access-logfile - --workers 3 --bind 127.0.0.1:8000 project.wsgi:application`をするとうまく行く。（はず）

サービス開始
サービス停止
サービス状態確認
```
sudo systemctl start gunicorn.service
sudo systemctl stop gunicorn.service
sudo systemctl status gunicorn.service
```

#### ssl証明書の発行方法
```
sudo yum update
sudo certbot --apache -d <ドメイン名>
```

#### apiコール確認コマンド
```
curl -X POST https://api.testcrafts.net/api/login -H "Content-Type: application/json" -d '{"username":"username","password":"password"}'
curl -X POST https://api.testcrafts.net/api/signup -H "Content-Type: application/json" -d '{"username": "testuser", "email": "test@example.com", "password": "password", "is_company_user": false, "is_own_company": false}'
```

#### nginxの設定

```
sudo systemctl reload nginx.service
sudo systemctl status nginx.service
```

log一覧
```
/var/log/nginx/access.log
/var/log/nginx/error_log
```