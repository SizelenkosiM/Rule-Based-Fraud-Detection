"use client"

import { useState, useEffect } from "react"

function AlertsList() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = () => {
    fetch("http://localhost:5000/api/alerts")
      .then((response) => response.json())
      .then((data) => {
        setAlerts(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching alerts:", error)
        setLoading(false)
      })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

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
  

  return (
    <div className="alerts-list">
      
      {loading ? (
        <p>Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p>No alerts found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Transaction ID</th>
                <th>Rule Triggered</th>
                <th>Amount</th>
                <th>Description</th>
                
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.id}</td>
                  <td>{formatDate(alert.alert_date)}</td>
                  <td>{alert.transaction_id}</td>
                  <td>{formatRuleName(alert.rule_triggered)}</td>
                  <td>${Number.parseFloat(alert.amount).toFixed(2)}</td>
                  <td>{alert.description}</td>
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AlertsList




