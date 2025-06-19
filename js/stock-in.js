// Stock in management
const stockInRecords = [
    {
        date: '2024-03-20',
        invoiceNumber: 'INV-001',
        supplier: 'مورد 1',
        product: 'منتج 1',
        quantity: 100,
        price: 500,
        total: 50000,
        status: 'مكتمل'
    },
    {
        date: '2024-03-19',
        invoiceNumber: 'INV-002',
        supplier: 'مورد 2',
        product: 'منتج 2',
        quantity: 50,
        price: 200,
        total: 10000,
        status: 'مكتمل'
    }
];

// Handle form submission
document.getElementById('stockInForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newRecord = {
        date: formData.get('date'),
        invoiceNumber: formData.get('invoiceNumber'),
        supplier: formData.get('supplier'),
        product: formData.get('product'),
        quantity: parseInt(formData.get('quantity')),
        price: parseFloat(formData.get('price')),
        total: parseInt(formData.get('quantity')) * parseFloat(formData.get('price')),
        status: 'مكتمل'
    };

    stockInRecords.unshift(newRecord);
    updateStockInTable();
    
    // Reset form
    e.target.reset();
});

// Update stock in table
function updateStockInTable() {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    stockInRecords.forEach(record => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${record.date}</td>
            <td>${record.invoiceNumber}</td>
            <td>${record.supplier}</td>
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

// Initialize table
updateStockInTable();

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة النموذج
    initializeForm();
    
    // إعداد مستمعي الأحداث
    setupEventListeners();
    
    // ربط حقل Le donnant مع Nom et qualité في Signature Fournisseur
    setupDonnantSignatureLink();
    
    // تطبيق التنسيقات على الصف الأول
    const firstRow = document.querySelector('#itemsTable tr');
    if (firstRow) {
        applyRowStyling(firstRow);
    }
});

function initializeForm() {
    // تعيين التاريخ الحالي
    const today = new Date();
    document.getElementById('currentDate').textContent = today.toLocaleDateString('fr-FR');
    
    // توليد رقم البون
    generateBonNumber();
}

function generateBonNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const bonNumber = `BE-${year}${month}${day}-${random}`;
    document.getElementById('bonNumber').textContent = bonNumber;
}

function setupEventListeners() {
    // مستمع إضافة عنصر جديد
    document.querySelector('button[onclick="addItem()"]').addEventListener('click', addItem);
    
    // مستمع تغيير الكمية والسعر
    document.getElementById('itemsTable').addEventListener('input', function(e) {
        if (e.target.classList.contains('quantity') || e.target.classList.contains('price')) {
            calculateRowTotal(e.target.closest('tr'));
        }
    });
    
    // مستمع تغيير المورد
    document.querySelector('select[name="fournisseur"]').addEventListener('change', function(e) {
        updateFournisseurInfo(e.target.value);
    });
    
    // مستمع تقديم النموذج
    document.getElementById('bonEntreeForm').addEventListener('submit', handleSubmit);
}

function addItem() {
    const tbody = document.getElementById('itemsTable');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="form-control" readonly></td>
        <td>
            <input type="text" class="form-control" placeholder="Entrez le nom de l'article" required>
        </td>
        <td><input type="text" class="form-control"></td>
        <td><input type="number" class="form-control quantity" required></td>
        <td><input type="text" class="form-control price" required></td>
        <td><input type="text" class="form-control total"></td>
        <td class="no-print">
            <button type="button" class="btn btn-danger btn-sm" onclick="removeRow(this)">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    tbody.appendChild(newRow);
    
    // تطبيق التنسيقات على الصف الجديد
    applyRowStyling(newRow);
    
    // إضافة مستمعي الأحداث للصف الجديد
    const quantityInput = newRow.querySelector('.quantity');
    const priceInput = newRow.querySelector('.price');
    quantityInput.addEventListener('input', () => calculateRowTotal(newRow));
    priceInput.addEventListener('input', () => calculateRowTotal(newRow));
    
    // إضافة مستمع لحقل Le donnant لربطه مع التوقيع
    priceInput.addEventListener('input', function(e) {
        const fournisseurNomQualite = document.getElementById('fournisseurNomQualite');
        if (fournisseurNomQualite) {
            fournisseurNomQualite.value = e.target.value;
        }
    });
}

