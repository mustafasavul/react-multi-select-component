import { useState } from 'react';
import {
  Character,
  SelectedCharacter,
} from '../components/MultiSelectAutoComplete/interface';

export const useCharacterSelection = () => {
  const [selectedCharacters, setSelectedCharacters] = useState<
    SelectedCharacter[]
  >([]);

  const handleSelectCharacter = (character: Character) => {
    if (!selectedCharacters.some((selected) => selected.id === character.id)) {
      setSelectedCharacters([
        ...selectedCharacters,
        { id: character.id, name: character.name },
      ]);
    }
  };

  const handleRemoveCharacter = (id: number) => {
    setSelectedCharacters(
      selectedCharacters.filter((character) => character.id !== id)
    );
  };

  return { selectedCharacters, handleSelectCharacter, handleRemoveCharacter };
};
