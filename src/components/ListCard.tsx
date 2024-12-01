import React from 'react';
import { AwesomeList } from '../services/awesomeApi';
import { StarIcon, LinkIcon } from '@heroicons/react/24/solid';

interface ListCardProps {
  list: AwesomeList;
}

const ListCard: React.FC<ListCardProps> = ({ list }) => {
  return (
    <div className="card flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {list.name}
        </h3>
        <div className="flex items-center space-x-2">
          <StarIcon className="h-5 w-5 text-yellow-500" />
          <span>{list.stars}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {list.description}
      </p>
      <div className="flex justify-between items-center mt-auto">
        <div className="flex space-x-2">
          {list.topics.slice(0, 3).map((topic) => (
            <span 
              key={topic} 
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
            >
              {topic}
            </span>
          ))}
        </div>
        <a 
          href={list.repository_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          <LinkIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
};

export default ListCard;
