import React, {useEffect, useEffectEvent, useState} from 'react';
import s from './index.module.css';
import DropdownItem from '../DropdownItem';
import {Character, SelectedCharacter} from '../interface';
import type { HighlightedPart } from '..';

interface DropdownMenuProps {
  menuItems: Character[];
  selectedMenuItems: SelectedCharacter[];
  onSelectCharacter: (character: Character) => void;
  onRemoveCharacter: (id: number) => void;
  getHighlightedParts: (name: string) => HighlightedPart[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
                                                     menuItems,
                                                     selectedMenuItems,
                                                     onSelectCharacter,
                                                     onRemoveCharacter,
                                                     getHighlightedParts,
                                                   }) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const handleFocusedSelection = useEffectEvent((index: number) => {
    const selectedItem = menuItems[index];
    if (!selectedItem) return;

    const isSelected = selectedMenuItems.some(item => item.id === selectedItem.id);
    isSelected ? onRemoveCharacter(selectedItem.id) : onSelectCharacter(selectedItem);
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (menuItems.length === 0) {
        setFocusedIndex(null);
        return;
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex(prevIndex => {
          const maxIndex = menuItems.length - 1;
          const nextIndex = event.key === 'ArrowDown'
              ? (prevIndex === null ? 0 : (prevIndex + 1) % menuItems.length)
              : (prevIndex === null ? maxIndex : (prevIndex - 1 + menuItems.length) % menuItems.length);
          return nextIndex;
        });
      } else if (event.key === 'Enter' && focusedIndex !== null) {
        handleFocusedSelection(focusedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, menuItems.length]);


  return (
      <div className={s.dropdown} tabIndex={-1}>
        {menuItems.map((el, index) => {
          return (
              <DropdownItem
                  key={el.id}
                  dropdownItem={el}
                  isSelected={selectedMenuItems.some(
                      (selected) => selected.id === el.id
                  )}
                  isFocused={index === focusedIndex}
                  onSelectCharacter={onSelectCharacter}
                  onRemoveCharacter={onRemoveCharacter}
                  getHighlightedParts={getHighlightedParts}
              />
          );
        })}
      </div>
  );
};

export default DropdownMenu;
