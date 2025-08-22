"use client"

import { useState, useEffect } from "react"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { ChevronDown } from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

function UserBehaviorAnalysis() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [userTransactions, setUserTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState("30")

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchUserTransactions()
    }
  }, [selectedUser, timeRange])

  const fetchUsers = () => {
    const demoUsers = [
      { id: "user123", name: "Anesu Makombe" },
      { id: "user124", name: "Panashe Chasi" },
      { id: "user125", name: "Donald Gumbo" },
      { id: "user126", name: "Sizelenkosi Mpande" },
    ]

    setUsers(demoUsers)
  }

  const fetchUserTransactions = () => {
    setLoading(true)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(timeRange))

    fetch(`http://localhost:5000/api/transactions?user_id=${selectedUser}`)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter((transaction) => {
          const transactionDate = new Date(transaction.transaction_date)
          return transactionDate >= startDate && transactionDate <= endDate
        })

        setUserTransactions(filteredData)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching user transactions:", error)
        setLoading(false)
      })
  }

  const handleUserChange = (userId) => {
    setSelectedUser(userId)
  }

  const prepareTransactionHistoryData = () => {
    const groupedByDate = {}

    userTransactions.forEach((transaction) => {
      const date = new Date(transaction.transaction_date).toISOString().split("T")[0]

      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          totalAmount: 0,
          count: 0,
        }
      }

      groupedByDate[date].totalAmount += Number.parseFloat(transaction.amount)
      groupedByDate[date].count += 1
    })

    const sortedDates = Object.keys(groupedByDate).sort()

    return {
      labels: sortedDates,
      datasets: [
        {
          label: "Transaction Amount",
          data: sortedDates.map((date) => groupedByDate[date].totalAmount),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          yAxisID: "y",
          pointBackgroundColor: "#3b82f6",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Transaction Count",
          data: sortedDates.map((date) => groupedByDate[date].count),
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.05)",
          borderWidth: 2,
          tension: 0.4,
          yAxisID: "y1",
          pointBackgroundColor: "#f97316",
          pointBorderColor: "#fff",
          pointBorderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5,
        },
      ],
    }
  }

  const prepareTransactionStatusData = () => {
    const statusCounts = {
      completed: 0,
      flagged: 0,
      pending: 0,
    }

    userTransactions.forEach((transaction) => {
      statusCounts[transaction.status] += 1
    })

    return {
      labels: ["Completed", "Flagged", "Pending"],
      datasets: [
        {
          data: [statusCounts.completed, statusCounts.flagged, statusCounts.pending],
          backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
          hoverBackgroundColor: ["#45a049", "#e53935", "#ffb300"],
        },
      ],
    }
  }

  const prepareAmountDistributionData = () => {
    const ranges = {
      "0-50": 0,
      "51-100": 0,
      "101-200": 0,
      "201-500": 0,
      "501+": 0,
    }

    userTransactions.forEach((transaction) => {
      const amount = Number.parseFloat(transaction.amount)

      if (amount <= 50) ranges["0-50"] += 1
      else if (amount <= 100) ranges["51-100"] += 1
      else if (amount <= 200) ranges["101-200"] += 1
      else if (amount <= 500) ranges["201-500"] += 1
      else ranges["501+"] += 1
    })

    return {
      labels: Object.keys(ranges),
      datasets: [
        {
          label: "Transaction Count",
          data: Object.values(ranges),
          backgroundColor: [
            "#82ccdd",
            "#1e3799",
            "#70a1ff",
            "#1B9CFC",
            "#3742fa",
          ],
          hoverBackgroundColor: [
            "#82ccdd",
            "#1e3799",
            "#70a1ff",
            "#1B9CFC",
            "#3742fa",
          ],
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    }
  }

  const transactionHistoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Amount ($)",
          font: {
            family: "'Inter', sans-serif",
            size: 16,
            weight: 500,
          },
          color: "#6b7280",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          callback: (value) => "$" + value.toLocaleString(),
          color: "#6b7280",
          font: {
            family: "'Inter', sans-serif",
            size: 14,
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
          drawBorder: false,
        },
        title: {
          display: true,
          text: "Count",
          font: {
            family: "'Inter', sans-serif",
            size: 16,
            weight: 500,
          },
          color: "#6b7280",
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "'Inter', sans-serif",
            size: 14,
          },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "'Inter', sans-serif",
            size: 14,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        position: "top",
        align: "end",
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 15,
          font: {
            family: "'Inter', sans-serif",
            size: 14,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || ""
            const value = context.raw
            if (label === "Transaction Amount") {
              return `${label}: $${value.toLocaleString()}`
            }
            return `${label}: ${value}`
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
      },
    },
  }

  const amountDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const value = context.raw
            return `Transactions: ${value}`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "'Inter', sans-serif",
            size: 14,
          },
          stepSize: 1,
        },
        title: {
          display: true,
          text: "Number of Transactions",
          font: {
            family: "'Inter', sans-serif",
            size: 16,
            weight: 500,
          },
          color: "#6b7280",
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "'Inter', sans-serif",
            size: 14,
          },
        },
      },
    },
    borderRadius: 6,
    barPercentage: 0.7,
    categoryPercentage: 0.8,
  }

  const calculateMetrics = () => {
    if (!userTransactions.length) return { total: 0, average: 0, flagRate: 0 }

    const total = userTransactions.reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
    const average = total / userTransactions.length
    const flagged = userTransactions.filter((t) => t.status === "flagged").length
    const flagRate = (flagged / userTransactions.length) * 100

    return {
      total: total.toFixed(2),
      average: average.toFixed(2),
      flagRate: flagRate.toFixed(1),
    }
  }

  const metrics = calculateMetrics()

  const getSelectedUserName = () => {
    if (!selectedUser) return "Select User"
    const user = users.find((u) => u.id === selectedUser)
    return user ? `${user.name} (${user.id})` : selectedUser
  }

  const getSelectedTimeRangeText = () => {
    switch (timeRange) {
      case "7":
        return "Last 7 Days"
      case "30":
        return "Last 30 Days"
      case "90":
        return "Last 90 Days"
      case "180":
        return "Last 180 Days"
      default:
        return "Select Time Range"
    }
  }

  return (
    <div className="user-behavior">
      <div className="controls">
        <div className="select-group">
          <label htmlFor="user-select">Select User:</label>

          {/* Custom Select Component */}
          <div className="custom-select">
            <div className="selected" data-default="Select User" data-selected={getSelectedUserName()}>
              <ChevronDown className="arrow" />
            </div>
            <div className="options">
              {users.map((user, index) => (
                <div key={user.id} title={user.id}>
                  <input
                    id={`user-${user.id}`}
                    name="user-option"
                    type="radio"
                    checked={selectedUser === user.id}
                    onChange={() => handleUserChange(user.id)}
                  />
                  <label
                    className="option"
                    htmlFor={`user-${user.id}`}
                    data-txt={`${user.name} (${user.id})`}
                    onClick={() => handleUserChange(user.id)}
                  ></label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="select-group">
          <label htmlFor="time-range">Time Range:</label>
          <div className="custom-select time-select">
            <div
              className="selected"
              data-default="Select Time Range"
              data-seven="Last 7 Days"
              data-thirty="Last 30 Days"
              data-ninety="Last 90 Days"
              data-oneEighty="Last 180 Days"
              data-selected={getSelectedTimeRangeText()}
            >
              <ChevronDown className="arrow" />
            </div>
            <div className="options">
              <div title="7-days">
                <input
                  id="days-7"
                  name="time-option"
                  type="radio"
                  checked={timeRange === "7"}
                  onChange={() => setTimeRange("7")}
                />
                <label className="option" htmlFor="days-7" data-txt="Last 7 Days"></label>
              </div>
              <div title="30-days">
                <input
                  id="days-30"
                  name="time-option"
                  type="radio"
                  checked={timeRange === "30"}
                  onChange={() => setTimeRange("30")}
                />
                <label className="option" htmlFor="days-30" data-txt="Last 30 Days"></label>
              </div>
              <div title="90-days">
                <input
                  id="days-90"
                  name="time-option"
                  type="radio"
                  checked={timeRange === "90"}
                  onChange={() => setTimeRange("90")}
                />
                <label className="option" htmlFor="days-90" data-txt="Last 90 Days"></label>
              </div>
              <div title="180-days">
                <input
                  id="days-180"
                  name="time-option"
                  type="radio"
                  checked={timeRange === "180"}
                  onChange={() => setTimeRange("180")}
                />
                <label className="option" htmlFor="days-180" data-txt="Last 180 Days"></label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading user data...</div>
      ) : selectedUser ? (
        <div className="analysis-content">
          {userTransactions.length > 0 ? (
            <>
              <div className="stats-cards">
                <div className="card">
                  <h3>Total Transactions</h3>
                  <p className="stat">{userTransactions.length}</p>
                </div>
                <div className="card">
                  <h3>Total Amount</h3>
                  <p className="stat">${metrics.total}</p>
                </div>
                <div className="card">
                  <h3>Average Amount</h3>
                  <p className="stat">${metrics.average}</p>
                </div>
                <div className="card">
                  <h3>Flag Rate</h3>
                  <p className="stat">{metrics.flagRate}%</p>
                </div>
              </div>

              <div className="charts-row">
                <div className="chart-container modern-chart history-chart">
                  <h3>Transaction History</h3>
                  <div className="chart" style={{ height: "500px" }}>
                    <Line data={prepareTransactionHistoryData()} options={transactionHistoryOptions} />
                  </div>
                </div>

                <div className="chart-container modern-chart amount-chart">
                  <h3>Transaction Amount Distribution</h3>
                  <div className="chart" style={{ height: "500px" }}>
                    <Bar data={prepareAmountDistributionData()} options={amountDistributionOptions} />
                  </div>
                </div>
              </div>

              <div className="transaction-list">
                <h3>Recent Transactions</h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr className="table-header-userbehavior">
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Receiver</th>
                        <th>Status</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTransactions.slice(0, 10).map((transaction) => (
                        <tr key={transaction.id} className={transaction.status === "flagged" ? "flagged" : ""}>
                          <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                          <td>${Number.parseFloat(transaction.amount).toFixed(2)}</td>
                          <td>{transaction.receiver_id}</td>
                          <td>{transaction.status}</td>
                          <td>{transaction.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="no-data">
              <p>No transactions found for this user in the selected time range.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="no-selection">
          <p>Please select a user to view their behavior analysis.</p>
        </div>
      )}
    </div>
  )
}

export default UserBehaviorAnalysis



