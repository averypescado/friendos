import { createContext, useContext, useState, useEffect } from 'react';

const FriendsContext = createContext();

export function useFriends() {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
}

export function FriendsProvider({ children }) {
  const [friends, setFriends] = useState(() => {
    const stored = localStorage.getItem('friendos_friends');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('friendos_friends', JSON.stringify(friends));
  }, [friends]);

  const addFriend = (friend) => {
    setFriends(prev => [...prev, friend]);
  };

  const updateFriend = (id, updates) => {
    setFriends(prev =>
      prev.map(friend => friend.id === id ? { ...friend, ...updates } : friend)
    );
  };

  const deleteFriend = (id) => {
    setFriends(prev => prev.filter(friend => friend.id !== id));
  };

  const getFriend = (id) => {
    return friends.find(friend => friend.id === id);
  };

  return (
    <FriendsContext.Provider value={{
      friends,
      addFriend,
      updateFriend,
      deleteFriend,
      getFriend
    }}>
      {children}
    </FriendsContext.Provider>
  );
}
