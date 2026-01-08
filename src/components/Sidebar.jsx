import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFriends } from '../contexts/FriendsContext';

function Sidebar() {
  const { friends, addFriend } = useFriends();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFriend = () => {
    const name = prompt('Enter friend\'s name:');
    if (!name) return;

    const photo = prompt('Enter photo URL (optional):');
    const birthday = prompt('Enter birthday (YYYY-MM-DD) (optional):');

    const newFriend = {
      id: crypto.randomUUID(),
      name,
      photo: photo || null,
      birthday: birthday || null,
      createdAt: new Date().toISOString()
    };

    addFriend(newFriend);
    navigate(`/friends/${newFriend.id}`);
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
            className={`friend-item ${location.pathname === `/friends/${friend.id}` ? 'active' : ''}`}
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
