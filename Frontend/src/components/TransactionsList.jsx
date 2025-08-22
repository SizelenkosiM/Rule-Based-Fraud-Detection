"use client"

import { useState, useEffect } from "react"

function TransactionsList() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:5000/api/transactions")
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error)
        setLoading(false)
      })
  }, [])

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString)
        return "Invalid date"
      }
      return date.toLocaleString()
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed"
      case "flagged":
        return "status-flagged"
      default:
        return "status-pending"
    }
  }

  return (
    <div className="transactions-list">
      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{formatDate(transaction.transaction_date)}</td>
                  <td>{transaction.sender_id}</td>
                  <td>{transaction.receiver_id}</td>
                  <td>${Number.parseFloat(transaction.amount).toFixed(2)}</td>
                  <td>
                    <span className={`status ${getStatusClass(transaction.status)}`}>{transaction.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TransactionsList
