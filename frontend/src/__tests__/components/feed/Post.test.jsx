import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Post from '../../../components/feed/Post';
import toast from 'react-hot-toast';
import * as validation from '../../../utils/validation';

jest.mock('react-hot-toast');
jest.mock('../../../utils/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
}));

// Mock validation module
jest.mock('../../../utils/validation', () => ({
  sanitizeInput: jest.fn((input) => input),
}));

const mockPost = {
  id: 1,
  user: {
    username: 'john1234',
    age: 28,
    avatar: null,
    initials: 'JD',
  },
  content: 'Test post content',
  timestamp: '2 hours ago',
  likes: 12,
  comments: 3,
  shares: 1,
  liked: false,
};

describe('Post Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validation.sanitizeInput.mockImplementation((input) => input);
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);
      expect(screen.getByText('Test post content')).toBeInTheDocument();
    });

    it('should display post content', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);
      expect(screen.getByText('Test post content')).toBeInTheDocument();
    });

    it('should display user information', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);
      expect(screen.getByText((content, element) => {
        return element.className === 'user-name' && content.includes('john1234');
      })).toBeInTheDocument();
    });

    it('should display timestamp', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);
      expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    });

    it('should display user initials in avatar', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);
      expect(screen.getAllByText('JD')[0]).toBeInTheDocument();
    });

    it('should display user age when provided', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);
      // Age is formatted, check it exists in the user name area
      const userNameElement = screen.getByText((content, element) => {
        return element?.className === 'user-name';
      });
      expect(userNameElement.textContent).toContain('28');
    });

    it('should render without age when not provided', () => {
      const postWithoutAge = {
        ...mockPost,
        user: { ...mockPost.user, age: undefined },
      };
      render(<Post post={postWithoutAge} onLike={jest.fn()} />);
      expect(screen.getByText(/^john1234$/)).toBeInTheDocument();
    });

    it('should display like count when greater than 0', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);
      expect(screen.getByLabelText(/12 hell yeah brother/i)).toBeInTheDocument();
    });

    it('should not display like count when 0', () => {
      const postWithoutLikes = { ...mockPost, likes: 0 };
      render(<Post post={postWithoutLikes} onLike={jest.fn()} />);
      // The like button still exists, but the like COUNT should not be displayed
      expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
    });

    it('should render with image when provided', () => {
      const postWithImage = {
        ...mockPost,
        image: 'https://example.com/image.jpg',
      };
      render(<Post post={postWithImage} onLike={jest.fn()} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should hide image and show error toast when image fails to load', () => {
      const postWithImage = {
        ...mockPost,
        image: 'https://example.com/broken-image.jpg',
      };
      render(<Post post={postWithImage} onLike={jest.fn()} />);

      const img = screen.getByRole('img');
      fireEvent.error(img);

      expect(toast.error).toHaveBeenCalledWith('Failed to load image');
      expect(img.style.display).toBe('none');
    });

    it('should display post menu button', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);
      expect(screen.getByLabelText(/post options/i)).toBeInTheDocument();
    });

    it('should show liked state correctly', () => {
      const likedPost = { ...mockPost, liked: true };
      render(<Post post={likedPost} onLike={jest.fn()} />);

      const likeButton = screen.getByLabelText(/remove support/i);
      expect(likeButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should show unliked state correctly', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);

      const likeButtons = screen.getAllByLabelText(/hell yeah brother/i);
      const actionButton = likeButtons.find(btn => btn.className?.includes('action-button'));
      expect(actionButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Like Functionality', () => {
    it('should call onLike when clicking like button', () => {
      const mockOnLike = jest.fn();
      render(<Post post={mockPost} onLike={mockOnLike} />);

      const likeButtons = screen.getAllByLabelText(/hell yeah brother/i);
      const actionButton = likeButtons.find(btn => btn.className?.includes('action-button'));
      fireEvent.click(actionButton);

      expect(mockOnLike).toHaveBeenCalledTimes(1);
    });

    it('should call onLike when clicking on like count', () => {
      const mockOnLike = jest.fn();
      render(<Post post={mockPost} onLike={mockOnLike} />);

      const likeCount = screen.getByLabelText(/12 hell yeah brother/i);
      fireEvent.click(likeCount);

      expect(mockOnLike).toHaveBeenCalled();
    });
  });

  describe('Comments Section', () => {
    it('should hide comments section by default', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);
      expect(screen.queryByLabelText(/write a comment/i)).not.toBeInTheDocument();
    });

    it('should show comments section when clicking comment button', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);

      const commentButton = screen.getByLabelText(/help your brother/i);
      fireEvent.click(commentButton);

      expect(screen.getByLabelText(/write a comment/i)).toBeInTheDocument();
    });

    it('should toggle comments section visibility', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);

      const commentButton = screen.getByLabelText(/help your brother/i);

      fireEvent.click(commentButton);
      expect(screen.getByLabelText(/write a comment/i)).toBeInTheDocument();

      fireEvent.click(commentButton);
      expect(screen.queryByLabelText(/write a comment/i)).not.toBeInTheDocument();
    });

    it('should show comment count when greater than 0', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);
      expect(screen.getByLabelText(/3 comments/i)).toBeInTheDocument();
    });

    it('should show singular "comment" when count is 1', () => {
      const postWithOneComment = { ...mockPost, comments: 1 };
      render(<Post post={postWithOneComment} onLike={jest.fn()} />);
      expect(screen.getByLabelText(/1 comment$/i)).toBeInTheDocument();
    });

    it('should not show comment count when 0', () => {
      const postWithoutComments = { ...mockPost, comments: 0 };
      render(<Post post={postWithoutComments} onLike={jest.fn()} />);
      expect(screen.queryByText(/0 comment/i)).not.toBeInTheDocument();
    });

    it('should add a comment successfully', async () => {
      const user = userEvent.setup();
      render(<Post post={mockPost} onLike={jest.fn()} />);

      // Open comments
      fireEvent.click(screen.getByLabelText(/help your brother/i));

      const commentInput = screen.getByLabelText(/write a comment/i);
      await user.type(commentInput, 'Great post!');

      const submitButton = screen.getByLabelText(/submit comment/i);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Great post!')).toBeInTheDocument();
        expect(screen.getByText('You')).toBeInTheDocument();
        expect(screen.getByText('Just now')).toBeInTheDocument();
      });
    });

    it('should clear input after submitting comment', async () => {
      const user = userEvent.setup();
      render(<Post post={mockPost} onLike={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/help your brother/i));

      const commentInput = screen.getByLabelText(/write a comment/i);
      await user.type(commentInput, 'Test comment');

      fireEvent.click(screen.getByLabelText(/submit comment/i));

      await waitFor(() => {
        expect(commentInput.value).toBe('');
      });
    });

    it('should not add empty comment', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/help your brother/i));

      const commentInput = screen.getByLabelText(/write a comment/i);
      const submitButton = screen.getByLabelText(/submit comment/i);

      fireEvent.change(commentInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      expect(screen.queryByText('You')).not.toBeInTheDocument();
    });

    it('should not add whitespace-only comment', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/help your brother/i));

      const commentInput = screen.getByLabelText(/write a comment/i);
      const submitButton = screen.getByLabelText(/submit comment/i);

      fireEvent.change(commentInput, { target: { value: '   ' } });
      fireEvent.click(submitButton);

      expect(screen.queryByText('You')).not.toBeInTheDocument();
    });

    it('should show error for comment that is too long', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/help your brother/i));

      const commentInput = screen.getByLabelText(/write a comment/i);
      const submitButton = screen.getByLabelText(/submit comment/i);

      const longComment = 'a'.repeat(501);
      fireEvent.change(commentInput, { target: { value: longComment } });
      fireEvent.click(submitButton);

      expect(toast.error).toHaveBeenCalledWith('Comment is too long. Maximum 500 characters allowed.');
    });

    it('should sanitize comment input', async () => {
      const user = userEvent.setup();
      render(<Post post={mockPost} onLike={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/help your brother/i));

      const commentInput = screen.getByLabelText(/write a comment/i);
      await user.type(commentInput, '<script>alert("xss")</script>Comment');

      fireEvent.click(screen.getByLabelText(/submit comment/i));

      await waitFor(() => {
        expect(validation.sanitizeInput).toHaveBeenCalledWith('<script>alert("xss")</script>Comment', {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
        });
      });
    });

    it('should have maxLength attribute on comment input', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/help your brother/i));

      const commentInput = screen.getByLabelText(/write a comment/i);
      expect(commentInput).toHaveAttribute('maxLength', '500');
    });

    it('should display comment actions (time, Helpful, Reply)', async () => {
      const user = userEvent.setup();
      render(<Post post={mockPost} onLike={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/help your brother/i));

      const commentInput = screen.getByLabelText(/write a comment/i);
      await user.type(commentInput, 'Test comment');
      fireEvent.click(screen.getByLabelText(/submit comment/i));

      await waitFor(() => {
        expect(screen.getByText('Just now')).toBeInTheDocument();
        expect(screen.getByText('Helpful')).toBeInTheDocument();
        expect(screen.getByText('Reply')).toBeInTheDocument();
      });
    });

    it('should show comment count with added comments', async () => {
      const user = userEvent.setup();
      const postWithoutComments = { ...mockPost, comments: 0 };
      render(<Post post={postWithoutComments} onLike={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/help your brother/i));

      const commentInput = screen.getByLabelText(/write a comment/i);
      await user.type(commentInput, 'First comment');
      fireEvent.click(screen.getByLabelText(/submit comment/i));

      await waitFor(() => {
        expect(screen.getByLabelText(/1 comment/i)).toBeInTheDocument();
      });
    });

    it('should toggle comments section via comment count button', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);

      const commentCountButton = screen.getByLabelText(/3 comments/i);

      fireEvent.click(commentCountButton);
      expect(screen.getByLabelText(/write a comment/i)).toBeInTheDocument();

      fireEvent.click(commentCountButton);
      expect(screen.queryByLabelText(/write a comment/i)).not.toBeInTheDocument();
    });

    it('should submit comment via form submission', async () => {
      const user = userEvent.setup();
      render(<Post post={mockPost} onLike={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/help your brother/i));

      const commentInput = screen.getByLabelText(/write a comment/i);
      await user.type(commentInput, 'Test via form submit');

      const form = commentInput.closest('form');
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Test via form submit')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);

      expect(screen.getByLabelText(/post options/i)).toBeInTheDocument();
      expect(screen.getAllByLabelText(/hell yeah brother/i).length).toBeGreaterThan(0);
      expect(screen.getByLabelText(/help your brother/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/post statistics/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/post actions/i)).toBeInTheDocument();
    });

    it('should have proper aria-pressed attribute for like button', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);

      const likeButtons = screen.getAllByLabelText(/hell yeah brother/i);
      const actionButton = likeButtons.find(btn => btn.className.includes('action-button'));
      expect(actionButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should have proper aria-expanded attribute for comment button', () => {
      render(<Post post={mockPost} onLike={jest.fn()} />);

      const commentButton = screen.getByLabelText(/help your brother/i);
      expect(commentButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(commentButton);
      expect(commentButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have semantic article element', () => {
      const { container } = render(<Post post={mockPost} onLike={jest.fn()} />);
      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('should have semantic time element', () => {
      const { container } = render(<Post post={mockPost} onLike={jest.fn()} />);
      const timeElement = container.querySelector('time');
      expect(timeElement).toBeInTheDocument();
      expect(timeElement).toHaveAttribute('dateTime');
    });
  });
});
