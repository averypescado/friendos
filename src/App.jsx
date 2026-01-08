import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FriendsProvider } from './contexts/FriendsContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import FriendProfile from './pages/FriendProfile';
import './App.css';

function App() {
  return (
    <FriendsProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/friends/:id" element={<FriendProfile />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FriendsProvider>
  );
}

export default App;
