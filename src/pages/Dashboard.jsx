import { Link } from 'react-router-dom';
import { useFriends } from '../contexts/FriendsContext';
import FriendCard from '../components/FriendCard';

function Dashboard() {
  const { friends } = useFriends();

  const recentFriends = friends
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h1>Welcome to Friendos</h1>
        <p>Your personal friend relationship manager</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{friends.length}</h3>
          <p>Total Friends</p>
        </div>
        <div className="stat-card">
          <h3>0</h3>
          <p>Upcoming Reminders</p>
          <span className="coming-soon-badge">Coming Soon</span>
        </div>
        <div className="stat-card">
          <h3>0</h3>
          <p>Notes</p>
          <span className="coming-soon-badge">Coming Soon</span>
        </div>
      </div>

      {friends.length > 0 && (
        <div className="recent-friends-section">
          <div className="section-header">
            <h2>Recent Friends</h2>
            <Link to="/friends">View All</Link>
          </div>
          <div className="friends-grid">
            {recentFriends.map(friend => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        </div>
      )}

      {friends.length === 0 && (
        <div className="empty-dashboard">
          <h2>Get Started</h2>
          <p>Add your first friend to start tracking your relationships!</p>
          <Link to="/add-friend" className="button primary">Add Your First Friend</Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
