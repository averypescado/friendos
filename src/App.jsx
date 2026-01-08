import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FriendsProvider } from './contexts/FriendsContext';
import Dashboard from './pages/Dashboard';
import FriendList from './pages/FriendList';
import FriendProfile from './pages/FriendProfile';
import AddFriend from './pages/AddFriend';
import './App.css';

function App() {
  return (
    <FriendsProvider>
      <Router>
        <div className="app">
          <nav className="navbar">
            <h1>Friendos</h1>
            <div className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/friends">Friends</Link>
              <Link to="/add-friend">Add Friend</Link>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/friends" element={<FriendList />} />
              <Route path="/friends/:id" element={<FriendProfile />} />
              <Route path="/add-friend" element={<AddFriend />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FriendsProvider>
  );
}

export default App;
