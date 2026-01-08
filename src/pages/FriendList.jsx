import { useFriends } from '../contexts/FriendsContext';
import { Link } from 'react-router-dom';
import FriendCard from '../components/FriendCard';

function FriendList() {
  const { friends } = useFriends();

  if (friends.length === 0) {
    return (
      <div className="empty-state">
        <h2>No friends yet</h2>
        <p>Start building your network by adding your first friend!</p>
        <Link to="/add-friend" className="button primary">Add Your First Friend</Link>
      </div>
    );
  }

  return (
    <div className="friends-page">
      <div className="page-header">
        <h2>My Friends ({friends.length})</h2>
        <Link to="/add-friend" className="button primary">Add Friend</Link>
      </div>

      <div className="friends-grid">
        {friends.map(friend => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
    </div>
  );
}

export default FriendList;
