import React, { useState } from 'react';
import { Star, StarOff, Trash2, ExternalLink, Search, Filter } from 'lucide-react';
import Button from '../common/Button';

interface SavedMessage {
  id: string;
  content: string;
  type: 'email' | 'cover-letter' | 'linkedin';
  created_at: string;
  is_starred: boolean;
  message_type?: string;
}

interface SavedMessagesProps {
  messages: SavedMessage[];
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
  onUse: (content: string) => void;
}

const SavedMessages: React.FC<SavedMessagesProps> = ({
  messages,
  onStar,
  onDelete,
  onUse
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'starred' | string>('all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getMessageTypeLabel = (message: SavedMessage) => {
    const type = message.type || message.message_type;
    switch (type) {
      case 'email':
        return 'Cold Email';
      case 'cover-letter':
        return 'Cover Letter';
      case 'linkedin':
        return 'LinkedIn Message';
      default:
        return type;
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'starred' && message.is_starred) ||
      (filter === (message.type || message.message_type));
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
          >
            <option value="all">All Messages</option>
            <option value="starred">Starred</option>
            <option value="email">Cold Emails</option>
            <option value="cover-letter">Cover Letters</option>
            <option value="linkedin">LinkedIn Messages</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-secondary-50 text-secondary-700 rounded-full text-sm font-medium mb-2">
                  {getMessageTypeLabel(message)}
                </span>
                <div className="text-sm text-gray-500">
                  Created on {formatDate(message.created_at)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onStar(message.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    message.is_starred
                      ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {message.is_starred ? (
                    <Star className="w-5 h-5" />
                  ) : (
                    <StarOff className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="prose prose-sm max-w-none mb-4">
              <p className="line-clamp-3">{message.content}</p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                icon={ExternalLink}
                onClick={() => onUse(message.content)}
              >
                Use Message
              </Button>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-600">No messages found</p>
            <p className="text-sm text-gray-500 mt-1">
              {search || filter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Your saved messages will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedMessages;