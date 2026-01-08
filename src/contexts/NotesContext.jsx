import { createContext, useContext, useState, useEffect } from 'react';

const NotesContext = createContext();

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(() => {
    const stored = localStorage.getItem('friendos_notes');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('friendos_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (note) => {
    setNotes(prev => [...prev, note]);
  };

  const updateNote = (id, updates) => {
    setNotes(prev =>
      prev.map(note => note.id === id ? { ...note, ...updates } : note)
    );
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const getNotesForFriend = (friendId) => {
    return notes
      .filter(note => note.friendId === friendId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getAllNotes = () => {
    return notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  return (
    <NotesContext.Provider value={{
      notes,
      addNote,
      updateNote,
      deleteNote,
      getNotesForFriend,
      getAllNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
}
