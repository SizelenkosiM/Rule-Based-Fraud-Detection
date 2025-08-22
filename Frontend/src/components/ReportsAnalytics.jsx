"use client"

import { useState, useEffect, useRef } from "react"
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { Calendar, ChevronDown, Download, Printer, RefreshCw } from "lucide-react"
import "./ReportsAnalytics.css"

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

function ReportsAnalytics() {
  const [transactions, setTransactions] = useState([])
  const [alerts, setAlerts] = useState([])
  const [timeRange, setTimeRange] = useState("30")
  const [reportType, setReportType] = useState("fraud")
  const [isLoading, setIsLoading] = useState(true)
  const [reportDate, setReportDate] = useState(new Date().toLocaleDateString())

  const fraudTrendRef = useRef(null)
  const ruleTriggerRef = useRef(null)
  const transactionStatusRef = useRef(null)
  const geographicDistRef = useRef(null)
  const reportContainerRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const apiUrl = process.env.REACT_APP_API_URL;

        const trans = await fetch(`${apiUrl}/api/transactions`).then((res) => res.json())
        const alertsData = await fetch(`${apiUrl}/api/alerts`).then((res) => res.json())

        const filteredData = filterDataByTimeRange(trans, alertsData, timeRange)

        setTransactions(filteredData.transactions)
        setAlerts(filteredData.alerts)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  const filterDataByTimeRange = (trans, alertsData, range) => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(range))

    const filteredTransactions = trans.filter((t) => {
      const date = new Date(t.transaction_date)
      return date >= startDate && date <= endDate
    })

    const filteredAlerts = alertsData.filter((a) => {
      const date = new Date(a.alert_date)
      return date >= startDate && date <= endDate
    })

    return { transactions: filteredTransactions, alerts: filteredAlerts }
  }

  const calculateMetrics = () => {
    const flagged = transactions.filter((t) => t.status === "flagged")
    const completed = transactions.filter((t) => t.status === "completed")

    const totalAmount = transactions.reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)
    const flaggedAmount = flagged.reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

    const alertsByRule = alerts.reduce((acc, a) => {
      acc[a.rule_triggered] = (acc[a.rule_triggered] || 0) + 1
      return acc
    }, {})

    const mostTriggeredRule = Object.entries(alertsByRule).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"

    const transactionsByDay = transactions.reduce((acc, t) => {
      const date = new Date(t.transaction_date).toLocaleDateString()
      if (!acc[date]) acc[date] = []
      acc[date].push(t)
      return acc
    }, {})

    const uniqueDays = Object.keys(transactionsByDay).length
    const dailyAvgTransactions = uniqueDays ? (transactions.length / uniqueDays).toFixed(1) : 0

    const fraudRateByDay = Object.entries(transactionsByDay).map(([date, txs]) => {
      const flaggedCount = txs.filter((t) => t.status === "flagged").length
      return {
        date,
        rate: txs.length ? (flaggedCount / txs.length) * 100 : 0,
      }
    })

    fraudRateByDay.sort((a, b) => new Date(a.date) - new Date(b.date))

    const avgFraudRate = transactions.length ? ((flagged.length / transactions.length) * 100).toFixed(2) : 0

    return {
      totalTransactions: transactions.length,
      flaggedTransactions: flagged.length,
      completedTransactions: completed.length,
      totalAmount: totalAmount.toFixed(2),
      flaggedAmount: flaggedAmount.toFixed(2),
      flaggedPercentage: transactions.length ? ((flagged.length / transactions.length) * 100).toFixed(2) : 0,
      alertCount: alerts.length,
      alertsByRule,
      mostTriggeredRule,
      dailyAvgTransactions,
      fraudRateByDay,
      avgFraudRate,
    }
  }

  const metrics = calculateMetrics()

  const formatRuleName = (ruleName) => {
    switch (ruleName) {
      case "single_transaction_limit":
        return "Single Transaction Limit"
      case "monthly_cumulative_limit":
        return "Monthly Cumulative Limit"
      case "dormant_account_activation":
        return "Dormant Account Activation"
      default:
        return ruleName
    }
  }

  const prepareFraudTrendsData = () => {
    const transactionsByDate = {}

    transactions.forEach((t) => {
      const date = new Date(t.transaction_date).toLocaleDateString()
      if (!transactionsByDate[date]) {
        transactionsByDate[date] = {
          total: 0,
          flagged: 0,
          safe: 0,
        }
      }

      const amount = Number.parseFloat(t.amount)
      transactionsByDate[date].total += amount

      if (t.status === "flagged") {
        transactionsByDate[date].flagged += amount
      } else {
        transactionsByDate[date].safe += amount
      }
    })

    const sortedDates = Object.keys(transactionsByDate).sort((a, b) => new Date(a) - new Date(b))

    return {
      labels: sortedDates,
      datasets: [
        {
          label: "Flagged Amount",
          data: sortedDates.map((date) => transactionsByDate[date].flagged),
          borderColor: "#e63946",
          backgroundColor: "rgba(230, 57, 70, 0.2)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: "Safe Amount",
          data: sortedDates.map((date) => transactionsByDate[date].safe),
          borderColor: "#2ecc71",
          backgroundColor: "rgba(46, 204, 113, 0.2)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    }
  }

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => "$" + value.toLocaleString(),
        },
      },
    },
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
      },
    },
  }

  const fraudRateOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => `Fraud Rate: ${context.parsed.y.toFixed(2)}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Fraud Rate (%)",
        },
      },
    },
  }

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    doc.setFillColor(0, 0, 128)
    doc.rect(0, 0, 210, 20, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Fraud Detection System - Analytics Report", 105, 12, { align: "center" })

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Report Date: ${reportDate}`, 20, 30)
    doc.text(`Time Period: ${getTimeRangeText()}`, 20, 35)
    doc.text(`Report Type: ${reportType === "fraud" ? "Fraud Analysis" : "Transaction Analysis"}`, 20, 40)
    doc.text(`Generated by: Admin User`, 20, 45)

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Executive Summary", 20, 55)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(
      `This report provides an analysis of transaction data and fraud detection for the selected time period. ` +
        `During this period, there were ${metrics.totalTransactions} transactions processed, with ` +
        `${metrics.flaggedTransactions} (${metrics.flaggedPercentage}%) flagged as potentially fraudulent. ` +
        `The total transaction volume was $${Number(metrics.totalAmount).toLocaleString()}, with ` +
        `$${Number(metrics.flaggedAmount).toLocaleString()} in flagged transactions.`,
      20,
      65,
      { maxWidth: 170 },
    )

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Key Metrics", 20, 85)

    autoTable(doc, {
      startY: 90,
      head: [["Metric", "Value"]],
      body: [
        ["Total Transactions", metrics.totalTransactions],
        ["Flagged Transactions", metrics.flaggedTransactions],
        ["Flagged Rate", `${metrics.flaggedPercentage}%`],
        ["Total Transaction Volume", `$${Number(metrics.totalAmount).toLocaleString()}`],
        ["Flagged Transaction Volume", `$${Number(metrics.flaggedAmount).toLocaleString()}`],
        ["Daily Average Transactions", metrics.dailyAvgTransactions],
        ["Average Fraud Rate", `${metrics.avgFraudRate}%`],
        ["Total Alerts Generated", metrics.alertCount],
        ["Most Triggered Rule", formatRuleName(metrics.mostTriggeredRule)],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [0, 0, 128],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    })

    let currentY = doc.lastAutoTable.finalY + 15

    if (currentY > 220) {
      doc.addPage()
      currentY = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Fraud Trends Analysis", 20, currentY)

    if (fraudTrendRef.current) {
      const fraudChartImg = fraudTrendRef.current.toBase64Image()
      doc.addImage(fraudChartImg, "PNG", 20, currentY + 5, 170, 70)
      currentY += 80
    }

    if (currentY > 220) {
      doc.addPage()
      currentY = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Transaction Status Distribution", 20, currentY)

    if (transactionStatusRef.current) {
      const statusChartImg = transactionStatusRef.current.toBase64Image()
      doc.addImage(statusChartImg, "PNG", 20, currentY + 5, 80, 80)

      if (ruleTriggerRef.current) {
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("Alert Rule Distribution", 110, currentY)

        const ruleChartImg = ruleTriggerRef.current.toBase64Image()
        doc.addImage(ruleChartImg, "PNG", 110, currentY + 5, 80, 80)
      }

      currentY += 90
    }

    if (currentY > 220) {
      doc.addPage()
      currentY = 20
    }

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Recent Alerts", 20, currentY)

    const alertsTableData = alerts
      .slice(0, 10)
      .map((alert) => [
        new Date(alert.alert_date).toLocaleDateString(),
        alert.transaction_id,
        formatRuleName(alert.rule_triggered),
        `$${Number(alert.amount).toLocaleString()}`,
      ])

    autoTable(doc, {
      startY: currentY + 5,
      head: [["Date", "Transaction ID", "Rule Triggered", "Amount"]],
      body: alertsTableData,
      theme: "grid",
      headStyles: {
        fillColor: [0, 0, 128],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    })

    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text(`Fraud Detection System - Confidential | Page ${i} of ${pageCount}`, 105, 285, { align: "center" })
    }

    doc.save("fraud_detection_report.pdf")
  }

  const getTimeRangeText = () => {
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
        return "Last 30 Days"
    }
  }

  const handleTimeRangeChange = (range) => {
    setTimeRange(range)
  }

  const handleReportTypeChange = (type) => {
    setReportType(type)
  }

  const refreshReport = () => {
    setIsLoading(true)
    fetch(`${apiUrl}/api/transactions`)
      .then((res) => res.json())
      .then((trans) => {
        fetch(`${apiUrl}/api/alerts`)
          .then((res) => res.json())
          .then((alertsData) => {
            const filteredData = filterDataByTimeRange(trans, alertsData, timeRange)
            setTransactions(filteredData.transactions)
            setAlerts(filteredData.alerts)
            setReportDate(new Date().toLocaleDateString())
            setIsLoading(false)
          })
      })
      .catch((error) => {
        console.error("Error refreshing data:", error)
        setIsLoading(false)
      })
  }

  return (
    <div className="reports-analytics" ref={reportContainerRef}>
      <div className="report-header">
        <div className="report-title">
          <h2>Fraud Detection Analytics Report</h2>
          <p className="report-subtitle">Comprehensive analysis of transaction patterns and fraud indicators</p>
        </div>

        <div className="report-controls">
          <div className="report-control-group">
            <div className="report-date">
              <Calendar size={16} />
              <span>{reportDate}</span>
            </div>

            <div className="report-time-range">
              <div className="custom-select">
                <div className="selected" data-selected={getTimeRangeText()}>
                  <ChevronDown className="arrow" />
                </div>
                <div className="options">
                  <div>
                    <input
                      id="time-7"
                      name="time-option"
                      type="radio"
                      checked={timeRange === "7"}
                      onChange={() => handleTimeRangeChange("7")}
                    />
                    <label className="option" htmlFor="time-7" data-txt="Last 7 Days"></label>
                  </div>
                  <div>
                    <input
                      id="time-30"
                      name="time-option"
                      type="radio"
                      checked={timeRange === "30"}
                      onChange={() => handleTimeRangeChange("30")}
                    />
                    <label className="option" htmlFor="time-30" data-txt="Last 30 Days"></label>
                  </div>
                  <div>
                    <input
                      id="time-90"
                      name="time-option"
                      type="radio"
                      checked={timeRange === "90"}
                      onChange={() => handleTimeRangeChange("90")}
                    />
                    <label className="option" htmlFor="time-90" data-txt="Last 90 Days"></label>
                  </div>
                  <div>
                    <input
                      id="time-180"
                      name="time-option"
                      type="radio"
                      checked={timeRange === "180"}
                      onChange={() => handleTimeRangeChange("180")}
                    />
                    <label className="option" htmlFor="time-180" data-txt="Last 180 Days"></label>
                  </div>
                </div>
              </div>
            </div>

            <div className="report-type">
              <div className="custom-select">
                <div
                  className="selected"
                  data-selected={reportType === "fraud" ? "Fraud Analysis" : "Transaction Analysis"}
                >
                  <ChevronDown className="arrow" />
                </div>
                <div className="options">
                  <div>
                    <input
                      id="type-fraud"
                      name="type-option"
                      type="radio"
                      checked={reportType === "fraud"}
                      onChange={() => handleReportTypeChange("fraud")}
                    />
                    <label className="option" htmlFor="type-fraud" data-txt="Fraud Analysis"></label>
                  </div>
                  <div>
                    <input
                      id="type-transaction"
                      name="type-option"
                      type="radio"
                      checked={reportType === "transaction"}
                      onChange={() => handleReportTypeChange("transaction")}
                    />
                    <label className="option" htmlFor="type-transaction" data-txt="Transaction Analysis"></label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="report-actions">
            <button className="report-action-btn refresh-btn" onClick={refreshReport}>
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
            <button className="report-action-btn download-btn" onClick={downloadPDF}>
              <Download size={16} />
              <span>Download PDF</span>
            </button>

          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="report-loading">
          <div className="loading-spinner"></div>
          <p>Generating report...</p>
        </div>
      ) : (
        <div className="report-content">
          <section className="report-section executive-summary">
            <h3 className="section-title">Executive Summary</h3>
            <div className="summary-content">
              <p>
                This report provides a comprehensive analysis of transaction data and fraud detection metrics for the
                selected time period. During this period, the system processed a total of
                <strong> {metrics.totalTransactions} transactions</strong>, with{" "}
                <strong>
                  {metrics.flaggedTransactions} ({metrics.flaggedPercentage}%)
                </strong>{" "}
                flagged as potentially fraudulent.
              </p>
              <p>
                The total transaction volume was <strong>${Number(metrics.totalAmount).toLocaleString()}</strong>, with
                <strong> ${Number(metrics.flaggedAmount).toLocaleString()}</strong> in flagged transactions. The system
                generated
                <strong> {metrics.alertCount} alerts</strong> based on predefined rules, with the most frequently
                triggered rule being
                <strong> "{formatRuleName(metrics.mostTriggeredRule)}"</strong>.
              </p>
            </div>
          </section>

          <section className="report-section key-metrics">
            <h3 className="section-title">Key Performance Indicators</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <h4>Total Transactions</h4>
                <div className="metric-value">{metrics.totalTransactions}</div>
                <div className="metric-label">Processed transactions</div>
              </div>

              <div className="metric-card">
                <h4>Flagged Transactions</h4>
                <div className="metric-value">{metrics.flaggedTransactions}</div>
                <div className="metric-label">{metrics.flaggedPercentage}% of total</div>
              </div>

              <div className="metric-card">
                <h4>Transaction Volume</h4>
                <div className="metric-value">${Number(metrics.totalAmount).toLocaleString()}</div>
                <div className="metric-label">Total processed amount</div>
              </div>

              <div className="metric-card">
                <h4>Flagged Amount</h4>
                <div className="metric-value">${Number(metrics.flaggedAmount).toLocaleString()}</div>
                <div className="metric-label">
                  {((metrics.flaggedAmount / metrics.totalAmount) * 100).toFixed(2)}% of volume
                </div>
              </div>

              <div className="metric-card">
                <h4>Daily Average</h4>
                <div className="metric-value">{metrics.dailyAvgTransactions}</div>
                <div className="metric-label">Transactions per day</div>
              </div>

              <div className="metric-card">
                <h4>Alert Count</h4>
                <div className="metric-value">{metrics.alertCount}</div>
                <div className="metric-label">Total alerts generated</div>
              </div>
            </div>
          </section>

          <section className="report-section fraud-trends">
            <h3 className="section-title">Fraud Trends Analysis</h3>
            <div className="chart-container large">
              <h4>Transaction Amount by Status Over Time</h4>
              <div className="chart-wrapper">
                <Line ref={fraudTrendRef} data={prepareFraudTrendsData()} options={lineChartOptions} height={300} />
              </div>
            </div>
          </section>

          <section className="report-section detailed-alerts">
            <h3 className="section-title">Recent Alerts</h3>
            <div className="table-container">
              <table className="report-table">
                <thead>
                  <tr className="table-header-userbehavior">
                    <th>Date</th>
                    <th>Transaction ID</th>
                    <th>Rule Triggered</th>
                    <th>Amount</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.slice(0, 10).map((alert) => (
                    <tr key={alert.id}>
                      <td>{new Date(alert.alert_date).toLocaleDateString()}</td>
                      <td>{alert.transaction_id}</td>
                      <td>{formatRuleName(alert.rule_triggered)}</td>
                      <td>${Number(alert.amount).toFixed(2)}</td>
                      <td>{alert.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="report-section recommendations">
            <h3 className="section-title">Recommendations & Insights</h3>
            <div className="recommendations-content">
              <div className="recommendation-item">
                <h4>Fraud Pattern Analysis</h4>
                <p>
                  Based on the data analysis, we've identified that the "{formatRuleName(metrics.mostTriggeredRule)}"
                  rule is triggered most frequently. We recommend reviewing this rule's parameters to ensure it's
                  properly calibrated to minimize false positives while maintaining effective fraud detection.
                </p>
              </div>

              <div className="recommendation-item">
                <h4>Transaction Monitoring</h4>
                <p>
                  The current fraud rate of {metrics.avgFraudRate}%{" "}
                  {Number.parseFloat(metrics.avgFraudRate) > 5
                    ? "is above industry average. Consider implementing additional verification steps for high-risk transactions."
                    : "is within acceptable industry standards, but continuous monitoring is recommended."}
                </p>
              </div>

              <div className="recommendation-item">
                <h4>System Performance</h4>
                <p>
                  The system is processing an average of {metrics.dailyAvgTransactions} transactions per day.
                  {Number.parseFloat(metrics.dailyAvgTransactions) > 100
                    ? "This high volume suggests that regular performance optimization may be beneficial to maintain response times."
                    : "This volume is well within system capacity, but scaling plans should be considered for future growth."}
                </p>
              </div>
            </div>
          </section>

          <section className="report-section conclusion">
            <h3 className="section-title">Conclusion</h3>
            <p>
              This report provides a comprehensive overview of the fraud detection system's performance during the
              selected time period. The data indicates that the system is{" "}
              {Number.parseFloat(metrics.flaggedPercentage) < 10 ? "effectively" : "potentially over-aggressively"}{" "}
              identifying suspicious transactions, with a flagging rate of {metrics.flaggedPercentage}%.
            </p>
            <p>
              Continuous monitoring and rule refinement are recommended to maintain optimal system performance and
              minimize both false positives and false negatives in fraud detection.
            </p>
          </section>
        </div>
      )}
    </div>
  )
}

export default ReportsAnalytics