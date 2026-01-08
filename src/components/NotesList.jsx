import { useState } from 'react';
import { useNotes } from '../contexts/NotesContext';

function NotesList({ friendId }) {
  const { getNotesForFriend, deleteNote, updateNote } = useNotes();
  const notes = getNotesForFriend(friendId);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const formatDate = (date) => {
    const noteDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - noteDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return noteDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: noteDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = (id) => {
    if (editContent.trim()) {
      updateNote(id, { content: editContent.trim() });
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
    }
  };

  if (notes.length === 0) {
    return (
      <div className="notes-empty">
        <p>No notes yet. Add one below to get started!</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {notes.map(note => (
        <div key={note.id} className="note-item">
          <span className="note-date">{formatDate(note.createdAt)}</span>

          {editingId === note.id ? (
            <div className="note-edit">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="note-edit-textarea"
                autoFocus
              />
              <div className="note-edit-actions">
                <button onClick={() => handleSaveEdit(note.id)} className="button primary">
                  Save
                </button>
                <button onClick={handleCancelEdit} className="button secondary">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="note-content-row">
              <p className="note-content">{note.content}</p>
              <div className="note-actions">
                <button onClick={() => handleEdit(note)} className="note-action-btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(note.id)} className="note-action-btn delete">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default NotesList;
