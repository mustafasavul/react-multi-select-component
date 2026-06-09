import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { fetchData } from '../apiConfig';
import { Character } from '../components/MultiSelectAutoComplete/interface';
import toast from 'react-hot-toast';

export const useCharacterSearch = (searchQuery: string) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsLoading(true);
      setError('');

      fetchData<{ results: Character[] }>(
        `character?name=${debouncedSearchQuery}`
      )
        .then((data) => {
          setCharacters(data.results);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err?.message);
          toast.error(err?.message);
          setIsLoading(false);
        });
    } else {
      setCharacters([]);
    }
  }, [debouncedSearchQuery]);

  return { characters, isLoading, error };
};
