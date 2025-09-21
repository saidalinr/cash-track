// shared.js - Common functionality for all pages

// Get currency symbol based on currency code
function getCurrencySymbol(currencyCode) {
    const symbols = {
        'USD': '$',
        'EUR': '€',
        'INR': '₹',
        'GBP': '£',
        'JPY': '¥',
        'CAD': 'C$'
    };
    return symbols[currencyCode] || '$';
}

// Format amount with currency symbol
function formatCurrency(amount, currencyCode = null) {
    const code = currencyCode || localStorage.getItem('currency') || 'USD';
    const symbol = getCurrencySymbol(code);
    
    // Format number with thousands separators
    const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    // Position symbol based on currency
    if (code === 'USD' || code === 'CAD' || code === 'GBP') {
        return `${symbol}${formattedAmount}`;
    } else if (code === 'EUR') {
        return `${formattedAmount} ${symbol}`;
    } else {
        return `${symbol} ${formattedAmount}`;
    }
}

// Apply theme to the page
function applyTheme(theme) {
    // Remove any existing theme classes
    document.body.classList.remove('dark-theme');
    
    // Determine which theme to apply
    let effectiveTheme = theme;
    if (theme === 'auto') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Apply the theme
    if (effectiveTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Update theme selector if it exists
    const themeSelector = document.getElementById('theme');
    if (themeSelector) {
        themeSelector.value = theme;
    }
}

// Initialize theme on page load
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

// Initialize currency on page load
function initCurrency() {
    const savedCurrency = localStorage.getItem('currency') || 'USD';
    const currencySelector = document.getElementById('currency');
    if (currencySelector) {
        currencySelector.value = savedCurrency;
    }
    return savedCurrency;
}

// Update all currency displays on the page
function updateCurrencyDisplays() {
    const currency = localStorage.getItem('currency') || 'USD';
    const symbol = getCurrencySymbol(currency);
    
    // Update all elements with currency amounts
    const amountElements = document.querySelectorAll('.amount, .value');
    amountElements.forEach(el => {
        if (el.textContent.includes('$')) {
            const amount = el.textContent.replace('$', '');
            el.textContent = formatCurrency(amount, currency);
        }
    });
    
    // Update budget text
    const budgetText = document.getElementById('budget-text');
    if (budgetText) {
        const monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || 0;
        budgetText.textContent = `Budget: ${formatCurrency(monthlyBudget, currency)}`;
    }
}

// Initialize the application with theme and currency
function initApp() {
    initTheme();
    initCurrency();
    updateCurrencyDisplays();
}

// Listen for theme changes from other tabs/windows
window.addEventListener('storage', function(e) {
    if (e.key === 'theme') {
        applyTheme(e.newValue || 'light');
    }
    if (e.key === 'currency') {
        updateCurrencyDisplays();
    }
});