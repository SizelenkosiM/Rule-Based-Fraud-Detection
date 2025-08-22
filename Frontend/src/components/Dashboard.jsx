import React, { useState, useEffect } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { useAuth } from "../auth/AuthContext";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("6");
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("fraud_detection_token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        const apiUrl = process.env.REACT_APP_API_URL;

        const [transactionsResponse, alertsResponse] = await Promise.all([
          fetch(`${apiUrl}/api/transactions`, { headers }),
          fetch(`${apiUrl}/api/alerts`, { headers })
        ]);


        if (!transactionsResponse.ok) {
          throw new Error(`Error fetching transactions: ${transactionsResponse.status}`);
        }

        if (!alertsResponse.ok) {
          throw new Error(`Error fetching alerts: ${alertsResponse.status}`);
        }

        const transactionsData = await transactionsResponse.json();
        const alertsData = await alertsResponse.json();

        setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
        setAlerts(Array.isArray(alertsData) ? alertsData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data. Please try refreshing the page.");
        setTransactions([]);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const completedTransactions = transactions?.filter((t) => t.status === "completed")?.length || 0;
  const flaggedTransactions = transactions?.filter((t) => t.status === "flagged")?.length || 0;
  const alertRate = transactions.length ? ((flaggedTransactions / transactions.length) * 100).toFixed(1) : 0;

  const prepareFraudChartData = () => {
    if (!Array.isArray(transactions) || transactions.length === 0) {
      return {
        labels: [],
        fraudData: [],
        safeData: []
      };
    }

    const transactionsByMonth = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.transaction_date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

      if (!acc[monthYear]) {
        acc[monthYear] = {
          totalAmount: 0,
          fraudAmount: 0,
          safeAmount: 0,
          date: date
        };
      }

      acc[monthYear].totalAmount += parseFloat(transaction.amount);

      const isFraud = transaction.status === 'flagged' ||
      alerts.some(alert => alert.transaction_id === transaction.id);

      if (isFraud) {
        acc[monthYear].fraudAmount += parseFloat(transaction.amount);
      } else {
        acc[monthYear].safeAmount += parseFloat(transaction.amount);
      }

      return acc;
    }, {});

    const sortedMonths = Object.keys(transactionsByMonth).sort((a, b) =>
      transactionsByMonth[a].date - transactionsByMonth[b].date
    );

    let monthsToShow = sortedMonths.length;
    if (timePeriod === "6") monthsToShow = Math.min(6, sortedMonths.length);
    if (timePeriod === "12") monthsToShow = Math.min(12, sortedMonths.length);

    const displayMonths = sortedMonths.slice(-monthsToShow);

    return {
      labels: displayMonths,
      fraudData: displayMonths.map(month => transactionsByMonth[month].fraudAmount),
      safeData: displayMonths.map(month => transactionsByMonth[month].safeAmount)
    };
  };

  const fraudChartData = prepareFraudChartData();

  const fraudChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2b2d42',
        bodyColor: '#2b2d42',
        borderColor: '#dddddd',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': $' + context.raw.toLocaleString();
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
          font: {
            weight: 'bold',
            size: 18
          },
          color: '#8d99ae'
        },
        grid: {
          display: true,
          color: 'rgba(141, 153, 174, 0.25)',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: 'rgba(19, 19, 20, 0.92)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount (USD)',
          font: {
            weight: 'bold',
            size: 16
          },
          color: '#8d99ae'
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
          color: 'rgba(19, 19, 20, 0.92)'

        },
        grid: {
          color: 'rgba(141, 153, 174, 0.2)',
          drawBorder: false,
          display: true
        },
        min: 0
      }
    },
    elements: {
      line: {
        borderWidth: 3
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const pieData = {
    labels: ["Completed", "Flagged"],
    datasets: [
      {
        data: [completedTransactions, flaggedTransactions],
        backgroundColor: ["#4f46e5", "#f43f5e"],
        borderColor: "#fff",
        borderWidth: 2,
        hoverBackgroundColor: ["#6366f1", "#fb7185"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#333',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: '500'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true
      }
    },
    cutout: '65%',
    borderRadius: 4,
    spacing: 2
  };

  const alertsByRule = Array.isArray(alerts) ? alerts.reduce((acc, alert) => {
    acc[alert.rule_triggered] = (acc[alert.rule_triggered] || 0) + 1;
    return acc;
  }, {}) : {};

  const barData = {
    labels: Object.keys(alertsByRule).map((rule) => {
      switch (rule) {
        case "single_transaction_limit": return "Single Limit";
        case "monthly_cumulative_limit": return "Monthly Limit";
        case "dormant_account_activation": return "Dormant Account";
        default: return rule;
      }
    }),
    datasets: [
      {
        label: "Number of Alerts",
        data: Object.values(alertsByRule),
        backgroundColor: [
          '#4f46e5',
          '#8b5cf6',
          '#a855f7',
          '#d946ef'
        ],
        hoverBackgroundColor: [
          '#6366f1',
          '#a78bfa',
          '#c084fc',
          '#e879f9'
        ],
        borderColor: 'transparent',
        borderWidth: 0,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            family: "'Inter', sans-serif",
            size: 13
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: '600'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    borderRadius: 6,
    barPercentage: 0.7,
    categoryPercentage: 0.8
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">❌</div>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-left-panel">
          <div className="stats-cards-container">
            <div className="stats-cards">
              <div className="card">
                <h4>Total Transactions</h4>
                <p className="stat">{transactions.length}</p>
              </div>
              <div className="card">
                <h4>Total Alerts</h4>
                <p className="stat">{alerts.length}</p>
              </div>
              <div className="card">
                <h4>Alert Rate</h4>
                <p className="stat">{alertRate}%</p>
              </div>
            </div>
          </div>

          <div className="trends-chart-container">
            <h3>Monthly Fraud Amounts</h3>
            <div className="top-controls" style={{ margin: '1rem 0', display: 'flex', justifyContent: 'flex-end' }}>
              <div className="filters" style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className={`filter-btn ${timePeriod === "6" ? "active" : ""}`}
                  onClick={() => setTimePeriod("6")}
                  style={{
                    padding: '0.6rem 1.2rem',
                    background: timePeriod === "6" ? 'blue' : 'white',
                    color: timePeriod === "6" ? 'white' : 'var(--color-text-secondary)',
                    border: '0.01px solid',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    transition: 'var(--transition-fast)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  6 Months
                </button>
                <button
                  className={`filter-btn ${timePeriod === "12" ? "active" : ""}`}
                  onClick={() => setTimePeriod("12")}
                  style={{
                    padding: '0.6rem 1.2rem',
                    background: timePeriod === "12" ? 'blue' : 'white',
                    color: timePeriod === "12" ? 'white' : 'var(--color-text-secondary)',
                    border: '0.01px solid',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    transition: 'var(--transition-fast)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  12 Months
                </button>
                <button
                  className={`filter-btn ${timePeriod === "all" ? "active" : ""}`}
                  onClick={() => setTimePeriod("all")}
                  style={{
                    padding: '0.6rem 1.2rem',
                    background: timePeriod === "all" ? 'blue' : 'white',
                    color: timePeriod === "all" ? 'white' : 'var(--color-text-secondary)',
                    border: '0.01px solid',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    transition: 'var(--transition-fast)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  All Time
                </button>
              </div>
            </div>

            <div className="chart" style={{ height: "400px" }}>
              <Line
                data={{
                  labels: fraudChartData.labels,
                  datasets: [
                    {
                      label: 'Fraud Amount',
                      data: fraudChartData.fraudData,
                      borderColor: '#e63946',
                      backgroundColor: 'rgba(230, 57, 70, 0.2)',
                      borderWidth: 3,
                      tension: 0.4,
                      fill: true,
                      pointBackgroundColor: '#e63946',
                      pointBorderColor: '#fff',
                      pointBorderWidth: 0.5,
                      pointRadius: 4,
                      pointHoverRadius: 6
                    },
                    {
                      label: 'Safe Amount',
                      data: fraudChartData.safeData,
                      borderColor: '#2ecc71',
                      backgroundColor: 'rgba(46, 204, 113, 0.2)',
                      borderWidth: 2,
                      tension: 0,
                      fill: true,
                      pointRadius: 3,
                      pointBackgroundColor: '#2ecc71',
                      pointBorderColor: '#fff',
                      pointBorderWidth: 0.5,
                      pointHoverRadius: 5
                    }
                  ]
                }}
                options={fraudChartOptions}
              />
            </div>

            <div className="legend" style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '2rem',
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--border-radius-md)'
            }}>
              <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="legend-color fraud-color" style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '20%',
                  backgroundColor: '#e63946',

                }}></div>
                <span style={{fontSize: '1rem'}}>Fraud Amount</span>
              </div>
              <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="legend-color safe-color" style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '20%',
                  backgroundColor: '#2ecc71',

                }}></div>
                <span style={{fontSize: '1rem'}}>Safe Amount</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-right-panel">
          <div className="transaction-status-container">
            <h3>Transaction Status</h3>
            <div className="chart-container" style={{ height: "280px", width: "400px" }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>

          <div className="alerts-rule-container">
            <h3>Alerts by Rule</h3>
            <div className="chart-container" style={{ height: "280px" }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;