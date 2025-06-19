// Product management functions
const products = [
    {
        id: 1,
        name: 'منتج 1',
        category: 'إلكترونيات',
        quantity: 100,
        price: 500,
        status: 'متوفر'
    },
    {
        id: 2,
        name: 'منتج 2',
        category: 'ملابس',
        quantity: 50,
        price: 200,
        status: 'منخفض'
    }
];

// Add new product
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newProduct = {
        id: products.length + 1,
        name: formData.get('name'),
        category: formData.get('category'),
        quantity: parseInt(formData.get('quantity')),
        price: parseFloat(formData.get('price')),
        status: parseInt(formData.get('quantity')) > 50 ? 'متوفر' : 'منخفض'
    };

    products.push(newProduct);
    updateProductsTable();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
    modal.hide();
});

// Update products table
function updateProductsTable() {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.quantity}</td>
            <td>${product.price} ريال</td>
            <td><span class="badge bg-${product.status === 'متوفر' ? 'success' : 'warning'}">${product.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        // Populate form with product data
        const form = document.getElementById('addProductForm');
        form.elements['name'].value = product.name;
        form.elements['category'].value = product.category;
        form.elements['quantity'].value = product.quantity;
        form.elements['price'].value = product.price;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
        modal.show();
    }
}

// Delete product
function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            updateProductsTable();
        }
    }
}

// Search functionality
document.querySelector('input[type="text"]').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    updateProductsTable(filteredProducts);
});

// Initialize table
updateProductsTable(); 