import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { Habit } from './types';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const { value } = await Preferences.get({ key: 'habits' });
        const habitsFromStorage: Habit[] = value ? JSON.parse(value) : [];
        setHabits(habitsFromStorage);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  const updateHabits = async (newHabits: Habit[]) => {
    try {
      await Preferences.set({
        key: 'habits',
        value: JSON.stringify(newHabits),
      });
      setHabits(newHabits);
    } catch (err) {
      setError(err as Error);
    }
  }

  return [ habits, updateHabits, loading, error  ];
}

