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
          <h1>{friend.name}</h1>
          {friend.birthday && (
            <p className="birthday">Birthday: {formatDate(friend.birthday)}</p>
          )}
          <p className="added-date">Friend since {formatDate(friend.createdAt)}</p>

          <div className="profile-actions">
            <button onClick={handleDelete} className="button danger">
              Delete Friend
            </button>
          </div>
        </div>
      </div>

      <div className="reminder-section">
        <h3>Check-in Reminder</h3>
        <p>Get reminded to reach out to {friend.name}</p>
        <div className="reminder-options">
          <button
            className={`reminder-btn ${currentReminder?.intervalDays === 7 ? 'active' : ''}`}
            onClick={() => handleReminderChange(currentReminder?.intervalDays === 7 ? null : 7)}
          >
            1 Week
          </button>
          <button
            className={`reminder-btn ${currentReminder?.intervalDays === 30 ? 'active' : ''}`}
            onClick={() => handleReminderChange(currentReminder?.intervalDays === 30 ? null : 30)}
          >
            1 Month
          </button>
          <button
            className={`reminder-btn ${currentReminder?.intervalDays === 90 ? 'active' : ''}`}
            onClick={() => handleReminderChange(currentReminder?.intervalDays === 90 ? null : 90)}
          >
            3 Months
          </button>
        </div>
        {currentReminder && (
          <p className="reminder-status">
            Reminder set for every {getIntervalLabel(currentReminder.intervalDays).toLowerCase()}
          </p>
        )}
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
