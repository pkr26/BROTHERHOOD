import { useState } from 'react';
import { MdPhotoLibrary, MdPeople, MdMood, MdLocationOn } from 'react-icons/md';
import toast from 'react-hot-toast';
import { getUserInitials, getDisplayName, getFullName } from '../../utils/userHelpers';
import { sanitizeInput } from '../../utils/validation';
import logger from '../../utils/logger';

// Content validation constants
const MAX_POST_LENGTH = 5000;
const MIN_POST_LENGTH = 1;

/**
 * Create post component with modal
 *
 * @param {Object} props
 * @param {Object} props.user - Current user object
 * @param {Function} props.onCreatePost - Callback when post is created
 */
const CreatePost = ({ user, onCreatePost }) => {
  const [postContent, setPostContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedContent = postContent.trim();

    // Validation
    if (!trimmedContent) {
      logger.warn('Empty post content submitted', { userId: user?.id });
      toast.error('Post content cannot be empty');
      return;
    }

    if (trimmedContent.length < MIN_POST_LENGTH) {
      logger.warn('Post too short', { userId: user?.id, length: trimmedContent.length });
      toast.error('Post is too short');
      return;
    }

    if (trimmedContent.length > MAX_POST_LENGTH) {
      logger.warn('Post too long', { userId: user?.id, length: trimmedContent.length });
      toast.error(`Post is too long. Maximum ${MAX_POST_LENGTH} characters allowed.`);
      return;
    }

    // Prevent double submission
    if (isSubmitting) {
      logger.debug('Duplicate post submission prevented', { userId: user?.id });
      return;
    }

    setIsSubmitting(true);
    logger.info('Creating new post', { userId: user?.id, contentLength: trimmedContent.length });

    try {
      // Sanitize content to prevent XSS
      const sanitizedContent = sanitizeInput(trimmedContent, {
        ALLOWED_TAGS: ['br'], // Only allow line breaks
        ALLOWED_ATTR: [],
      });

      const newPost = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Temporary ID until backend assigns real one
        user: {
          username: user?.username || 'anon1234',
          age: user?.age,
          avatar: null,
          initials: getUserInitials(user),
        },
        content: sanitizedContent,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
      };

      await onCreatePost(newPost);
      logger.info('Post created successfully', { userId: user?.id, postId: newPost.id });
      setPostContent('');
      setIsExpanded(false);
      toast.success('Post created successfully!');
    } catch (error) {
      logger.error('Post creation failed', { error: error.message, userId: user?.id });
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <div className="user-avatar" aria-hidden="true">
          {getUserInitials(user)}
        </div>
        <button
          className="create-post-input hover-lift"
          onClick={() => setIsExpanded(true)}
          aria-label="Create a new post"
        >
          What's on your mind, {getDisplayName(user)}? Your brothers are here to
          listen...
        </button>
      </div>

      {isExpanded && (
        <div className="create-post-modal" role="dialog" aria-modal="true" aria-labelledby="create-post-title">
          <div
            className="modal-overlay"
            onClick={() => setIsExpanded(false)}
            aria-hidden="true"
          />
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="create-post-title">Create Post</h2>
              <button
                className="close-button"
                onClick={() => setIsExpanded(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="modal-user">
              <div className="user-avatar" aria-hidden="true">
                {getUserInitials(user)}
              </div>
              <div>
                <div className="user-name">{getFullName(user)}</div>
                <div className="post-privacy">
                  <span aria-label="Public post">🌐 Public</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                className="post-textarea"
                placeholder={`${getDisplayName(
                  user
                )}, this is a safe space. Share your struggles, victories, or just how you're feeling. Your brotherhood is here to support you through everything...`}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                autoFocus
                rows="5"
                maxLength={MAX_POST_LENGTH}
                aria-label="Post content"
                disabled={isSubmitting}
              />
              {postContent.length > 0 && (
                <div className="text-xs text-gray-500 px-6 -mt-2">
                  {postContent.length} / {MAX_POST_LENGTH} characters
                </div>
              )}

              <div className="modal-actions">
                <div className="add-to-post">
                  <span>Add to your post</span>
                  <div className="post-options" role="group" aria-label="Post options">
                    <button
                      type="button"
                      className="option-button hover-grow"
                      title="Photo/Video"
                      aria-label="Add photo or video"
                    >
                      <MdPhotoLibrary />
                    </button>
                    <button
                      type="button"
                      className="option-button hover-grow"
                      title="Tag Brothers"
                      aria-label="Tag brothers"
                    >
                      <MdPeople />
                    </button>
                    <button
                      type="button"
                      className="option-button hover-grow"
                      title="Mood"
                      aria-label="Add mood"
                    >
                      <MdMood />
                    </button>
                    <button
                      type="button"
                      className="option-button hover-grow"
                      title="Location"
                      aria-label="Add location"
                    >
                      <MdLocationOn />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="post-button"
                  disabled={!postContent.trim() || isSubmitting}
                  aria-label="Publish post"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="create-post-footer">
        <button className="footer-button hover-lift" aria-label="Need support">
          <span>🆘</span>
          <span>Need Support</span>
        </button>
        <button className="footer-button hover-lift" aria-label="Share growth">
          <span>📊</span>
          <span>Share Growth</span>
        </button>
        <button className="footer-button hover-lift" aria-label="Check-in">
          <span>✅</span>
          <span>Check-In</span>
        </button>
        <button className="footer-button hover-lift" aria-label="Victory story">
          <span>🏆</span>
          <span>Victory Story</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
