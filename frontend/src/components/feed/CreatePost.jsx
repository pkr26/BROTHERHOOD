import React, { useState } from 'react';

const CreatePost = ({ user, onCreatePost }) => {
  const [postContent, setPostContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.first_name ? user.first_name[0] : '';
    const lastInitial = user.last_name ? user.last_name[0] : '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postContent.trim()) {
      const newPost = {
        id: Date.now(),
        user: {
          username: user?.username || 'anon1234',
          age: calculateAge(user?.date_of_birth),
          avatar: null,
          initials: getUserInitials()
        },
        content: postContent,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false
      };

      onCreatePost(newPost);
      setPostContent('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <div className="user-avatar">
          {getUserInitials()}
        </div>
        <button
          className="create-post-input"
          onClick={() => setIsExpanded(true)}
        >
          How are you feeling today, {user?.first_name}?
        </button>
      </div>

      {isExpanded && (
        <div className="create-post-modal">
          <div className="modal-overlay" onClick={() => setIsExpanded(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create Post</h2>
              <button
                className="close-button"
                onClick={() => setIsExpanded(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-user">
              <div className="user-avatar">
                {getUserInitials()}
              </div>
              <div>
                <div className="user-name">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="post-privacy">
                  🌐 Public
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                className="post-textarea"
                placeholder={`How are you feeling today, ${user?.first_name}? Share what's on your mind...`}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                autoFocus
                rows="4"
              />

              <div className="modal-actions">
                <div className="add-to-post">
                  <span>Add to your post</span>
                  <div className="post-options">
                    <button type="button" className="option-button" title="Photo/Video">
                      📷
                    </button>
                    <button type="button" className="option-button" title="Tag Friends">
                      👥
                    </button>
                    <button type="button" className="option-button" title="Feeling">
                      😊
                    </button>
                    <button type="button" className="option-button" title="Location">
                      📍
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="post-button"
                  disabled={!postContent.trim()}
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="create-post-footer">
        <button className="footer-button">
          <span className="button-icon">📖</span>
          <span>Share Your Story</span>
        </button>
        <button className="footer-button">
          <span className="button-icon">✓</span>
          <span>Check-In</span>
        </button>
        <button className="footer-button">
          <span className="button-icon">🤝</span>
          <span>Ask for Support</span>
        </button>
        <button className="footer-button">
          <span className="button-icon">🏆</span>
          <span>Share a Win</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePost;