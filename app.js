// Stock Span Analyzer - Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components with proper error handling
    initializeParticles();
    initializeAOS();
    initializeThemeToggle();
    initializeFormHandlers();
    initializeSampleData();
    
    // Load sample data on page load for demonstration
    setTimeout(() => {
        loadSampleData();
    }, 1000);
});

// Particles.js Configuration with fallback
function initializeParticles() {
    // Check if particles.js is available
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#20c997'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#20c997',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    } else {
        // Fallback: Create CSS particles if particles.js fails
        createCSSParticles();
    }
}

// CSS Particles Fallback
function createCSSParticles() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    // Create 50 CSS particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'css-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: #20c997;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: float ${Math.random() * 10 + 10}s infinite linear;
            animation-delay: ${Math.random() * 5}s;
        `;
        particlesContainer.appendChild(particle);
    }
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(0px) translateX(-10px); }
            75% { transform: translateY(20px) translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// AOS Animation Initialization
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
}

// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;
    
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    function setTheme(theme) {
        html.setAttribute('data-bs-theme', theme);
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        // Update particles color for theme
        updateParticlesTheme(theme);
    }
    
    function updateParticlesTheme(theme) {
        const particleColor = theme === 'dark' ? '#20c997' : '#0d6efd';
        if (window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.particles.color.value = particleColor;
            window.pJSDom[0].pJS.particles.line_linked.color = particleColor;
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
        
        // Update CSS particles
        const cssParticles = document.querySelectorAll('.css-particle');
        cssParticles.forEach(particle => {
            particle.style.background = particleColor;
        });
    }
}

// Form Handlers
function initializeFormHandlers() {
    const stockForm = document.getElementById('stockForm');
    const computeBtn = document.getElementById('computeBtn');
    const pricesInput = document.getElementById('prices');
    
    stockForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const prices = pricesInput.value.trim();
        if (!prices) {
            showAlert('Please enter stock prices', 'warning');
            return;
        }
        
        // Parse and validate prices
        const priceArray = parseAndValidatePrices(prices);
        if (!priceArray) {
            showAlert('Please enter valid numeric prices separated by commas', 'danger');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        // Simulate API call delay
        setTimeout(() => {
            try {
                const result = calculateStockSpan(priceArray);
                displayResults(result);
                setLoadingState(false);
                showAlert('Stock span analysis completed successfully!', 'success');
            } catch (error) {
                setLoadingState(false);
                showAlert('Error calculating stock span: ' + error.message, 'danger');
            }
        }, 1500);
    });
    
    // Auto-resize textarea
    pricesInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

// Sample Data Initialization
function initializeSampleData() {
    const loadSampleBtn = document.getElementById('loadSampleBtn');
    
    loadSampleBtn.addEventListener('click', function() {
        loadSampleData();
    });
}

// Load Sample Data
function loadSampleData() {
    const samplePrices = [100, 80, 60, 70, 60, 75, 85];
    const pricesInput = document.getElementById('prices');
    
    pricesInput.value = samplePrices.join(', ');
    
    // Add animation to the input
    pricesInput.classList.add('success-pulse');
    setTimeout(() => {
        pricesInput.classList.remove('success-pulse');
    }, 600);
    
    // Auto-calculate for demo
    setTimeout(() => {
        const result = calculateStockSpan(samplePrices);
        displayResults(result);
        showAlert('Sample data loaded and analyzed!', 'info');
    }, 1000);
}

// Parse and Validate Prices
function parseAndValidatePrices(pricesString) {
    try {
        const prices = pricesString.split(',').map(price => {
            const num = parseFloat(price.trim());
            if (isNaN(num) || num <= 0) {
                throw new Error('Invalid price');
            }
            return num;
        });
        
        if (prices.length === 0) {
            throw new Error('No prices provided');
        }
        
        return prices;
    } catch (error) {
        return null;
    }
}

// Stock Span Calculation Algorithm
function calculateStockSpan(prices) {
    if (!prices || prices.length === 0) {
        throw new Error('No prices provided');
    }
    
    const n = prices.length;
    const spans = new Array(n);
    const stack = [];
    
    for (let i = 0; i < n; i++) {
        // Pop elements from stack while stack is not empty and
        // price at top of stack is less than or equal to current price
        while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
            stack.pop();
        }
        
        // If stack becomes empty, then price[i] is greater than all elements
        // to left of it, i.e., price[0], price[1], ..., price[i-1]
        spans[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];
        
        // Push this element to stack
        stack.push(i);
    }
    
    // Create result object
    const result = {
        prices: prices,
        spans: spans,
        days: Array.from({length: n}, (_, i) => i + 1)
    };
    
    return result;
}

// Display Results
function displayResults(data) {
    const resultsSection = document.getElementById('results');
    const resultsTable = document.getElementById('resultsTable').querySelector('tbody');
    
    // Clear existing results
    resultsTable.innerHTML = '';
    
    // Populate table
    data.days.forEach((day, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-bold">${day}</td>
            <td class="text-success">$${data.prices[index].toFixed(2)}</td>
            <td class="text-info">${data.spans[index]}</td>
        `;
        resultsTable.appendChild(row);
    });
    
    // Show results section
    resultsSection.classList.remove('d-none');
    
    // Scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 300);
    
    // Create chart with delay to ensure Chart.js is loaded
    setTimeout(() => {
        createChart(data);
        generateSummaryStats(data);
    }, 500);
}

