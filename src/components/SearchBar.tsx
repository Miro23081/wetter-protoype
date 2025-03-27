import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserLocationByIP } from '../services/weatherService';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [locationSuggestion, setLocationSuggestion] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await getUserLocationByIP();
        if (location) {
          setLocationSuggestion(location.city);
        }
      } catch (error) {
        console.error('Fehler beim Abrufen des Standorts:', error);
      }
    };

    getLocation();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && showSuggestion && locationSuggestion) {
      e.preventDefault();
      setSearchTerm(locationSuggestion);
      setShowSuggestion(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleSuggestionClick = () => {
    setSearchTerm(locationSuggestion);
    setShowSuggestion(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
    onSearch(locationSuggestion);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestion(true)}
          onBlur={() => setTimeout(() => setShowSuggestion(false), 200)}
          placeholder="Stadt eingeben..."
          className="w-full px-4 py-2 text-gray-700 bg-white/70 backdrop-blur-md rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {showSuggestion && locationSuggestion && searchTerm === '' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 mt-1 p-2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 z-10"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Dein Standort: <strong>{locationSuggestion}</strong>
              </span>
              {isMobile ? (
                <button
                  type="button"
                  onClick={handleSuggestionClick}
                  className="ml-2 px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Auswählen
                </button>
              ) : (
                <span className="text-xs text-gray-500">
                  Tab-Taste drücken zum Auswählen
                </span>
              )}
            </div>
          </motion.div>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
