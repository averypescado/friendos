import { useState } from 'react';
import { useFriends } from '../contexts/FriendsContext';
import { useNotes } from '../contexts/NotesContext';
import { useReminders } from '../contexts/RemindersContext';

function Dashboard() {
  const { friends, getFriend } = useFriends();
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const { getUpcomingReminders } = useReminders();
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const upcomingReminders = getUpcomingReminders();
  const dueRemindersCount = upcomingReminders.filter(r => r.isDue).length;
  const sorted = notes.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); // descending (newest first)

  const getFriendName = (friendId) => {
    if (!friendId) return null;
    const friend = getFriend(friendId);
    return friend ? friend.name : 'Unknown';
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;

    setNewNote(value);
    setCursorPosition(cursorPos);

    // Check for @ mention
    const textBeforeCursor = value.substring(0, cursorPos);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1 && (atIndex === 0 || value[atIndex - 1] === ' ')) {
      const query = textBeforeCursor.substring(atIndex + 1);
      // Only show menu if query doesn't contain spaces (we're still typing the mention)
      if (!query.includes(' ')) {
        setMentionQuery(query);
        setShowMentionMenu(true);
        return;
      }
    }

    setShowMentionMenu(false);
  };

  const handleMentionSelect = (friend) => {
    const textBeforeCursor = newNote.substring(0, cursorPosition);
    const textAfterCursor = newNote.substring(cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    const beforeMention = newNote.substring(0, atIndex);
    const newText = `${beforeMention}@${friend.name} ${textAfterCursor}`;

    setNewNote(newText);
    setSelectedFriendId(friend.id);
    setShowMentionMenu(false);
    setMentionQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    let friendId = null;
    let noteContent = newNote;

    // If a friend was selected via mention menu, use that
    if (selectedFriendId) {
      const friend = getFriend(selectedFriendId);
      if (friend) {
        friendId = selectedFriendId;
        // Remove the @mention from the content (handles multi-word names)
        noteContent = newNote.replace(`@${friend.name}`, '').trim();
      }
    }

    const newNoteObj = {
      id: crypto.randomUUID(),
      friendId: friendId || null,
      content: noteContent.trim(),
      createdAt: new Date().toISOString(),
      reminder: null
    };

    addNote(newNoteObj);
    setNewNote('');
    setSelectedFriendId(null);
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


  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Welcome to Friendos</h1>
        <p>Your personal friend relationship manager</p>
      </div>

      <form onSubmit={handleSubmit} className="dashboard-note-input-form">
        {showMentionMenu && filteredFriends.length > 0 && (
          <div className="mention-menu">
            {filteredFriends.map(friend => (
              <div
                key={friend.id}
                className="mention-menu-item"
                onClick={() => handleMentionSelect(friend)}
              >
                <div className="mention-friend-avatar">
                  {friend.photo ? (
                    <img src={friend.photo} alt={friend.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {friend.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span>{friend.name}</span>
              </div>
            ))}
          </div>
        )}
        <div className="dashboard-note-input-wrapper">
          <textarea
            className="dashboard-note-textarea"
            value={newNote}
            onChange={handleInputChange}
            placeholder="Add a note... (use @ to mention a friend)"
            rows={1}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
          <button
            type="submit"
            className="dashboard-note-submit-btn"
            disabled={!newNote.trim()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 14L14 8L2 2L2 6.5L10 8L2 9.5L2 14Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </form>

      <div className="dashboard-notes-list">
        {sorted.map(note => {
          const friendName = getFriendName(note.friendId);
          return (
            <div key={note.id} className="dashboard-note-item">
              {editingId === note.id ? (
                <div className="dashboard-note-edit">
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
                <>
                  <div className="dashboard-note-content-wrapper">
                    <div className="dashboard-note-content">{note.content}</div>
                    {friendName && <div className="dashboard-note-friend">{friendName}</div>}
                  </div>
                  <div className="note-actions">
                    <button onClick={() => handleEdit(note)} className="note-action-btn" title="Edit">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(note.id)} className="note-action-btn delete" title="Complete">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {friends.length === 0 && (
        <div className="empty-dashboard">
          <h2>Get Started</h2>
          <p>Add your first friend to start tracking your relationships!</p>
          <p>Click "Add a friendo" in the sidebar to begin.</p>
        </div>
      )}


    </div>

    
  );
}

export default Dashboard;
