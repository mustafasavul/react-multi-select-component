import React, { useEffect, useRef, useState } from 'react';
import s from './index.module.css';
import { Character } from '../interface';
import type { HighlightedPart } from '..';

interface DropdownItemProps {
  dropdownItem: Character;
  isSelected: boolean;
  isFocused: boolean;
  onSelectCharacter: (character: Character) => void;
  onRemoveCharacter: (id: number) => void;
  getHighlightedParts: (name: string) => HighlightedPart[];
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  dropdownItem,
  isSelected,
  isFocused,
  onSelectCharacter,
  onRemoveCharacter,
  getHighlightedParts,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isImageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setImageVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const item = itemRef.current;

    if (item) {
      observer.observe(item);
    }

    return () => {
      if (item) {
        observer.unobserve(item);
      }
    };
  }, []);

  useEffect(() => {
    if (isFocused && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isFocused]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
      if (isSelected) {
        onRemoveCharacter(dropdownItem.id);
      } else {
        onSelectCharacter(dropdownItem);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isSelected) {
        onRemoveCharacter(dropdownItem.id);
      } else {
        onSelectCharacter(dropdownItem);
      }
    }
  };

  const highlightedParts = getHighlightedParts(dropdownItem.name);

  return (
    <div
      ref={itemRef}
      tabIndex={0}
      className={`${s.dropdownItems} ${isSelected ? s.selected : ''} ${
        isFocused ? s.focused : ''
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      aria-pressed={isSelected}
    >
      <div className={s.dropdownItemsInner}>
        <input
          type="checkbox"
          className={s.selectCheckbox}
          aria-label={`Select ${dropdownItem.name}`}
          checked={isSelected}
          onChange={() => {}}
          onClick={(e) => e.stopPropagation()}
        />

        {isImageVisible && (
          <img
            src={dropdownItem.image}
            alt={dropdownItem.name}
            className={s.dropdownItemsImage}
          />
        )}

        <div className={s.dropdownItemInfoWrapper}>
          <p className={s.dropdownItemsName}>
            {highlightedParts.map((part, index) =>
              part.highlighted ? (
                <mark key={`${part.text}-${index}`}>{part.text}</mark>
              ) : (
                part.text
              )
            )}
          </p>
          <p className={s.dropdownItemsInfo}>
            Episodes: {dropdownItem.episode.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DropdownItem;
