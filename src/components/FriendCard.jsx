import { Link } from 'react-router-dom';

function FriendCard({ friend }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/friends/${friend.id}`} className="friend-card">
      <div className="friend-photo">
        {friend.photo ? (
          <img src={friend.photo} alt={friend.name} />
        ) : (
          <div className="photo-placeholder">
            {friend.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="friend-info">
        <h3>{friend.name}</h3>
        {friend.birthday && (
          <p className="birthday">Birthday: {formatDate(friend.birthday)}</p>
        )}
        <p className="added-date">Added {formatDate(friend.createdAt)}</p>
      </div>
    </Link>
  );
}

export default FriendCard;
