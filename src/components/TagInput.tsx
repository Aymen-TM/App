'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  suggestions: { id: string; name: string }[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
}

export default function TagInput({ 
  tags, 
  suggestions, 
  onAdd, 
  onRemove, 
  placeholder = 'Ajouter un vendeur...' 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input and already selected tags
  const filteredSuggestions = suggestions.filter(
    suggestion => 
      !tags.includes(suggestion.id) &&
      suggestion.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const matchingVendor = suggestions.find(
        v => v.name.toLowerCase() === inputValue.trim().toLowerCase()
      );
      
      if (matchingVendor) {
        onAdd(matchingVendor.id);
        setInputValue('');
        setShowSuggestions(false);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag on backspace when input is empty
      onRemove(tags[tags.length - 1]);
    }
  };

  const handleSuggestionClick = (vendorId: string, vendorName: string) => {
    onAdd(vendorId);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white min-h-[42px]">
        {tags.map(tagId => {
          const vendor = suggestions.find(v => v.id === tagId);
          if (!vendor) return null;
          
          return (
            <div 
              key={tagId} 
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {vendor.name}
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(tagId);
                }}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary-200 hover:bg-primary-300 text-primary-800"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          );
        })}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[150px] outline-none bg-transparent text-sm"
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((vendor) => (
            <div
              key={vendor.id}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSuggestionClick(vendor.id, vendor.name)}
            >
              {vendor.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
