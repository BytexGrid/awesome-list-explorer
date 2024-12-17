# Awesome List Explorer 🚀

A modern, intuitive web application for exploring GitHub's curated Awesome Lists. Find, organize, and bookmark high-quality development resources across various technology domains.

## ✨ Features

- 🔍 **Real-time Search**: Instantly find resources with our responsive search functionality
- 🌓 **Dynamic Theming**: Toggle between light and dark modes for comfortable viewing
- 📚 **Category Organization**: Browse resources by well-organized categories
- ⭐ **Star Count Display**: See GitHub star counts for listed repositories
- 👥 **Community Follows**: Track popular resources with community-driven follow counts
- 📱 **Responsive Design**: Seamless experience across all devices
- 🔖 **Bookmarking System**: Save your favorite resources for quick access
- 🚀 **Fast Performance**: Built with vanilla JavaScript for optimal speed
- 🔄 **Regular Updates**: Automatically syncs with the latest awesome lists

## 🎯 Quick Start

Visit [Awesome List Explorer](https://bytexgrid.github.io/awesome-list-explorer/) to start exploring!

Or run it locally:

```bash
# Clone the repository
git clone https://github.com/BytexGrid/awesome-list-explorer.git

# Navigate to the project directory
cd awesome-list-explorer

# Open index.html in your browser
# For example, using Python's built-in server:
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## 🏗️ Project Structure

```
awesome-list-explorer/
├── index.html              # Main entry point
├── category.html          # Category view page
├── styles.css            # Global styles
├── js/
│   ├── main.js          # Core functionality
│   ├── category.js      # Category page logic
│   └── follow-manager.js # Follow system handler
├── data/
│   └── parsed_content.json # Structured content data
└── media/               # Images and assets
```

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Storage**: Local Storage, Firebase Realtime Database
- **Hosting**: GitHub Pages
- **Data Source**: GitHub's Awesome Lists
- **Build Tools**: Node.js scripts for content parsing

## 🌟 Key Features Explained

### Search Functionality
- Real-time search results as you type
- Search within categories or across all content
- Highlighted search matches
- Smart result ranking system

### Theme System
- Automatic system preference detection
- Smooth transitions between themes
- Persistent theme selection
- Carefully chosen color schemes for both modes

### Follow System
- Firebase integration for real-time updates
- Anonymous follow counting
- Trending resources highlighting
- Community-driven popularity metrics

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Naming Conventions

### Categories
- Format: camelCase or kebab-case
- Example: `webDevelopment`, `data-science`

### Items
- Format: Clear, descriptive names
- Example: `JavaScriptResources`, `PythonLibraries`

### Subitems
- Format: Hierarchical naming
- Example: `JavaScriptResources.react`

## 🔮 Future Plans

- [ ] Advanced filtering options
- [ ] User accounts and preferences
- [ ] Resource rating system
- [ ] Personal notes and tags
- [ ] Export/Import bookmarks
- [ ] API access
- [ ] Mobile app version

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

- GitHub: [@BytexGrid](https://github.com/BytexGrid)
- Website: [bytexgrid.github.io/awesome-list-explorer](https://bytexgrid.github.io/awesome-list-explorer/)

---

<div align="center">
Made with ❤️ by BytexGrid
</div> 