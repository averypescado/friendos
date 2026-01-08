import { useParams, useNavigate } from 'react-router-dom';
import { useFriends } from '../contexts/FriendsContext';
import { useReminders } from '../contexts/RemindersContext';
import NotesList from '../components/NotesList';
import AddNoteForm from '../components/AddNoteForm';

function FriendProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFriend, deleteFriend } = useFriends();
  const { getReminderForFriend, setReminder, markReminderTriggered } = useReminders();
  const friend = getFriend(id);
  const currentReminder = getReminderForFriend(id);

  if (!friend) {
    return (
      <div className="empty-state">
        <h2>Friend not found</h2>
        <p>This friend may have been deleted.</p>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${friend.name}?`)) {
      deleteFriend(id);
      navigate('/');
    }
  };

  const handleReminderChange = (intervalDays) => {
    setReminder(id, intervalDays);
  };

  const getIntervalLabel = (days) => {
    if (days === 7) return '1 Week';
    if (days === 30) return '1 Month';
    if (days === 90) return '3 Months';
    return '';
  };

  return (
    <div className="friend-profile">
      <div className="profile-header-section">
        <div className="profile-photo-large">
          {friend.photo ? (
            <img src={friend.photo} alt={friend.name} />
          ) : (
            <div className="photo-placeholder-large">
              {friend.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="profile-info">
          <div className="profile-name-row">
            <h1>{friend.name}</h1>
            <div className="profile-actions">
              <button onClick={handleDelete} className="button danger small">
                Delete
              </button>
            </div>
          </div>
          {friend.birthday && (
            <p className="birthday">Birthday: {formatDate(friend.birthday)}</p>
          )}
          <p className="added-date">Friend since {formatDate(friend.createdAt)}</p>
        </div>

        <div className="reminder-dropdown-container">
          <label htmlFor="reminder-select">Check in</label>
          <select
            id="reminder-select"
            value={currentReminder?.intervalDays || ''}
            onChange={(e) => handleReminderChange(e.target.value ? parseInt(e.target.value) : null)}
            className="reminder-select"
          >
            <option value="">None</option>
            <option value="7">1 Week</option>
            <option value="30">1 Month</option>
            <option value="90">3 Months</option>
          </select>
        </div>
      </div>

      <div className="profile-content">
        <h2>Notes</h2>
        <NotesList friendId={id} />
        <AddNoteForm friendId={id} />

      </div>
    </div>
  );
}

export default FriendProfile;
