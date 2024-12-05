// Icons for different categories
const categoryIcons = {
    'Platforms': '💻',
    'Programming Languages': '🖥️',
    'Web Development': '🌐',
    'Mobile Development': '📱',
    'Machine Learning': '🤖',
    'Data Science': '📊',
    'DevOps': '🚀',
    'Security': '🔒',
    'Blockchain': '⛓️',
    'Gaming': '🎮'
};

// Global data storage
let allData = null;

// Theme Toggle functionality
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Remove any existing theme classes
    body.classList.remove('light-theme', 'dark-theme');

    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Get saved theme
    const savedTheme = localStorage.getItem('theme');
    
    // Use saved theme if exists, otherwise use system preference
    let currentTheme;
    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        currentTheme = prefersDark ? 'dark-theme' : 'light-theme';
    }
    
    // Apply theme
    body.classList.add(currentTheme);
    themeToggle.checked = currentTheme === 'dark-theme';

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark-theme' : 'light-theme';
            body.classList.remove('light-theme', 'dark-theme');
            body.classList.add(newTheme);
            themeToggle.checked = e.matches;
        }
    });

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark-theme');
        } else {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light-theme');
        }
    });
}

// Search functionality
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function performSearch(query) {
    if (!allData) return [];

    query = query.toLowerCase().trim();
    const searchResults = [];
    const uniqueResults = new Set(); // Track unique results

    // Priority 1: Category Name Matches
    allData.Contents.forEach(category => {
        if (category.name.toLowerCase().includes(query)) {
            const resultKey = `category:${category.name}`;
            if (!uniqueResults.has(resultKey)) {
                searchResults.push({
                    name: category.name,
                    description: `Category with ${allData[category.name].length} items`,
                    link: `category.html?name=${encodeURIComponent(category.name)}`,
                    score: 4,
                    matchType: 'Category Name Match',
                    isCategory: true
                });
                uniqueResults.add(resultKey);
            }
        }
    });

    // Priority 2: Category-level Item Name Matches
    allData.Contents.forEach(category => {
        const categoryItems = allData[category.name];

        categoryItems.forEach(item => {
            let score = 0;
            let matchType = '';

            // Name match (high priority)
            if (item.name.toLowerCase().includes(query)) {
                score = 3;
                matchType = 'Item Name Match';
            }
            // Sub-items match (medium priority)
            else if (item.sub_items && item.sub_items.some(subItem => 
                subItem.name.toLowerCase().includes(query)
            )) {
                score = 2;
                matchType = 'Sub-Item Match';
            }
            // Description match (lowest priority)
            else if (item.description && item.description.toLowerCase().includes(query)) {
                score = 1;
                matchType = 'Description Match';
            }

            if (score > 0) {
                const resultKey = `item:${item.name}:${category.name}`;
                if (!uniqueResults.has(resultKey)) {
                    searchResults.push({
                        ...item,
                        category: category.name,
                        score,
                        matchType,
                        link: `category.html?name=${encodeURIComponent(category.name)}`,
                        isCategory: false
                    });
                    uniqueResults.add(resultKey);
                }
            }
        });
    });

    // Sort results by score (descending)
    return searchResults.sort((a, b) => {
        // First, sort by score
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        
        // If scores are equal, prioritize categories
        return (b.isCategory ? 1 : 0) - (a.isCategory ? 1 : 0);
    });
}

function displaySearchResults(results, query) {
    const searchResultsContainer = document.getElementById('search-results');
    const categoriesGrid = document.getElementById('categories-grid');
    const searchClearBtn = document.getElementById('clear-search');

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>No results found</p>';
        searchResultsContainer.classList.add('active');
        categoriesGrid.style.display = 'none';
        return;
    }

    searchResultsContainer.innerHTML = results.map(result => `
        <div class="search-result-card ${result.isCategory ? 'category-result' : ''} ${result.category ? `category-${result.category.toLowerCase().replace(' ', '-')}` : ''}">
            <a href="${result.link}" target="_blank" class="search-result-title">
                ${highlightText(result.name, query)}
                ${result.isCategory ? `
                    <span class="category-badge">
                        🗂️ Category
                        <span class="item-count">${result.description.replace('Category with ', '')}</span>
                    </span>
                ` : ''}
            </a>
            ${!result.isCategory ? `
                <p class="search-result-description">
                    ${highlightText(result.description || 'No description', query)}
                </p>
                <div class="search-result-category">
                    Category: ${result.category} (${result.matchType})
                </div>
            ` : ''}
        </div>
    `).join('');

    searchResultsContainer.classList.add('active');
    categoriesGrid.style.display = 'none';
    searchClearBtn.classList.add('visible');
}

function clearSearch() {
    const searchInput = document.getElementById('global-search');
    const searchResultsContainer = document.getElementById('search-results');
    const categoriesGrid = document.getElementById('categories-grid');
    const searchClearBtn = document.getElementById('clear-search');

    searchInput.value = '';
    searchResultsContainer.innerHTML = '';
    searchResultsContainer.classList.remove('active');
    categoriesGrid.style.display = 'grid';
    searchClearBtn.classList.remove('visible');
}

// Initialize event listeners
function initializeEventListeners() {
    document.getElementById('global-search').addEventListener('input', function() {
        const query = this.value;
        const results = performSearch(query);
        displaySearchResults(results, query);
    });

    document.getElementById('clear-search').addEventListener('click', clearSearch);
}

// Load and render categories
function loadAndRenderCategories() {
    fetch('parsed_content.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
            const categoriesGrid = document.getElementById('categories-grid');
            const renderedCategories = new Set(); // Track rendered categories

            data.Contents.forEach(category => {
                if (!renderedCategories.has(category.name)) {
                    const categoryCard = document.createElement('a');
                    categoryCard.href = `category.html?name=${encodeURIComponent(category.name)}`;
                    categoryCard.className = 'category-card';

                    const categoryName = document.createElement('h3');
                    categoryName.textContent = category.name;
                    categoryCard.appendChild(categoryName);

                    const itemCount = document.createElement('div');
                    itemCount.className = 'item-count';
                    const categoryItems = data[category.name];
                    itemCount.textContent = `${categoryItems.length} Items`;
                    categoryCard.appendChild(itemCount);

                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'icon';
                    iconSpan.textContent = categoryIcons[category.name] || '📁';
                    categoryCard.appendChild(iconSpan);

                    categoriesGrid.appendChild(categoryCard);
                    renderedCategories.add(category.name);
                }
            });
        })
        .catch(error => console.error('Error loading JSON:', error));
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeEventListeners();
    loadAndRenderCategories();
});
