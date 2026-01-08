import { useState } from 'react';
import { useNotes } from '../contexts/NotesContext';

function AddNoteForm({ friendId }) {
  const { addNote } = useNotes();
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    const newNote = {
      id: crypto.randomUUID(),
      friendId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      reminder: null
    };

    addNote(newNote);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-note-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a note about your friend..."
        className="note-textarea"
        rows={3}
      />
      <button type="submit" className="button primary" disabled={!content.trim()}>
        Add Note
      </button>
    </form>
  );
}

export default AddNoteForm;
