import { createContext, useContext, useState, useEffect } from 'react';

const RemindersContext = createContext();

export function useReminders() {
  const context = useContext(RemindersContext);
  if (!context) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
}

export function RemindersProvider({ children }) {
  const [reminders, setReminders] = useState(() => {
    const stored = localStorage.getItem('friendos_reminders');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('friendos_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const setReminder = (friendId, intervalDays) => {
    // Remove existing reminder for this friend if any
    const filtered = reminders.filter(r => r.friendId !== friendId);

    if (intervalDays === null) {
      // Just remove the reminder
      setReminders(filtered);
      return;
    }

    const newReminder = {
      id: crypto.randomUUID(),
      friendId,
      intervalDays,
      lastTriggered: new Date().toISOString(),
      active: true
    };

    setReminders([...filtered, newReminder]);
  };

  const getReminderForFriend = (friendId) => {
    return reminders.find(r => r.friendId === friendId && r.active);
  };

  const markReminderTriggered = (friendId) => {
    setReminders(prev =>
      prev.map(r =>
        r.friendId === friendId
          ? { ...r, lastTriggered: new Date().toISOString() }
          : r
      )
    );
  };

  const getDueReminders = () => {
    const now = new Date();
    return reminders.filter(reminder => {
      if (!reminder.active) return false;

      const lastTriggered = new Date(reminder.lastTriggered);
      const daysSinceTriggered = (now - lastTriggered) / (1000 * 60 * 60 * 24);

      return daysSinceTriggered >= reminder.intervalDays;
    });
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    return reminders
      .filter(r => r.active)
      .map(reminder => {
        const lastTriggered = new Date(reminder.lastTriggered);
        const nextDue = new Date(lastTriggered);
        nextDue.setDate(nextDue.getDate() + reminder.intervalDays);

        const daysUntilDue = Math.ceil((nextDue - now) / (1000 * 60 * 60 * 24));

        return {
          ...reminder,
          nextDue,
          daysUntilDue,
          isDue: daysUntilDue <= 0
        };
      })
      .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  };

  return (
    <RemindersContext.Provider value={{
      reminders,
      setReminder,
      getReminderForFriend,
      markReminderTriggered,
      getDueReminders,
      getUpcomingReminders
    }}>
      {children}
    </RemindersContext.Provider>
  );
}
