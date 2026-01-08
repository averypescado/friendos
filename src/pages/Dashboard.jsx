import { useFriends } from '../contexts/FriendsContext';
import { useNotes } from '../contexts/NotesContext';
import { useReminders } from '../contexts/RemindersContext';

function Dashboard() {
  const { friends } = useFriends();
  const { notes } = useNotes();
  const { getUpcomingReminders } = useReminders();

  const upcomingReminders = getUpcomingReminders();
  const dueRemindersCount = upcomingReminders.filter(r => r.isDue).length;

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
          <h3>{dueRemindersCount}</h3>
          <p>Due Reminders</p>
        </div>
        <div className="stat-card">
          <h3>{notes.length}</h3>
          <p>Notes</p>
        </div>
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