// Create Chart using Chart.js with proper error handling
function createChart(data) {
    const chartCanvas = document.getElementById('stockChart');
    if (!chartCanvas) {
        console.error('Chart canvas not found');
        return;
    }
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        // Show fallback message
        const chartContainer = chartCanvas.parentElement;
        chartContainer.innerHTML = '<div class="alert alert-warning">Chart library not loaded. Please refresh the page.</div>';
        return;
    }
    
    const ctx = chartCanvas.getContext('2d');
    
    // Destroy existing chart if it exists
    if (window.stockChart && typeof window.stockChart.destroy === 'function') {
        window.stockChart.destroy();
    }
    
    // Create gradient for price line
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(32, 201, 151, 0.8)');
    gradient.addColorStop(1, 'rgba(32, 201, 151, 0.1)');
    
    // Get current theme colors
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    const textColor = isDark ? '#ffffff' : '#000000';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    try {
        window.stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.days.map(day => `Day ${day}`),
                datasets: [{
                    label: 'Stock Price ($)',
                    data: data.prices,
                    borderColor: '#20c997',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#20c997',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    yAxisID: 'y'
                }, {
                    label: 'Stock Span',
                    data: data.spans,
                    type: 'bar',
                    backgroundColor: 'rgba(255, 193, 7, 0.7)',
                    borderColor: '#ffc107',
                    borderWidth: 2,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            color: textColor
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#20c997',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.dataset.label === 'Stock Price ($)') {
                                    label += '$' + context.parsed.y.toFixed(2);
                                } else {
                                    label += context.parsed.y;
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: true,
                            color: gridColor
                        },
                        ticks: {
                            color: textColor
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: gridColor
                        },
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Stock Price ($)',
                            color: '#20c997'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            color: textColor
                        },
                        title: {
                            display: true,
                            text: 'Stock Span',
                            color: '#ffc107'
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                }
            }
        });
        
        console.log('Chart created successfully');
    } catch (error) {
        console.error('Error creating chart:', error);
        // Show fallback message
        const chartContainer = chartCanvas.parentElement;
        chartContainer.innerHTML = '<div class="alert alert-info">Chart will appear here after data is processed.</div>';
    }
}

