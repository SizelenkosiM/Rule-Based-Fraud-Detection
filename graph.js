  // Sample transaction data
  const transactions = [
    { date: '2025-01-15', amount: 12000 },
    { date: '2025-01-30', amount: 11000 },
    { date: '2025-02-10', amount: 8000 },
    { date: '2025-02-25', amount: 13500 },
    { date: '2025-03-05', amount: 9800 },
    { date: '2025-03-22', amount: 15000 },
    { date: '2025-04-12', amount: 19000 },
    { date: '2025-04-27', amount: 21000 },
    { date: '2025-05-15', amount: 7200 },
    { date: '2025-05-30', amount: 16500 },
    { date: '2025-06-08', amount: 11500 },
    { date: '2025-06-21', amount: 6000 },
    { date: '2025-07-04', amount: 10000 },
    { date: '2025-07-19', amount: 12000 },
    { date: '2025-08-11', amount: 9500 },
    { date: '2025-08-28', amount: 13000 },
    { date: '2025-09-03', amount: 16000 },
    { date: '2025-09-16', amount: 22000 },
    { date: '2025-10-05', amount: 18500 },
    { date: '2025-10-23', amount: 10500 },
    { date: '2025-11-09', amount: 12500 },
    { date: '2025-11-25', amount: 14000 },
    { date: '2025-12-02', amount: 18000 },
    { date: '2025-12-18', amount: 9700 },
    { date: '2025-12-31', amount: 15500 }
];





// Function to process transactions and prepare data for the chart
function processTransactions(transactions) {
    const monthlyFraud = {
        Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
        Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
    };

    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const month = date.toLocaleString('default', { month: 'short' });

        if (transaction.amount > 10000) {
            monthlyFraud[month] += transaction.amount;
        }
    });

    const labels = Object.keys(monthlyFraud);
    const data = Object.values(monthlyFraud);

    return { labels, data };
}

const { labels, data } = processTransactions(transactions);

// Create the line chart
const ctx = document.getElementById('fraudChart').getContext('2d');
const fraudChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Fraud Amount',
            data: data,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Months'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Amount'
                }
            }
        }
    }
});
