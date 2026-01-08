import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFriends } from '../contexts/FriendsContext';
import { useReminders } from '../contexts/RemindersContext';
import { useNotes } from '../contexts/NotesContext';

function Sidebar() {
  const { friends, addFriend } = useFriends();
  const { getUpcomingReminders } = useReminders();
  const { getNotesForFriend } = useNotes();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const upcomingReminders = getUpcomingReminders();
  const dueReminderFriendIds = new Set(
    upcomingReminders.filter(r => r.isDue).map(r => r.friendId)
  );

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = () => {
    navigate('/add-friend');
  };

  return (
    <aside className="sidebar">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        Home
      </Link>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Friends"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="friends-list">
        {filteredFriends.map(friend => (
          <Link
            key={friend.id}
            to={`/friends/${friend.id}`}
            className={`friend-item ${location.pathname === `/friends/${friend.id}` ? 'active' : ''} ${dueReminderFriendIds.has(friend.id) ? 'has-reminder' : ''}`}
          >
            <div className="friend-avatar">
              {friend.photo ? (
                <img src={friend.photo} alt={friend.name} />
              ) : (
                <div className="avatar-placeholder">
                  {friend.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="friend-name">{friend.name}</span>
            <span className="note-count-badge" title={`${getNotesForFriend(friend.id).length} notes`}>
              {getNotesForFriend(friend.id).length}
            </span>
            {dueReminderFriendIds.has(friend.id) && (
              <span className="reminder-indicator" title="Reminder due">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="6" cy="6" r="6" fill="#646cff"/>
                </svg>
              </span>
            )}
          </Link>
        ))}
      </div>

      <button onClick={handleAddFriend} className="add-friend-btn">
        Add a friendo
      </button>
    </aside>
  );
}

export default Sidebar;
