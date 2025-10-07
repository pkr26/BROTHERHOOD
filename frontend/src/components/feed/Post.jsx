import { useState } from 'react';
import { MdMoreVert } from 'react-icons/md';
import toast from 'react-hot-toast';
import { formatUserAge } from '../../utils/userHelpers';
import { sanitizeInput } from '../../utils/validation';
import logger from '../../utils/logger';

// Comment validation constants
const MAX_COMMENT_LENGTH = 500;

/**
 * Post card component
 *
 * @param {Object} props
 * @param {Object} props.post - Post data object
 * @param {Function} props.onLike - Like handler
 */
const Post = ({ post, onLike }) => {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleComment = (e) => {
    e.preventDefault();
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      logger.debug('Empty comment submitted', { postId: post.id });
      return;
    }

    if (trimmedComment.length > MAX_COMMENT_LENGTH) {
      logger.warn('Comment too long', { postId: post.id, length: trimmedComment.length });
      toast.error(`Comment is too long. Maximum ${MAX_COMMENT_LENGTH} characters allowed.`);
      return;
    }

    logger.info('Adding comment to post', { postId: post.id, commentLength: trimmedComment.length });

    // Sanitize comment to prevent XSS
    const sanitizedComment = sanitizeInput(trimmedComment, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });

    setComments([
      ...comments,
      {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: sanitizedComment,
        user: 'You',
        timestamp: 'Just now',
      },
    ]);
    setComment('');
    logger.debug('Comment added successfully', { postId: post.id });
  };

  return (
    <article className="post-card">
      {/* Post Header */}
      <header className="post-header">
        <div className="post-user">
          <div className="user-avatar" aria-hidden="true">
            {post.user.initials}
          </div>
          <div className="user-info">
            <div className="user-name">
              {post.user.username}{' '}
              {post.user.age && `(${formatUserAge(post.user.age)})`}
            </div>
            <time className="post-timestamp" dateTime={new Date().toISOString()}>
              {post.timestamp}
            </time>
          </div>
        </div>
        <button
          className="post-menu hover-grow"
          aria-label="Post options"
          aria-haspopup="true"
        >
          <MdMoreVert />
        </button>
      </header>

      {/* Post Content */}
      <div className="post-content">
        <p dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.image && (
          <div className="post-image">
            <img
              src={post.image}
              alt="Post attachment"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                toast.error('Failed to load image');
              }}
            />
          </div>
        )}
      </div>

      {/* Post Stats */}
      <div className="post-stats" role="group" aria-label="Post statistics">
        <div className="stats-left">
          {post.likes > 0 && (
            <button
              className="like-count"
              onClick={onLike}
              aria-label={`${post.likes} Hell Yeah Brother`}
            >
              <span className="text-lg">🔥</span>
              <span>
                {post.likes}
              </span>
            </button>
          )}
        </div>
        <div className="stats-right">
          {(comments.length > 0 || post.comments > 0) && (
            <button
              className="comment-count"
              onClick={() => setShowComments(!showComments)}
              aria-label={`${comments.length || post.comments} ${
                (comments.length || post.comments) === 1 ? 'comment' : 'comments'
              }`}
            >
              <span className="text-lg">💬</span>
              <span>
                {comments.length || post.comments} {(comments.length || post.comments) === 1 ? 'comment' : 'comments'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Post Actions */}
      <div className="post-actions" role="group" aria-label="Post actions">
        <button
          className={`action-button hover-lift ${post.liked ? 'liked' : ''}`}
          onClick={onLike}
          aria-label={post.liked ? 'Remove support' : 'Hell yeah Brother'}
          aria-pressed={post.liked}
        >
          <span className="text-xl">{post.liked ? '🔥' : '🔥'}</span>
          <span className={post.liked ? 'font-semibold' : ''}>Hell Yeah Brother</span>
        </button>
        <button
          className="action-button hover-lift"
          onClick={() => setShowComments(!showComments)}
          aria-label="Help your brother"
          aria-expanded={showComments}
        >
          <span className="text-xl">💬</span>
          <span>Help Your Brother</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="post-comments">
          <form onSubmit={handleComment} className="comment-form">
            <div className="user-avatar small" aria-hidden="true">
              U
            </div>
            <input
              type="text"
              className="comment-input"
              placeholder="Offer support or share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={MAX_COMMENT_LENGTH}
              aria-label="Write a comment"
            />
            <button type="submit" className="comment-submit" aria-label="Submit comment">
              ➤
            </button>
          </form>

          {comments.map((c) => (
            <div key={c.id} className="comment">
              <div className="user-avatar small" aria-hidden="true">
                {c.user[0]}
              </div>
              <div className="comment-content">
                <div className="comment-bubble">
                  <div className="comment-user">{c.user}</div>
                  <div className="comment-text" dangerouslySetInnerHTML={{ __html: c.text }} />
                </div>
                <div className="comment-actions">
                  <time className="comment-time" dateTime={new Date().toISOString()}>
                    {c.timestamp}
                  </time>
                  <button className="comment-action">Helpful</button>
                  <button className="comment-action">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
};

export default Post;
