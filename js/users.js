// User management
const users = [
    {
        name: 'أحمد محمد',
        username: 'ahmed',
        email: 'ahmed@example.com',
        role: 'مدير النظام',
        status: 'نشط'
    },
    {
        name: 'محمد علي',
        username: 'mohammed',
        email: 'mohammed@example.com',
        role: 'مدير المخزن',
        status: 'نشط'
    }
];

// Handle form submission
document.getElementById('addUserForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newUser = {
        name: formData.get('name'),
        username: formData.get('username'),
        email: formData.get('email'),
        role: formData.get('role'),
        status: 'نشط'
    };

    users.push(newUser);
    updateUsersTable();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    modal.hide();
});

// Update users table
function updateUsersTable() {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.name}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="badge bg-success">${user.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editUser('${user.username}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.username}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Edit user
function editUser(username) {
    const user = users.find(u => u.username === username);
    if (user) {
        // Populate form with user data
        const form = document.getElementById('addUserForm');
        form.elements['name'].value = user.name;
        form.elements['username'].value = user.username;
        form.elements['email'].value = user.email;
        form.elements['role'].value = user.role;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
        modal.show();
    }
}

// Delete user
function deleteUser(username) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        const index = users.findIndex(u => u.username === username);
        if (index !== -1) {
            users.splice(index, 1);
            updateUsersTable();
        }
    }
}

// Search functionality
document.querySelector('input[type="text"]').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    updateUsersTable(filteredUsers);
});

// Role filter
document.querySelector('select').addEventListener('change', function(e) {
    const role = e.target.value;
    const filteredUsers = role ? users.filter(user => user.role === role) : users;
    updateUsersTable(filteredUsers);
});

// Initialize table
updateUsersTable(); 