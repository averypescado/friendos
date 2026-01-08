import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FriendsProvider } from './contexts/FriendsContext';
import { NotesProvider } from './contexts/NotesContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import FriendProfile from './pages/FriendProfile';
import AddFriend from './pages/AddFriend';
import './App.css';

function App() {
  return (
    <FriendsProvider>
      <NotesProvider>
        <Router>
          <div className="app">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add-friend" element={<AddFriend />} />
                <Route path="/friends/:id" element={<FriendProfile />} />
              </Routes>
            </main>
          </div>
        </Router>
      </NotesProvider>
    </FriendsProvider>
  );
}

export default App;
