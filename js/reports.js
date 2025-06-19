// Initialize charts
function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
            datasets: [{
                label: 'المبيعات',
                data: [30000, 45000, 60000, 55000, 70000, 65000],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });

    // Products Chart
    const productsCtx = document.getElementById('productsChart').getContext('2d');
    new Chart(productsCtx, {
        type: 'doughnut',
        data: {
            labels: ['إلكترونيات', 'ملابس', 'مواد غذائية', 'أخرى'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// Generate report based on filters
function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Here you would typically make an API call to get the report data
    // For demo purposes, we'll just update the table with static data
    updateReportTable();
}

// Update report table
function updateReportTable() {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    // Sample data - in a real application, this would come from your backend
    const reportData = [
        {
            date: '2024-03-20',
            product: 'منتج 1',
            quantity: 100,
            price: 500,
            total: 50000,
            status: 'مكتمل'
        },
        {
            date: '2024-03-19',
            product: 'منتج 2',
            quantity: 50,
            price: 200,
            total: 10000,
            status: 'مكتمل'
        }
    ];

    reportData.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.date}</td>
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>${item.price} ريال</td>
            <td>${item.total} ريال</td>
            <td><span class="badge bg-success">${item.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Export report to Excel
function exportReport() {
    // Here you would typically generate and download an Excel file
    // For demo purposes, we'll just show an alert
    alert('جاري تصدير التقرير إلى Excel...');
}

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    updateReportTable();
}); 