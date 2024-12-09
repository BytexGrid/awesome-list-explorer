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
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return; // Guard clause if element not found
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    themeToggle.checked = savedTheme === 'dark';
}

// Search functionality
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function performSearch(query) {
    if (!window.categoryData || !query) return [];
    
    query = query.toLowerCase();
    const results = [];
    
    // Search in Contents array
    window.categoryData.Contents.forEach(category => {
        if (category.name.toLowerCase().includes(query) ||
            (category.description && category.description.toLowerCase().includes(query))) {
            results.push({
                type: 'category',
                name: category.name,
                description: category.description || `Explore ${category.name} resources`,
                link: `category.html?name=${encodeURIComponent(category.name)}`
            });
        }
    });
    
    // Search in individual category resources
    Object.entries(window.categoryData).forEach(([categoryName, items]) => {
        if (categoryName !== 'Contents' && Array.isArray(items)) {
            items.forEach(item => {
                if (item.name.toLowerCase().includes(query) ||
                    (item.description && item.description.toLowerCase().includes(query))) {
                    results.push({
                        type: 'resource',
                        name: item.name,
                        description: item.description || '',
                        category: categoryName,
                        link: `category.html?name=${encodeURIComponent(categoryName)}#item-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
                    });
                }
            });
        }
    });
    
    return results;
}

function displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
        return;
    }

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-card'; // Use the same class as category cards
        resultItem.innerHTML = `
            <a href="${result.link || `category.html?name=${encodeURIComponent(result.name)}`}" target="_blank" class="search-result-title">
                ${highlightText(result.name, query)}
            </a>
            <p class="search-result-description">
                ${highlightText(result.description, query)}
            </p>
            <div class="search-result-category">
                Category: ${result.category}
            </div>
        `;
        resultsContainer.appendChild(resultItem);
    });

    resultsContainer.classList.add('active'); // Show the results container
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
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value;
            const results = performSearch(query);
            displaySearchResults(results, query);

            // Check if the input is empty
            if (query === '') {
                clearSearch(); // Trigger cancel search
            }
        });
    }

    const clearSearchButton = document.getElementById('clear-search');
    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', clearSearch);
    }
}

import { followManager } from './js/follow-manager.js';

// Initialize FollowManager
followManager.initialize();

// Example of appending follow button to a category card
function appendFollowButton(categoryCard, categoryName) {
    const followButton = document.createElement('button');
    followButton.className = 'follow-button';
    followButton.innerHTML = `
        <div class="hashtag-icon">#<span class="follow-count">0</span></div>
    `;

    followButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await followManager.toggleFollow(categoryName);
    });

    categoryCard.appendChild(followButton);
}

// Only run this code if we're on the home page (index.html)
if (!window.location.pathname.includes('category.html')) {
    async function loadAndRenderCategories() {
        try {
            const response = await fetch('parsed_content.json');
            const data = await response.json();
            
            const categoriesGrid = document.getElementById('categories-grid');
            categoriesGrid.innerHTML = '';
            
            data.Contents.forEach(category => {
                const categoryCard = document.createElement('div');
                categoryCard.className = 'category-card';
                categoryCard.setAttribute('data-category', category.name);
                
                // Create follow button
                const followButton = document.createElement('button');
                followButton.className = 'follow-button';
                followButton.innerHTML = `
                    <div class="hashtag-icon">#<span class="follow-count">0</span></div>
                `;
                
                followButton.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await followManager.toggleFollow(category.name);
                });
                
                categoryCard.appendChild(followButton);
                
                // Create bookmark button
                const bookmarkButton = document.createElement('button');
                bookmarkButton.className = 'bookmark-button';
                const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
                const isBookmarked = bookmarks.includes(category.name);
                bookmarkButton.innerHTML = isBookmarked ?
                    `<img class="bookmark-icon" src="media/bookmark-filled-svgrepo-com.svg" alt="Bookmarked">` :
                    `<img class="bookmark-icon" src="media/bookmark-svgrepo-com (1).svg" alt="Unbookmarked">`;
                bookmarkButton.addEventListener('click', () => {
                    toggleBookmark(category.name);
                });
                categoryCard.appendChild(bookmarkButton);

                // Create category link wrapper
                const categoryLink = document.createElement('a');
                categoryLink.href = `category.html?name=${encodeURIComponent(category.name)}`;
                categoryLink.style.textDecoration = 'none';
                categoryLink.style.color = 'inherit';
                
                const title = document.createElement('h3');
                title.textContent = category.name;
                categoryLink.appendChild(title);
                
                const description = document.createElement('p');
                description.className = 'description';
                description.textContent = category.description || '';
                categoryLink.appendChild(description);
                
                // Add resource count in a pill container
                const resourceCount = data[category.name] ? data[category.name].length : 0;
                const resourceCountPill = document.createElement('div');
                resourceCountPill.className = 'resource-count';
                resourceCountPill.textContent = `${resourceCount} Resources`;
                categoryLink.appendChild(resourceCountPill);
                
                categoryCard.appendChild(categoryLink);
                
                // Check if category is bookmarked
                if (bookmarks.includes(category.name)) {
                    categoriesGrid.prepend(categoryCard);
                } else {
                    categoriesGrid.appendChild(categoryCard);
                }
            });
            
            // Store data globally for search functionality
            window.categoryData = data;
            
            // Initialize follow manager after rendering categories
            await followManager.initialize();
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    // Toggle bookmark status
    function toggleBookmark(categoryName) {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
        const index = bookmarks.indexOf(categoryName);
        if (index > -1) {
            bookmarks.splice(index, 1);
        } else {
            bookmarks.push(categoryName);
        }
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        loadAndRenderCategories();
    }

    // Initialize everything when the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        initializeTheme();
        initializeEventListeners();
        loadAndRenderCategories();
    });
}
