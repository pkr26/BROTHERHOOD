import React, { useState } from 'react';
import { MdThumbUp, MdComment } from 'react-icons/md';

const Post = ({ post, onLike }) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, {
        id: Date.now(),
        text: comment,
        user: 'You',
        timestamp: 'Just now'
      }]);
      setComment('');
    }
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-user">
          <div className="user-avatar">
            {post.user.initials}
          </div>
          <div className="user-info">
            <div className="user-name">{post.user.username} {post.user.age ? `(Age: ${post.user.age})` : ''}</div>
            <div className="post-timestamp">{post.timestamp}</div>
          </div>
        </div>
        <button className="post-menu">⋯</button>
      </div>

      {/* Post Content */}
      <div className="post-content">
        <p>{post.content}</p>
        {post.image && (
          <div className="post-image">
            <img src={post.image} alt="Post" />
          </div>
        )}
      </div>

      {/* Post Stats */}
      <div className="post-stats">
        <div className="stats-left">
          {post.likes > 0 && (
            <span className="like-count">
              🤝 {post.likes} {post.likes === 1 ? 'brother relates' : 'brothers relate'}
            </span>
          )}
        </div>
        <div className="stats-right">
          {post.comments > 0 && (
            <span className="comment-count">
              {post.comments} {post.comments === 1 ? 'brother helped' : 'brothers helped'}
            </span>
          )}
        </div>
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button
          className={`action-button ${post.liked ? 'liked' : ''}`}
          onClick={onLike}
        >
          <MdThumbUp />
          <span>I Relate</span>
        </button>
        <button
          className="action-button"
          onClick={() => setShowComments(!showComments)}
        >
          <MdComment />
          <span>Help Your Brother</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="post-comments">
          <form onSubmit={handleComment} className="comment-form">
            <div className="user-avatar small">U</div>
            <input
              type="text"
              className="comment-input"
              placeholder="Offer support or share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" className="comment-submit">
              ➤
            </button>
          </form>

          {comments.map(c => (
            <div key={c.id} className="comment">
              <div className="user-avatar small">
                {c.user[0]}
              </div>
              <div className="comment-content">
                <div className="comment-bubble">
                  <div className="comment-user">{c.user}</div>
                  <div className="comment-text">{c.text}</div>
                </div>
                <div className="comment-actions">
                  <span className="comment-time">{c.timestamp}</span>
                  <button className="comment-action">Helpful</button>
                  <button className="comment-action">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;