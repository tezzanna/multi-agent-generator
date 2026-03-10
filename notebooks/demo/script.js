document.addEventListener('DOMContentLoaded', () => {
    /*===================== Demo Data =====================*/
    const users = [
        { user_id: 1, username: 'admin', email: 'admin@example.com', role: 'Admin' },
        { user_id: 2, username: 'john', email: 'john@example.com', role: 'User' }
    ];

    const products = [
        { product_id: 1, name: 'Laptop', category: 'Electronics', price: 1200, stock_qty: 10 },
        { product_id: 2, name: 'Smartphone', category: 'Electronics', price: 800, stock_qty: 15 },
        { product_id: 3, name: 'T‑Shirt', category: 'Clothing', price: 20, stock_qty: 50 },
        { product_id: 4, name: 'Jeans', category: 'Clothing', price: 40, stock_qty: 30 },
        { product_id: 5, name: 'Headphones', category: 'Electronics', price: 100, stock_qty: 20 }
    ];

    const customers = [
        { customer_id: 1, first_name: 'Alice', last_name: 'Smith', email: 'alice.smith@example.com', phone: '+1234567890' },
        { customer_id: 2, first_name: 'Bob', last_name: 'Brown', email: 'bob.brown@example.com', phone: '+1987654321' },
        { customer_id: 3, first_name: 'Charlie', last_name: 'Davis', email: 'charlie.davis@example.com', phone: '+1122334455' },
        { customer_id: 4, first_name: 'Diana', last_name: 'Evans', email: 'diana.evans@example.com', phone: '+1223344556' },
        { customer_id: 5, first_name: 'Ethan', last_name: 'Foster', email: 'ethan.foster@example.com', phone: '+1555666777' }
    ];

    const sales = [
        { sale_id: 1, product_id: 1, customer_id: 1, sale_date: '2024-01-10', quantity: 1, unit_price: 1200, total_amount: 1200 },
        { sale_id: 2, product_id: 2, customer_id: 2, sale_date: '2024-01-12', quantity: 2, unit_price: 800, total_amount: 1600 },
        { sale_id: 3, product_id: 3, customer_id: 3, sale_date: '2024-01-15', quantity: 5, unit_price: 20, total_amount: 100 },
        { sale_id: 4, product_id: 4, customer_id: 2, sale_date: '2024-02-01', quantity: 1, unit_price: 40, total_amount: 40 },
        { sale_id: 5, product_id: 5, customer_id: 1, sale_date: '2024-02-03', quantity: 3, unit_price: 100, total_amount: 300 },
        { sale_id: 6, product_id: 1, customer_id: 5, sale_date: '2024-02-10', quantity: 1, unit_price: 1200, total_amount: 1200 },
        { sale_id: 7, product_id: 3, customer_id: null, sale_date: '2024-02-12', quantity: 10, unit_price: 20, total_amount: 200 },
        { sale_id: 8, product_id: 2, customer_id: 4, sale_date: '2024-02-15', quantity: 2, unit_price: 800, total_amount: 1600 },
        { sale_id: 9, product_id: 4, customer_id: 3, sale_date: '2024-03-01', quantity: 2, unit_price: 40, total_amount: 80 },
        { sale_id: 10, product_id: 5, customer_id: 5, sale_date: '2024-03-05', quantity: 4, unit_price: 100, total_amount: 400 }
    ];

    /*===================== DOM Elements =====================*/
    const dashboard = document.createElement('div');
    dashboard.id = 'dashboard';
    dashboard.style.fontFamily = 'Arial, sans-serif';
    dashboard.style.margin = '20px';
    document.body.appendChild(dashboard);

    // Filters Section
    const filterForm = document.createElement('form');
    filterForm.style.marginBottom = '20px';
    filterForm.style.display = 'flex';
    filterForm.style.flexWrap = 'wrap';
    filterForm.style.alignItems = 'center';
    filterForm.style.gap = '10px';
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        applyFilters();
    });

    const startDateInput = document.createElement('input');
    startDateInput.type = 'date';
    startDateInput.id = 'startDate';
    startDateInput.placeholder = 'Start Date';
    filterForm.appendChild(startDateInput);

    const endDateInput = document.createElement('input');
    endDateInput.type = 'date';
    endDateInput.id = 'endDate';
    endDateInput.placeholder = 'End Date';
    filterForm.appendChild(endDateInput);

    const categorySelect = document.createElement('select');
    categorySelect.id = 'categoryFilter';
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Categories';
    categorySelect.appendChild(allOption);
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        categorySelect.appendChild(opt);
    });
    filterForm.appendChild(categorySelect);

    const minTotalInput = document.createElement('input');
    minTotalInput.type = 'number';
    minTotalInput.id = 'minTotal';
    minTotalInput.placeholder = 'Min Total';
    minTotalInput.min = '0';
    minTotalInput.step = '0.01';
    filterForm.appendChild(minTotalInput);

    const applyBtn = document.createElement('button');
    applyBtn.type = 'submit';
    applyBtn.textContent = 'Apply Filters';
    filterForm.appendChild(applyBtn);
    dashboard.appendChild(filterForm);

    // Table Container
    const tableContainer = document.createElement('div');
    tableContainer.id = 'tableContainer';
    dashboard.appendChild(tableContainer);

    // Pagination Controls
    const paginationControls = document.createElement('div');
    paginationControls.style.marginTop = '10px';
    paginationControls.style.display = 'flex';
    paginationControls.style.alignItems = 'center';
    paginationControls.style.gap = '10px';
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Prev';
    prevBtn.disabled = true;
    const pageInfo = document.createElement('span');
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = true;
    paginationControls.appendChild(prevBtn);
    paginationControls.appendChild(pageInfo);
    paginationControls.appendChild(nextBtn);
    dashboard.appendChild(paginationControls);

    // Chart
    const chartCanvas = document.getElementById('mainChart');
    let chartInstance = null;
    let chartCtx = null;
    if (chartCanvas) {
        chartCtx = chartCanvas.getContext('2d');
    }

    /*===================== State Management =====================*/
    const state = {
        filters: {
            startDate: null,
            endDate: null,
            category: '',
            minTotal: null
        },
        sort: {
            key: null,
            order: 'asc' // 'asc' or 'desc'
        },
        pagination: {
            currentPage: 1,
            pageSize: 5,
            totalPages: 1
        }
    };

    /*===================== Helper Functions =====================*/
    function getProductById(id) {
        return products.find(p => p.product_id === id) || null;
    }

    function getCustomerById(id) {
        return customers.find(c => c.customer_id === id) || null;
    }

    function applyFilters() {
        state.filters.startDate = startDateInput.value ? new Date(startDateInput.value) : null;
        state.filters.endDate = endDateInput.value ? new Date(endDateInput.value) : null;
        state.filters.category = categorySelect.value;
        state.filters.minTotal = minTotalInput.value ? parseFloat(minTotalInput.value) : null;
        state.pagination.currentPage = 1;
        updateView();
    }

    function compare(a, b, key, order) {
        let valA = a[key];
        let valB = b[key];
        if (key === 'product_name' || key === 'category' || key === 'sale_date') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
    }

    function filterData(salesData) {
        return salesData.filter(sale => {
            // Date filter
            const saleDate = new Date(sale.sale_date);
            if (state.filters.startDate && saleDate < state.filters.startDate) return false;
            if (state.filters.endDate && saleDate > state.filters.endDate) return false;
            // Category filter
            const prod = getProductById(sale.product_id);
            if (state.filters.category && prod && prod.category !== state.filters.category) return false;
            // Min total filter
            if (state.filters.minTotal !== null && sale.total_amount < state.filters.minTotal) return false;
            return true;
        });
    }

    function sortData(data) {
        if (!state.sort.key) return data;
        return data.slice().sort((a, b) => compare(a, b, state.sort.key, state.sort.order));
    }

    function paginateData(data) {
        const total = data.length;
        const pageSize = state.pagination.pageSize;
        const totalPages = Math.ceil(total / pageSize) || 1;
        state.pagination.totalPages = totalPages;
        const start = (state.pagination.currentPage - 1) * pageSize;
        const end = start + pageSize;
        return {
            pagedData: data.slice(start, end),
            totalPages
        };
    }

    function renderTable() {
        tableContainer.innerHTML = '';
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';

        // Header
        const headers = [
            { key: 'product_name', label: 'Product Name' },
            { key: 'category', label: 'Category' },
            { key: 'sale_date', label: 'Sale Date' },
            { key: 'quantity', label: 'Quantity' },
            { key: 'total_amount', label: 'Total Amount' }
        ];
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h.label;
            th.dataset.key = h.key;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.cursor = 'pointer';
            th.style.background = '#f2f2f2';
            th.addEventListener('click', () => {
                if (state.sort.key === h.key) {
                    state.sort.order = state.sort.order === 'asc' ? 'desc' : 'asc';
                } else {
                    state.sort.key = h.key;
                    state.sort.order = 'asc';
                }
                updateView();
            });
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        const { pagedData } = paginateData(currentData);
        pagedData.forEach(sale => {
            const tr = document.createElement('tr');
            const prod = getProductById(sale.product_id);
            const rowData = {
                product_name: prod ? prod.name : 'Unknown',
                category: prod ? prod.category : 'Unknown',
                sale_date: sale.sale_date,
                quantity: sale.quantity,
                total_amount: sale.total_amount.toFixed(2)
            };
            Object.values(rowData).forEach(val => {
                const td = document.createElement('td');
                td.textContent = val;
                td.style.border = '1px solid #ddd';
                td.style.padding = '8px';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        tableContainer.appendChild(table);
    }

    function renderPagination() {
        prevBtn.disabled = state.pagination.currentPage <= 1;
        nextBtn.disabled = state.pagination.currentPage >= state.pagination.totalPages;
        pageInfo.textContent = `Page ${state.pagination.currentPage} of ${state.pagination.totalPages}`;
    }

    function renderChart() {
        if (!chartCtx) return;
        const chartData = aggregateChartData(currentData);
        const labels = chartData.labels;
        const dataset = chartData.values;

        if (!chartInstance) {
            chartInstance = new Chart(chartCtx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Total Sales',
                        data: dataset,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: { display: true, text: 'Date' }
                        },
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Total Amount' }
                        }
                    }
                }
            });
        } else {
            chartInstance.data.labels = labels;
            chartInstance.data.datasets[0].data = dataset;
            chartInstance.update();
        }
    }

    function aggregateChartData(salesData) {
        const groupMap = {};
        salesData.forEach(sale => {
            const date = sale.sale_date.slice(0, 10); // YYYY-MM-DD
            if (!groupMap[date]) groupMap[date] = 0;
            groupMap[date] += sale.total_amount;
        });
        const sortedDates = Object.keys(groupMap).sort();
        const labels = sortedDates;
        const values = sortedDates.map(d => groupMap[d].toFixed(2));
        return { labels, values };
    }

    /*===================== Event Listeners =====================*/
    prevBtn.addEventListener('click', () => {
        if (state.pagination.currentPage > 1) {
            state.pagination.currentPage--;
            updateView();
        }
    });
    nextBtn.addEventListener('click', () => {
        if (state.pagination.currentPage < state.pagination.totalPages) {
            state.pagination.currentPage++;
            updateView();
        }
    });

    /*===================== Main Update Cycle =====================*/
    let currentData = [];
    function updateView() {
        const filtered = filterData(sales);
        const sorted = sortData(filtered);
        currentData = sorted;
        renderTable();
        renderPagination();
        renderChart();
    }

    // Initial render
    updateView();
});