function applyRowStyling(row) {
    // تطبيق التنسيقات على جميع الحقول في الصف
    const inputs = row.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.add('form-control');
        
        // تطبيق تنسيق خاص للحقول المقروءة
        if (input.hasAttribute('readonly')) {
            input.style.backgroundColor = '#f8f9fa';
            input.style.color = '#6c757d';
            input.style.cursor = 'not-allowed';
        }
        
        // تطبيق تنسيق خاص لحقول الأرقام
        if (input.type === 'number') {
            input.style.textAlign = 'center';
        }
    });
    
    // تطبيق تنسيق على الأزرار
    const buttons = row.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.style.transition = 'all 0.3s ease';
    });
}

function removeRow(button) {
    const row = button.closest('tr');
    const tbody = document.getElementById('itemsTable');
    
    // لا تسمح بحذف الصف الأخير
    if (tbody.children.length > 1) {
        row.remove();
        calculateTotals();
    } else {
        alert('Impossible de supprimer la dernière ligne. Au moins une ligne est requise.');
    }
}

function calculateRowTotal(row) {
    const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
    const price = parseFloat(row.querySelector('.price').value) || 0;
    const total = quantity * price;
    row.querySelector('.total').value = total.toFixed(2);
    calculateTotals();
}

function calculateTotals() {
    let totalHT = 0;
    document.querySelectorAll('#itemsTable tr').forEach(row => {
        totalHT += parseFloat(row.querySelector('.total').value) || 0;
    });
    
    const tva = totalHT * 0.20;
    const totalTTC = totalHT + tva;
    
    document.getElementById('totalHT').textContent = totalHT.toFixed(2) + ' €';
    document.getElementById('tva').textContent = tva.toFixed(2) + ' €';
    document.getElementById('totalTTC').textContent = totalTTC.toFixed(2) + ' €';
}

function updateFournisseurInfo(fournisseurId) {
    // هنا يمكن إضافة منطق لتحديث معلومات المورد
    console.log('Fournisseur sélectionné:', fournisseurId);
}

function handleSubmit(e) {
    e.preventDefault();
    
    // جمع بيانات النموذج
    const formData = {
        bonNumber: document.getElementById('bonNumber').textContent,
        date: document.getElementById('currentDate').textContent,
        fournisseur: document.querySelector('select[name="fournisseur"]').value,
        numeroFacture: document.querySelector('input[name="numeroFacture"]').value,
        dateFacture: document.querySelector('input[name="dateFacture"]').value,
        dateLivraison: document.querySelector('input[name="dateLivraison"]').value,
        modeTransport: document.querySelector('select[name="modeTransport"]').value,
        numeroBL: document.querySelector('input[name="numeroBL"]').value,
        items: Array.from(document.querySelectorAll('#itemsTable tr')).map(row => ({
            code: row.querySelector('td:first-child input').value,
            article: row.querySelector('select').value,
            description: row.querySelector('td:nth-child(3) input').value,
            quantity: row.querySelector('.quantity').value,
            price: row.querySelector('.price').value,
            total: row.querySelector('.total').value
        })),
        totalHT: document.getElementById('totalHT').textContent,
        tva: document.getElementById('tva').textContent,
        totalTTC: document.getElementById('totalTTC').textContent,
        observations: document.querySelector('textarea').value
    };
    
    // هنا يمكن إضافة منطق لحفظ البيانات
    console.log('Données du bon d\'entrée:', formData);
    
    // عرض رسالة نجاح
    alert('Bon d\'entrée enregistré avec succès!');
}

function printBonEntree() {
    // إخفاء العناصر التي لا يجب طباعتها
    document.querySelectorAll('.no-print').forEach(el => el.style.display = 'none');
    
    // طباعة الصفحة
    window.print();
    
    // إعادة عرض العناصر المخفية
    document.querySelectorAll('.no-print').forEach(el => el.style.display = '');
}

function setupDonnantSignatureLink() {
    // البحث عن جميع حقول Le donnant في الجدول
    const itemsTable = document.getElementById('itemsTable');
    
    // إضافة مستمع للأحداث على الجدول
    itemsTable.addEventListener('input', function(e) {
        if (e.target.classList.contains('price')) { // حقل Le donnant
            // البحث عن حقل Nom et qualité في Signature Fournisseur
            const fournisseurNomQualite = document.getElementById('fournisseurNomQualite');
            if (fournisseurNomQualite) {
                fournisseurNomQualite.value = e.target.value;
            }
        }
    });
} 