console.log('Category.js is loaded'); // Add this line at the top
// Check for hash in URL and scroll to item if present
if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        // Wait for content to render
        setTimeout(() => {
            // Scroll the item into view
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add highlight animation
            targetElement.classList.add('highlight-item');
            
            // Remove highlight class after animation
            setTimeout(() => {
                targetElement.classList.remove('highlight-item');
            }, 2000);
        }, 500); // Increased delay to ensure content is rendered
    }
}

(function() {
    // Wrap entire script in an Immediately Invoked Function Expression (IIFE)
    // This prevents global variable conflicts

    // Check if theme toggle already exists to prevent redeclaration
    const existingThemeToggle = document.getElementById('themeToggle');
    if (!existingThemeToggle) {
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

    // Get category name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('name');

    // Set category title
    const categoryTitleElement = document.getElementById('category-title');
    if (categoryTitleElement) {
        categoryTitleElement.textContent = categoryName;
    }

    // Fetch and render category items
    fetch('parsed_content.json')
        .then(response => response.json())
        .then(data => {
            const categoryItems = data[categoryName];
            const categoryContent = document.getElementById('category-items-grid');

            // Identify the target item based on the hash
            const targetId = window.location.hash.substring(1); // e.g., "item-devsecops"
            const targetItemIndex = categoryItems.findIndex(item => 
                `item-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` === targetId
            );

            // If the target item is found, move it to the top
            if (targetItemIndex !== -1) {
                const [targetItem] = categoryItems.splice(targetItemIndex, 1); // Remove the item from its original position
                categoryItems.unshift(targetItem); // Add it to the beginning of the array
            }

            // Now render the items
            categoryItems.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'category-item-card';
                itemCard.id = `item-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                console.log('Assigned ID:', itemCard.id); // Log the assigned ID

                const itemTitle = document.createElement('h3');
                itemTitle.innerHTML = `<a href="${item.link}" target="_blank" rel="nofollow">${item.name}</a>`;
                itemCard.appendChild(itemTitle);

                if (item.description) {
                    const description = document.createElement('p');
                    description.className = 'main-description';

                    // Apply the regex to the description before setting the textContent
                    const markdownLinkRegex = /\[([^\]]+)\]\(\s*([^)]+?)\s*\)/g;
                    const processedDescription = item.description.replace(markdownLinkRegex, '<a href="$2" target="_blank" rel="nofollow">$1</a>');

                    description.innerHTML = processedDescription; // Use innerHTML to render the HTML
                    itemCard.appendChild(description);
                }

                // Render sub-items if they exist
                if (item.sub_items && item.sub_items.length > 0) {
                    const subItemsList = document.createElement('ul');
                    subItemsList.className = 'sub-items';

                    item.sub_items.forEach(subItem => {
                        const subItemLi = document.createElement('li');
                        subItemLi.innerHTML = `<a href="${subItem.link}" target="_blank" rel="nofollow">${subItem.name}</a>`;
                        if (subItem.description) {
                            const subItemDesc = document.createElement('span');
                            subItemDesc.textContent = ` - ${subItem.description}`;
                            subItemLi.appendChild(subItemDesc);
                        }
                        subItemsList.appendChild(subItemLi);
                    });

                    itemCard.appendChild(subItemsList);
                }

                categoryContent.appendChild(itemCard);
            });

            // Check for hash in URL and scroll to item if present
            if (window.location.hash) {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Wait for content to render
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Add highlight animation
                        targetElement.classList.add('highlight-item');
                        // Remove highlight class after animation
                        setTimeout(() => {
                            targetElement.classList.remove('highlight-item');
                        }, 2000);
                    }, 100);
                }
            }
        })
        .catch(error => console.error('Error loading category items:', error));

    // Search functionality for category items
    const categorySearch = document.getElementById('category-search');
    const searchResults = document.getElementById('search-results');
    const clearCategorySearch = document.getElementById('clear-category-search');

    function performCategorySearch(query) {
        // Get all items from the original data
        return fetch('parsed_content.json')
            .then(response => response.json())
            .then(data => {
                const categoryItems = data[categoryName];
                const results = [];
                const queryLower = query.toLowerCase();

                categoryItems.forEach(item => {
                    const title = item.name.toLowerCase();
                    const description = (item.description || '').toLowerCase();
                    const subItems = (item.sub_items || [])
                        .map(subItem => `${subItem.name} ${subItem.description || ''}`).join(' ').toLowerCase();

                    // Calculate score based on matches
                    let score = 0;
                    if (title.includes(queryLower)) score += 3;
                    if (description.includes(queryLower)) score += 2;
                    if (subItems.includes(queryLower)) score += 1;

                    if (score > 0) {
                        results.push(item);
                    }
                });

                return results;
            });
    }

    function displayCategorySearchResults(results, query) {
        const categoryContent = document.getElementById('category-items-grid');
        const searchResults = document.getElementById('search-results');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<p>No results found</p>';
            searchResults.classList.add('active');
            categoryContent.style.display = 'none';
            clearCategorySearch.classList.add('visible');
            return;
        }

        // Clear current content
        categoryContent.innerHTML = '';

        // Create and append item cards
        results.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'category-item-card';
            // Add an ID for the item card based on the item name
            itemCard.id = `item-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            console.log('Assigned ID:', itemCard.id); // Log the assigned ID

            const itemTitle = document.createElement('h3');
            itemTitle.innerHTML = `<a href="${item.link}" target="_blank" rel="nofollow">${item.name}</a>`;
            itemCard.appendChild(itemTitle);

            if (item.description) {
                const itemDescription = document.createElement('p');
                itemDescription.className = 'main-description';
                
                // Convert Markdown links to HTML anchor tags
                const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                const processedDescription = item.description.replace(markdownLinkRegex, '<a href="$2" target="_blank" rel="nofollow">$1</a>');
                
                itemDescription.innerHTML = processedDescription;
                itemCard.appendChild(itemDescription);
            }

            if (item.sub_items && item.sub_items.length > 0) {
                const subItemsList = document.createElement('ul');
                subItemsList.className = 'sub-items';

                item.sub_items.forEach(subItem => {
                    const subItemLi = document.createElement('li');
                    subItemLi.innerHTML = `<a href="${subItem.link}" target="_blank" rel="nofollow">${subItem.name}</a>`;
                    if (subItem.description) {
                        const subItemDesc = document.createElement('span');
                        subItemDesc.textContent = ` - ${subItem.description}`;
                        subItemLi.appendChild(subItemDesc);
                    }
                    subItemsList.appendChild(subItemLi);
                });

                itemCard.appendChild(subItemsList);
            }

            categoryContent.appendChild(itemCard);
        });

        searchResults.innerHTML = `<p>${results.length} result(s) found</p>`;
        searchResults.classList.add('active');
        categoryContent.style.display = 'block';
        clearCategorySearch.classList.add('visible');
    }

    if (categorySearch) {
        categorySearch.addEventListener('input', function() {
            const query = this.value.trim();
            
            if (query === '') {
                clearCategorySearch.click();
                return;
            }

            performCategorySearch(query)
                .then(results => {
                    displayCategorySearchResults(results, query);
                })
                .catch(error => console.error('Error performing search:', error));
        });
    }

    if (clearCategorySearch) {
        clearCategorySearch.addEventListener('click', function() {
            categorySearch.value = '';
            searchResults.innerHTML = '';
            searchResults.classList.remove('active');
            
            // Restore original category content
            fetch('parsed_content.json')
                .then(response => response.json())
                .then(data => {
                    const categoryContent = document.getElementById('category-items-grid');
                    categoryContent.innerHTML = ''; // Clear current content
                    categoryContent.style.cssText = ''; // Reset all inline styles
                    categoryContent.className = 'category-items-grid'; // Reset to original class
                    const categoryItems = data[categoryName];

                    categoryItems.forEach(item => {
                        const itemCard = document.createElement('div');
                        itemCard.className = 'category-item-card';
                        // Add an ID for the item card based on the item name
                        itemCard.id = `item-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                        console.log('Assigned ID:', itemCard.id); // Log the assigned ID

                        const itemTitle = document.createElement('h3');
                        itemTitle.innerHTML = `<a href="${item.link}" target="_blank" rel="nofollow">${item.name}</a>`;
                        itemCard.appendChild(itemTitle);

                        if (item.description) {
                            const itemDescription = document.createElement('p');
                            itemDescription.className = 'main-description';
                            
                            // Convert Markdown links to HTML anchor tags
                            const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                            const processedDescription = item.description.replace(markdownLinkRegex, '<a href="$2" target="_blank" rel="nofollow">$1</a>');
                            
                            itemDescription.innerHTML = processedDescription;
                            itemCard.appendChild(itemDescription);
                        }

                        // Render sub-items if they exist
                        if (item.sub_items && item.sub_items.length > 0) {
                            const subItemsList = document.createElement('ul');
                            subItemsList.className = 'sub-items';

                            item.sub_items.forEach(subItem => {
                                const subItemLi = document.createElement('li');
                                subItemLi.innerHTML = `<a href="${subItem.link}" target="_blank" rel="nofollow">${subItem.name}</a>`;
                                if (subItem.description) {
                                    const subItemDesc = document.createElement('span');
                                    subItemDesc.textContent = ` - ${subItem.description}`;
                                    subItemLi.appendChild(subItemDesc);
                                }
                                subItemsList.appendChild(subItemLi);
                            });

                            itemCard.appendChild(subItemsList);
                        }

                        categoryContent.appendChild(itemCard);
                    });

                    clearCategorySearch.classList.remove('visible');
                })
                .catch(error => console.error('Error restoring category items:', error));
        });
    }
})();
