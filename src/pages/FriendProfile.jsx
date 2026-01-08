import { useParams, useNavigate } from 'react-router-dom';
import { useFriends } from '../contexts/FriendsContext';

function FriendProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getFriend, deleteFriend } = useFriends();
  const friend = getFriend(id);

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

      <div className="profile-content">
        <h2>Notes</h2>
        <p className="coming-soon">Notes functionality coming in Phase 2!</p>
      </div>
    </div>
  );
}

export default FriendProfile;
