import React, { useState } from 'react';
import DropdownMenu from './DropdownMenu';
import { useCharacterSearch } from '../../hooks/useCharacterSearch';
import { useCharacterSelection } from '../../hooks/useCharacterSelection';
import SelectedItems from './SelectedItems';
import Loader from '../Loader';
import s from './index.module.css';

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export interface HighlightedPart {
  text: string;
  highlighted: boolean;
}

const getHighlightedParts = (name: string, query: string): HighlightedPart[] => {
  if (!query) return [{ text: name, highlighted: false }];

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return name
    .split(regex)
    .filter(Boolean)
    .map((text) => ({
      text,
      highlighted: text.toLowerCase() === query.toLowerCase(),
    }));
};

export const MultiSelectAutocomplete = () => {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { characters, isLoading } = useCharacterSearch(inputValue);
  const { selectedCharacters, handleSelectCharacter, handleRemoveCharacter } =
    useCharacterSelection();

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' && !isDropdownOpen) {
      e.preventDefault();
      setIsDropdownOpen(true);
    }

    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className={s.multiSelectContainer}>
      {selectedCharacters.length > 0 && (
        <SelectedItems
          selectedCharacters={selectedCharacters}
          onRemoveCharacter={handleRemoveCharacter}
        />
      )}

      <input
        className={s.input}
        aria-label="Search for a character"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)}
        onKeyDown={handleInputKeyDown}
        type="text"
        placeholder="Search for a character"
      />

      {isLoading ? (
        <div className={s.multiSelectContainerLoader}>
          <Loader />
        </div>
      ) : (
        isDropdownOpen && (
          <DropdownMenu
            menuItems={characters}
            selectedMenuItems={selectedCharacters}
            onSelectCharacter={handleSelectCharacter}
            onRemoveCharacter={handleRemoveCharacter}
            getHighlightedParts={(name) => getHighlightedParts(name, inputValue)}
          />
        )
      )}
    </div>
  );
};

export default MultiSelectAutocomplete;
