import React, { useState, useEffect } from 'react';
import ListCard from './components/ListCard';
import { fetchAwesomeLists, searchAwesomeLists, AwesomeList } from './services/awesomeApi';
import { MagnifyingGlassIcon, SunIcon, MoonIcon } from '@heroicons/react/24/solid';

function App() {
  const [lists, setLists] = useState<AwesomeList[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadLists = async () => {
      const awesomeLists = await fetchAwesomeLists();
      setLists(awesomeLists);
    };
    loadLists();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = await searchAwesomeLists(searchQuery);
    setLists(results);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            Awesome Lists Explorer
          </h1>
          <button 
            onClick={toggleDarkMode} 
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="mb-8 flex">
          <div className="relative flex-grow">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search awesome lists..."
              className="w-full px-4 py-2 pl-10 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
          <button 
            type="submit" 
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <ListCard key={list.full_name} list={list} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
