import React, { useState,useEffect } from 'react';
import { format, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import UserHeader from './UserHeader';
import 'chartjs-adapter-date-fns';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


function MyPage() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({}); 

  useEffect(() => {
    fetch('http://localhost:8000/api/check_auth', {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.authenticated === false) {
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

      //　グラフのデータを取得する
      fetch('http://localhost:8000/api/get_graph_data',{
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
      .then(response => response.json())
      .then(userData => {
        if (userData.success && userData.data) {
          const graphdata = userData.data;

          // 現在の日付までの全ての日付を生成する
          const startDate = new Date(graphdata[0].date);
          const endDate = new Date();
          const allDates = eachDayOfInterval({
            start: startDate,
            end: endDate
          }).map(day => format(day, 'yyyy-MM-dd'));

          // 日付に対応するデータを埋め込む
          const solveCounts = allDates.map(date => {
            const data = graphdata.find(item => item.date === date);
            return data ? data.solve_cnt : 0;
          });

          const createCounts = allDates.map(date => {
            const data = graphdata.find(item => item.date === date);
            return data ? data.create_cnt : 0;
          });
          setChartData({
            labels:allDates,
            datasets: [
              {
                label:'問題回答数',
                data: solveCounts,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                ],
              },
              {
                label:'問題作成数',
                data:createCounts,
                backgroundColor: [
                  'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                  'rgba(54, 162, 235, 1)',
                ],
              }
            ]
          })
          }else{
            console.log("グラフデータの取得に失敗しました");
          }
        })
  }, [navigate]);

  const options = {
    scales: {
      x: {
        type: 'category',
        time: {
          display: true,
          text: '日付'
        },
        title: {
          display: true,
          text: 'date'
        },
        ticks: {
          maxTicksLimit: 10,
          color: "#000",
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'count'
        },
        ticks: {
          color: '#000',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins:{
      legend: {
        position: 'top',
        labels: {
          color: '#000',
          boxWidth: 20,
        },
      },
    },
    toolbar: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderWidth: 1
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
      <UserHeader />
      <div style={{ height: '400px', width: '100%'}}>
        <h2>ユーザアクティビティグラフ</h2>
        {chartData.labels ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>グラフデータがありません or ロード中</p>
        )}
      </div>
    </>
  );
}

export default MyPage;