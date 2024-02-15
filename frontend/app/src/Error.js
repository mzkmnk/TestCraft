import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@mui/material';

export default function Error404() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="container">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800">404</h1>
          <p className="text-xl font-medium text-gray-600">ページが見つかりませんでした。</p>
          <p className="mt-4">
            お探しのページは存在しないか、アクセスできない状態です。URLを確認してください。
          </p>
          <Button>
            <Link to="/">ホームに戻る</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
