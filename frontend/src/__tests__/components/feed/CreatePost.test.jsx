import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePost from '../../../components/feed/CreatePost';
import toast from 'react-hot-toast';
import * as validation from '../../../utils/validation';

jest.mock('react-hot-toast');
jest.mock('../../../utils/logger', () => ({
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

// Mock validation module
jest.mock('../../../utils/validation', () => ({
  sanitizeInput: jest.fn((input) => input),
}));

const mockUser = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  username: 'john1234',
  age: 28,
};

describe('CreatePost Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validation.sanitizeInput.mockImplementation((input) => input);
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<CreatePost user={mockUser} onCreatePost={jest.fn()} />);
      expect(screen.getByLabelText(/create a new post/i)).toBeInTheDocument();
    });

    it('should display user initials', () => {
      render(<CreatePost user={mockUser} onCreatePost={jest.fn()} />);
      expect(screen.getAllByText('JD')[0]).toBeInTheDocument();
    });

    it('should display user first name in placeholder', () => {
      render(<CreatePost user={mockUser} onCreatePost={jest.fn()} />);
      expect(screen.getByText(/what's on your mind, john/i)).toBeInTheDocument();
    });

    it('should display all footer buttons', () => {
      render(<CreatePost user={mockUser} onCreatePost={jest.fn()} />);
      expect(screen.getByLabelText(/need support/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/share growth/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/check-in/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/victory story/i)).toBeInTheDocument();
    });
  });

  describe('Modal Interactions', () => {
    it('should open modal when clicking create post button', () => {
      render(<CreatePost user={mockUser} onCreatePost={jest.fn()} />);

      const createButton = screen.getByLabelText(/create a new post/i);
      fireEvent.click(createButton);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Create Post')).toBeInTheDocument();
    });

    it('should close modal when clicking close button', () => {
      render(<CreatePost user={mockUser} onCreatePost={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      fireEvent.click(screen.getByLabelText(/close modal/i));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should close modal when clicking overlay', () => {
      render(<CreatePost user={mockUser} onCreatePost={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      const overlay = document.querySelector('.modal-overlay');
      fireEvent.click(overlay);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should show user full name and privacy in modal', () => {
      render(<CreatePost user={mockUser} onCreatePost={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByLabelText(/public post/i)).toBeInTheDocument();
    });
  });

  describe('Post Creation - Valid Cases', () => {
    it('should create post successfully with valid content', async () => {
      const mockOnCreatePost = jest.fn().mockResolvedValue({});
      render(<CreatePost user={mockUser} onCreatePost={mockOnCreatePost} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      fireEvent.change(textarea, { target: { value: 'This is a valid post' } });
      fireEvent.submit(textarea.closest('form'));

      await waitFor(() => {
        expect(mockOnCreatePost).toHaveBeenCalled();
        expect(toast.success).toHaveBeenCalledWith('Post created successfully!');
      });
    });

    it('should show character count when typing', async () => {
      const user = userEvent.setup();
      render(<CreatePost user={mockUser} onCreatePost={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      await user.type(textarea, 'Test');
      expect(screen.getByText(/4 \/ 5000 characters/i)).toBeInTheDocument();
    });

    it('should create post with correct data structure', async () => {
      const mockOnCreatePost = jest.fn().mockResolvedValue({});
      render(<CreatePost user={mockUser} onCreatePost={mockOnCreatePost} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      fireEvent.change(textarea, { target: { value: 'Test post' } });
      fireEvent.submit(textarea.closest('form'));

      await waitFor(() => {
        expect(mockOnCreatePost).toHaveBeenCalled();
      });

      const postData = mockOnCreatePost.mock.calls[0][0];
      expect(postData).toHaveProperty('id');
      expect(postData).toHaveProperty('user');
      expect(postData).toHaveProperty('content', 'Test post');
      expect(postData).toHaveProperty('timestamp', 'Just now');
      expect(postData).toHaveProperty('likes', 0);
      expect(postData).toHaveProperty('comments', 0);
      expect(postData).toHaveProperty('shares', 0);
      expect(postData).toHaveProperty('liked', false);
      expect(postData.user.username).toBe('john1234');
      expect(postData.user.age).toBe(28);
      expect(postData.user.initials).toBe('JD');
    });

    it('should close modal and clear textarea after successful post', async () => {
      const mockOnCreatePost = jest.fn().mockResolvedValue({});
      render(<CreatePost user={mockUser} onCreatePost={mockOnCreatePost} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      fireEvent.change(textarea, { target: { value: 'Test post' } });
      fireEvent.submit(textarea.closest('form'));

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // Reopen modal to check textarea
      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const newTextarea = screen.getByLabelText(/post content/i);
      expect(newTextarea.value).toBe('');
    });
  });

  describe('Post Creation - Validation', () => {
    it('should show error for empty post', async () => {
      const mockOnCreatePost = jest.fn();
      render(<CreatePost user={mockUser} onCreatePost={mockOnCreatePost} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      fireEvent.change(textarea, { target: { value: '' } });
      fireEvent.submit(textarea.closest('form'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Post content cannot be empty');
        expect(mockOnCreatePost).not.toHaveBeenCalled();
      });
    });

    it('should show error for post with only whitespace', async () => {
      const mockOnCreatePost = jest.fn();
      render(<CreatePost user={mockUser} onCreatePost={mockOnCreatePost} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      fireEvent.change(textarea, { target: { value: '   ' } });
      fireEvent.submit(textarea.closest('form'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Post content cannot be empty');
        expect(mockOnCreatePost).not.toHaveBeenCalled();
      });
    });

    it('should show error for post that is too long', async () => {
      const mockOnCreatePost = jest.fn();
      render(<CreatePost user={mockUser} onCreatePost={mockOnCreatePost} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      const longContent = 'a'.repeat(5001);
      fireEvent.change(textarea, { target: { value: longContent } });
      fireEvent.submit(textarea.closest('form'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Post is too long. Maximum 5000 characters allowed.');
        expect(mockOnCreatePost).not.toHaveBeenCalled();
      });
    });

    it('should prevent double submission', async () => {
      let resolvePromise;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      const mockOnCreatePost = jest.fn().mockReturnValue(promise);

      render(<CreatePost user={mockUser} onCreatePost={mockOnCreatePost} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      fireEvent.change(textarea, { target: { value: 'Test post' } });
      const form = textarea.closest('form');

      fireEvent.submit(form);
      fireEvent.submit(form);

      await waitFor(() => {
        expect(mockOnCreatePost).toHaveBeenCalledTimes(1);
      });

      resolvePromise();
    });

    it('should disable submit button when content is empty', () => {
      render(<CreatePost user={mockUser} onCreatePost={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const submitButton = screen.getByLabelText(/publish post/i);

      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when content is valid', () => {
      render(<CreatePost user={mockUser} onCreatePost={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);
      const submitButton = screen.getByLabelText(/publish post/i);

      fireEvent.change(textarea, { target: { value: 'Valid content' } });
      expect(submitButton).not.toBeDisabled();
    });

    it('should show posting state when submitting', async () => {
      let resolvePromise;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      const mockOnCreatePost = jest.fn().mockReturnValue(promise);

      render(<CreatePost user={mockUser} onCreatePost={mockOnCreatePost} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      fireEvent.change(textarea, { target: { value: 'Test post' } });
      fireEvent.submit(textarea.closest('form'));

      await waitFor(() => {
        expect(screen.getByText('Posting...')).toBeInTheDocument();
      });

      resolvePromise();
    });
  });

  describe('Error Handling', () => {
    it('should handle post creation error', async () => {
      const mockOnCreatePost = jest.fn().mockRejectedValue(new Error('Network error'));
      render(<CreatePost user={mockUser} onCreatePost={mockOnCreatePost} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      fireEvent.change(textarea, { target: { value: 'Test post' } });
      fireEvent.submit(textarea.closest('form'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to create post. Please try again.');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle user without username', async () => {
      const userWithoutUsername = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        age: 28,
      };
      const mockOnCreatePost = jest.fn().mockResolvedValue({});
      render(<CreatePost user={userWithoutUsername} onCreatePost={mockOnCreatePost} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      fireEvent.change(textarea, { target: { value: 'Test post' } });
      fireEvent.submit(textarea.closest('form'));

      await waitFor(() => {
        expect(mockOnCreatePost).toHaveBeenCalled();
      });

      const postData = mockOnCreatePost.mock.calls[0][0];
      expect(postData.user.username).toBe('anon1234');
    });

    it('should sanitize post content before submission', async () => {
      const mockOnCreatePost = jest.fn().mockResolvedValue({});
      render(<CreatePost user={mockUser} onCreatePost={mockOnCreatePost} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      fireEvent.change(textarea, { target: { value: '<script>alert("xss")</script>Test' } });
      fireEvent.submit(textarea.closest('form'));

      await waitFor(() => {
        expect(validation.sanitizeInput).toHaveBeenCalledWith('<script>alert("xss")</script>Test', {
          ALLOWED_TAGS: ['br'],
          ALLOWED_ATTR: [],
        });
      });
    });

    it('should have maxLength attribute on textarea', () => {
      render(<CreatePost user={mockUser} onCreatePost={jest.fn()} />);

      fireEvent.click(screen.getByLabelText(/create a new post/i));
      const textarea = screen.getByLabelText(/post content/i);

      expect(textarea).toHaveAttribute('maxLength', '5000');
    });
  });
});
