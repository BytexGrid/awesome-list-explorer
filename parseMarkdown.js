const fs = require('fs');
const path = require('path');

function parseMarkdown(content) {
    const lines = content.split('\n');
    const data = {
        Contents: [],
    };
    let currentCategoryName = null;
    let currentItem = null;
    const seenCategories = new Set();

    lines.forEach(line => {
        // Trim the line and skip empty lines
        line = line.trimEnd();
        if (!line.trim()) return;

        // Category detection
        if (line.startsWith('## ')) {
            currentCategoryName = line.replace('## ', '').trim();
            
            // Add to Contents array only if not seen before
            if (!seenCategories.has(currentCategoryName)) {
                data.Contents.push({
                    name: currentCategoryName,
                    link: `#${currentCategoryName.toLowerCase().replace(/\s+/g, '-')}`
                });
                seenCategories.add(currentCategoryName);
                data[currentCategoryName] = [];
            }
            currentItem = null;
        } 
        // Item detection (top-level items)
        else if (/^-\s/.test(line)) {
            if (!currentCategoryName) return;

            const [name, description] = line.slice(1).split(' - ');
            const linkMatch = name.match(/\[(.*?)\]\((.*?)\)/);
            const item = {
                name: linkMatch ? linkMatch[1].trim() : name.trim(),
                link: linkMatch ? linkMatch[2].trim() : '',
                description: description ? description.trim() : '',
                sub_items: []
            };

            data[currentCategoryName].push(item);
            currentItem = item;
        } 
        // Sub-item detection
        else if (/^\s+-\s/.test(line)) {
            if (!currentCategoryName || !currentItem) return;

            const [name, description] = line.trim().slice(1).split(' - ');
            const linkMatch = name.match(/\[(.*?)\]\((.*?)\)/);
            const subItem = {
                name: linkMatch ? linkMatch[1].trim() : name.trim(),
                link: linkMatch ? linkMatch[2].trim() : '',
                description: description ? description.trim() : ''
            };

            currentItem.sub_items.push(subItem);
        }
    });

    // Remove duplicate categories from Contents
    data.Contents = Array.from(new Set(data.Contents.map(c => c.name)))
        .map(name => data.Contents.find(c => c.name === name));

    return data;
}

// Function to find README.md file
function findReadmeFile(startDir) {
    const files = fs.readdirSync(startDir);
    const readmeFile = files.find(file => file.toLowerCase() === 'readme.md');
    
    if (readmeFile) {
        return path.join(startDir, readmeFile);
    }
    
    // If not found in current directory, check subdirectories
    for (const file of files) {
        const fullPath = path.join(startDir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            try {
                const result = findReadmeFile(fullPath);
                if (result) return result;
            } catch (err) {
                // Skip directories we can't access
                continue;
            }
        }
    }
    
    return null;
}

// Main execution
try {
    const readmePath = findReadmeFile(process.cwd());
    
    if (!readmePath) {
        console.error('No README.md file found.');
        process.exit(1);
    }

    const content = fs.readFileSync(readmePath, 'utf8');
    const structuredData = parseMarkdown(content);

    // Write the entire structured data to a JSON file
    fs.writeFileSync('parsed_content.json', JSON.stringify(structuredData, null, 4), 'utf8');
    console.log(`Structured data saved to parsed_content.json from ${readmePath}`);
} catch (err) {
    console.error('Error processing README:', err);
    process.exit(1);
}
