import React, { useState, useEffect } from "react";
import { format, eachDayOfInterval, startOfDay, endOfDay } from "date-fns";
import { Line } from "react-chartjs-2";
import { useNavigate, useLocation } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import UserHeader from "./UserHeader";
import { useAPI } from "./hooks/useAPI";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [chartData, setChartData] = useState({});
  const API = useAPI({
    APIName: "get_graph_data",
    isLoginRequired: true,
    loadOnStart: true,
  });

  useEffect(() => {
    if (API.isSuccess && API.data.success) {
      const graphdata = API.data.data;
      let startDate;
      if (graphdata.length === 0) {
        const today = new Date();
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        );
      } else {
        startDate = new Date(graphdata[0].date);
      }
      const endDate = new Date();
      const allDates = eachDayOfInterval({
        start: startDate,
        end: endDate,
      }).map((day) => format(day, "yyyy-MM-dd"));

      const solveCounts = allDates.map((date) => {
        const data = graphdata.find((item) => item.date === date);
        return data ? data.solve_cnt : 0;
      });

      const createCounts = allDates.map((date) => {
        const data = graphdata.find((item) => item.date === date);
        return data ? data.create_cnt : 0;
      });
      setChartData({
        labels: allDates,
        datasets: [
          {
            label: "問題回答数",
            data: solveCounts,
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
          },
          {
            label: "問題作成数",
            data: createCounts,
            backgroundColor: ["rgba(54, 162, 235, 0.2)"],
            borderColor: ["rgba(54, 162, 235, 1)"],
          },
        ],
      });
    } else if (API.isSuccess === false) {
      console.error("グラフデータの取得に失敗しました");
    }
  }, [navigate, API.data, API.isSuccess]);

  useEffect(() => {
    if (location.state?.message) {
      setOpenSnackbar(true);
    }
  }, [location]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const options = {
    scales: {
      x: {
        type: "category",
        time: {
          display: true,
          text: "日付",
        },
        title: {
          display: true,
          text: "date",
        },
        ticks: {
          maxTicksLimit: 10,
          color: "#000",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "count",
        },
        ticks: {
          color: "#000",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#000",
          boxWidth: 20,
        },
      },
    },
    toolbar: {
      enabled: true,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#fff",
      bodyColor: "#fff",
      borderColor: "rgba(255, 255, 255, 0.3)",
      borderWidth: 1,
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <>
      <UserHeader />
      <div style={{ height: "400px", width: "100%" }}>
        <h2>ユーザアクティビティグラフ</h2>
        {chartData.labels ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>グラフデータがありません or ロード中</p>
        )}
      </div>
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={location.state.severity}
            sx={{ width: "100%" }}
          >
            {location.state.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

export default MyPage;
