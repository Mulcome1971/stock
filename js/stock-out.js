// Stock out management
const stockOutRecords = [
    {
        date: '2024-03-20',
        invoiceNumber: 'OUT-001',
        customer: 'عميل 1',
        product: 'منتج 1',
        quantity: 50,
        price: 600,
        total: 30000,
        status: 'مكتمل'
    },
    {
        date: '2024-03-19',
        invoiceNumber: 'OUT-002',
        customer: 'عميل 2',
        product: 'منتج 2',
        quantity: 25,
        price: 250,
        total: 6250,
        status: 'مكتمل'
    }
];

// Handle form submission
document.getElementById('stockOutForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newRecord = {
        date: formData.get('date'),
        invoiceNumber: formData.get('invoiceNumber'),
        customer: formData.get('customer'),
        product: formData.get('product'),
        quantity: parseInt(formData.get('quantity')),
        price: parseFloat(formData.get('price')),
        total: parseInt(formData.get('quantity')) * parseFloat(formData.get('price')),
        status: 'مكتمل'
    };

    stockOutRecords.unshift(newRecord);
    updateStockOutTable();
    
    // Reset form
    e.target.reset();
});

// Update stock out table
function updateStockOutTable() {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    stockOutRecords.forEach(record => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${record.date}</td>
            <td>${record.invoiceNumber}</td>
            <td>${record.customer}</td>
            <td>${record.product}</td>
            <td>${record.quantity}</td>
            <td>${record.price} ريال</td>
            <td>${record.total} ريال</td>
            <td><span class="badge bg-success">${record.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Calculate total
function calculateTotal(quantity, price) {
    return quantity * price;
}

// Update total when quantity or price changes
document.querySelector('input[name="quantity"]').addEventListener('input', updateTotal);
document.querySelector('input[name="price"]').addEventListener('input', updateTotal);

function updateTotal() {
    const quantity = document.querySelector('input[name="quantity"]').value;
    const price = document.querySelector('input[name="price"]').value;
    const total = calculateTotal(quantity, price);
    document.querySelector('input[name="total"]').value = total;
}

// Check stock availability
document.querySelector('select[name="product"]').addEventListener('change', function(e) {
    const productId = e.target.value;
    // Here you would typically check the available stock for the selected product
    // For demo purposes, we'll just show an alert
    alert('المنتج متوفر في المخزون');
});

// Initialize table
updateStockOutTable();

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const currentDate = new Date().toLocaleDateString('fr-FR');
    document.getElementById('currentDate').textContent = currentDate;

    // Generate bon number
    generateBonNumber();

    // Add event listeners for calculations
    setupCalculationListeners();
});

// Generate unique bon number
function generateBonNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const bonNumber = `BS-${year}${month}${day}-${random}`;
    document.getElementById('bonNumber').textContent = bonNumber;
}

// Add new item row
function addItem() {
    const tbody = document.getElementById('itemsTable');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>
            <select class="form-select" required>
                <option value="">Sélectionner</option>
                <option value="1">Article 1</option>
                <option value="2">Article 2</option>
            </select>
        </td>
        <td><input type="text" class="form-control"></td>
        <td><input type="number" class="form-control quantity" required></td>
        <td><input type="number" class="form-control price" required></td>
        <td><input type="number" class="form-control total" readonly></td>
    `;
    tbody.appendChild(newRow);
    setupCalculationListeners();
}

// Setup calculation listeners
function setupCalculationListeners() {
    const rows = document.querySelectorAll('#itemsTable tr');
    rows.forEach(row => {
        const quantityInput = row.querySelector('.quantity');
        const priceInput = row.querySelector('.price');
        const totalInput = row.querySelector('.total');

        [quantityInput, priceInput].forEach(input => {
            input.addEventListener('input', () => {
                calculateRowTotal(row);
                calculateTotals();
            });
        });
    });
}

// Calculate row total
function calculateRowTotal(row) {
    const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
    const price = parseFloat(row.querySelector('.price').value) || 0;
    const total = quantity * price;
    row.querySelector('.total').value = total.toFixed(2);
}

// Calculate all totals
function calculateTotals() {
    let totalHT = 0;
    document.querySelectorAll('#itemsTable tr').forEach(row => {
        totalHT += parseFloat(row.querySelector('.total').value) || 0;
    });

    const tva = totalHT * 0.20;
    const totalTTC = totalHT + tva;

    document.getElementById('totalHT').value = totalHT.toFixed(2);
    document.getElementById('tva').value = tva.toFixed(2);
    document.getElementById('totalTTC').value = totalTTC.toFixed(2);
}

// Print bon de sortie
function printBonSortie() {
    const printContent = document.getElementById('bonSortieForm').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
        <div class="container mt-4">
            <div class="text-center mb-4">
                <h2>Bon de Sortie</h2>
            </div>
            ${printContent}
        </div>
    `;

    window.print();
    document.body.innerHTML = originalContent;
    setupCalculationListeners();
}

// Form submission
document.querySelector('#bonSortieForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        bonNumber: document.getElementById('bonNumber').textContent,
        date: document.getElementById('currentDate').textContent,
        client: document.querySelector('select[name="client"]').value,
        commandeNumber: document.querySelector('input[name="commandeNumber"]').value,
        dateLivraison: document.querySelector('input[name="dateLivraison"]').value,
        modeTransport: document.querySelector('select[name="modeTransport"]').value,
        items: Array.from(document.querySelectorAll('#itemsTable tr')).map(row => ({
            article: row.querySelector('select').value,
            description: row.querySelector('input[type="text"]').value,
            quantity: row.querySelector('.quantity').value,
            price: row.querySelector('.price').value,
            total: row.querySelector('.total').value
        })),
        totalHT: document.getElementById('totalHT').value,
        tva: document.getElementById('tva').value,
        totalTTC: document.getElementById('totalTTC').value,
        observations: document.querySelector('textarea').value
    };

    // Here you would typically send the data to your backend
    console.log('Form data:', formData);
    alert('Bon de sortie enregistré avec succès!');
}); 