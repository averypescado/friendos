import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFriends } from '../contexts/FriendsContext';
import { v4 as uuidv4 } from 'uuid';

function AddFriend() {
  const navigate = useNavigate();
  const { addFriend } = useFriends();
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    birthday: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFriend = {
      id: uuidv4(),
      name: formData.name,
      photo: formData.photo || null,
      birthday: formData.birthday || null,
      createdAt: new Date().toISOString()
    };

    addFriend(newFriend);
    navigate('/friends');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="add-friend-page">
      <h2>Add New Friend</h2>

      <form onSubmit={handleSubmit} className="friend-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter friend's name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="photo">Photo URL (optional)</label>
          <input
            type="url"
            id="photo"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="birthday">Birthday (optional)</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="button primary">Add Friend</button>
          <button
            type="button"
            className="button secondary"
            onClick={() => navigate('/friends')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddFriend;
