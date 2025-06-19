// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
}

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
});

// Check authentication on page load
checkAuth();

// Update dashboard data
function updateDashboardData() {
    // Here you would typically fetch data from your backend
    // For demo purposes, we'll use static data
    const stats = {
        totalProducts: 1234,
        lowStock: 23,
        dailySales: 45,
        totalValue: 50000
    };

    // Update statistics
    document.querySelector('.dashboard-card:nth-child(1) h3').textContent = stats.totalProducts.toLocaleString();
    document.querySelector('.dashboard-card:nth-child(2) h3').textContent = stats.lowStock;
    document.querySelector('.dashboard-card:nth-child(3) h3').textContent = stats.dailySales;
    document.querySelector('.dashboard-card:nth-child(4) h3').textContent = `${stats.totalValue.toLocaleString()} ريال`;
}

// Initialize dashboard
updateDashboardData(); 