// Generate Summary Statistics
function generateSummaryStats(data) {
    const summaryContainer = document.getElementById('summaryStats');
    
    // Calculate statistics
    const maxPrice = Math.max(...data.prices);
    const minPrice = Math.min(...data.prices);
    const avgPrice = data.prices.reduce((sum, price) => sum + price, 0) / data.prices.length;
    const maxSpan = Math.max(...data.spans);
    const totalDays = data.days.length;
    
    // Find day with max span
    const maxSpanDay = data.spans.indexOf(maxSpan) + 1;
    
    const stats = [
        {
            value: `$${maxPrice.toFixed(2)}`,
            label: 'Highest Price',
            color: 'text-success'
        },
        {
            value: `$${minPrice.toFixed(2)}`,
            label: 'Lowest Price',
            color: 'text-danger'
        },
        {
            value: `$${avgPrice.toFixed(2)}`,
            label: 'Average Price',
            color: 'text-info'
        },
        {
            value: maxSpan,
            label: 'Maximum Span',
            color: 'text-warning'
        },
        {
            value: `Day ${maxSpanDay}`,
            label: 'Best Span Day',
            color: 'text-primary'
        },
        {
            value: totalDays,
            label: 'Total Days',
            color: 'text-secondary'
        }
    ];
    
    summaryContainer.innerHTML = '';
    
    stats.forEach((stat, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6 mb-3';
        col.innerHTML = `
            <div class="summary-stat" style="animation-delay: ${index * 0.1}s;">
                <span class="stat-value ${stat.color}">${stat.value}</span>
                <div class="stat-label">${stat.label}</div>
            </div>
        `;
        summaryContainer.appendChild(col);
    });
}

// Loading State Management
function setLoadingState(isLoading) {
    const computeBtn = document.getElementById('computeBtn');
    const btnText = computeBtn.querySelector('.btn-text');
    const spinner = computeBtn.querySelector('.spinner-border');
    
    if (isLoading) {
        btnText.classList.add('d-none');
        spinner.classList.remove('d-none');
        computeBtn.disabled = true;
    } else {
        btnText.classList.remove('d-none');
        spinner.classList.add('d-none');
        computeBtn.disabled = false;
        computeBtn.classList.add('success-pulse');
        setTimeout(() => {
            computeBtn.classList.remove('success-pulse');
        }, 600);
    }
}

// Alert System
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert-floating');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-floating fade-in`;
    alert.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getAlertIcon(type)} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style the floating alert
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        border-radius: 12px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }, 5000);
}

// Get Alert Icon
function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        danger: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Smooth Scroll to Analyzer
function scrollToAnalyzer() {
    const analyzerSection = document.getElementById('analyzer');
    analyzerSection.scrollIntoView({ behavior: 'smooth' });
}

// Expose global functions
window.scrollToAnalyzer = scrollToAnalyzer;

// Handle window resize for chart
window.addEventListener('resize', function() {
    if (window.stockChart && typeof window.stockChart.resize === 'function') {
        window.stockChart.resize();
    }
});

// Add some Easter eggs
let clickCount = 0;
document.addEventListener('click', function(e) {
    if (e.target.closest('.navbar-brand')) {
        clickCount++;
        if (clickCount >= 5) {
            showAlert('🎉 You found the easter egg! Thanks for exploring!', 'success');
            clickCount = 0;
            
            // Add confetti effect
            createConfetti();
        }
    }
});

// Confetti Effect
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * window.innerWidth}px;
            top: -10px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: confettiFall 3s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 3000);
    }
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Force chart update on theme change
document.getElementById('themeToggle').addEventListener('click', function() {
    setTimeout(() => {
        if (window.stockChart && typeof window.stockChart.update === 'function') {
            // Update chart colors for new theme
            const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
            const textColor = isDark ? '#ffffff' : '#000000';
            const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            
            window.stockChart.options.plugins.legend.labels.color = textColor;
            window.stockChart.options.scales.x.ticks.color = textColor;
            window.stockChart.options.scales.y.ticks.color = textColor;
            window.stockChart.options.scales.y1.ticks.color = textColor;
            window.stockChart.options.scales.x.grid.color = gridColor;
            window.stockChart.options.scales.y.grid.color = gridColor;
            
            window.stockChart.update();
        }
    }, 100);
});