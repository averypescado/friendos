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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) {
        handleSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-note-form">
      <div className="note-input-wrapper">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a note about your friend..."
          className="note-textarea"
          rows={1}
        />
        <button
          type="submit"
          className="note-submit-btn"
          disabled={!content.trim()}
          aria-label="Submit note"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 14L14 8L2 2L2 6.5L10 8L2 9.5L2 14Z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </form>
  );
}

export default AddNoteForm;
