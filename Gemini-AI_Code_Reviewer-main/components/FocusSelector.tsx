import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface FocusSelectorProps {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const FocusSelector: React.FC<FocusSelectorProps> = ({ options, selectedOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  const handleToggleOption = (option: string) => {
    const newSelected = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];
    onChange(newSelected);
  };
  
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  }

  const getButtonText = () => {
    if (selectedOptions.length === 0) return 'General Review';
    if (selectedOptions.length === 1) return selectedOptions[0];
    return `${selectedOptions.length} Areas Selected`;
  };

  return (
    <div ref={wrapperRef} className="relative w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full sm:w-44 bg-light-fill-primary dark:bg-dark-fill-primary hover:bg-light-fill-secondary dark:hover:bg-dark-fill-secondary text-light-label-primary dark:text-dark-label-primary font-medium py-2 px-3 rounded-full transition-colors duration-200 text-sm"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <SparklesIcon className="h-4 w-4 mr-2 text-light-label-secondary dark:text-dark-label-secondary"/>
        <span className="flex-grow text-left truncate">{getButtonText()}</span>
        <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform duration-200 text-light-label-tertiary dark:text-dark-label-tertiary ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 w-full sm:w-64 bg-light-bg-elevated/80 dark:bg-dark-bg-elevated/80 backdrop-blur-xl border border-light-separator dark:border-dark-separator rounded-xl shadow-xl z-10 animate-slide-up-fade">
          <div className="p-2">
            <div className="flex justify-between items-center px-2 pt-1 pb-2">
                <p className="text-xs font-semibold text-light-label-secondary dark:text-dark-label-secondary uppercase">Focus Review On</p>
                {selectedOptions.length > 0 && (
                    <button onClick={handleClear} className="text-xs font-medium text-light-accent dark:text-dark-accent hover:underline">Clear</button>
                )}
            </div>
            <ul role="listbox" className="max-h-60 overflow-auto">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleToggleOption(option)}
                  className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-light-fill-primary dark:hover:bg-dark-fill-primary"
                  role="option"
                  aria-selected={selectedOptions.includes(option)}
                >
                  <span className="font-medium text-sm text-light-label-primary dark:text-dark-label-primary">{option}</span>
                  {selectedOptions.includes(option) && <CheckIcon className="h-5 w-5 text-light-accent dark:text-dark-accent" />}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusSelector;