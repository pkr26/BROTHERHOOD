import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layouts/Header';
import CreatePost from '../components/feed/CreatePost';
import Post from '../components/feed/Post';
import Sidebar from '../components/feed/Sidebar';
import RightPanel from '../components/feed/RightPanel';
import { PageLoader } from '../components/common/Loading';
import logger from '../utils/logger';

const Feed = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  // Fetch posts using React Query
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        logger.info('Fetching posts for feed', { userId: user?.id });
        // TODO: Replace with actual API call when backend is ready
        // const response = await apiHelpers.get('/posts');
        // return response.data;

        // Mock data for now
        return [
        {
          id: 1,
          user: {
            username: 'john1234',
            age: 28,
            avatar: null,
            initials: 'JD'
          },
          content: 'Just joined Brotherhood! Excited to connect with everyone here. 🎉',
          timestamp: '2 hours ago',
          likes: 12,
          comments: 3,
          shares: 1,
          liked: false
        },
        {
          id: 2,
          user: {
            username: 'sara5678',
            age: 25,
            avatar: null,
            initials: 'SW'
          },
          content: 'Beautiful sunset today! Sometimes we need to pause and appreciate the little things in life.',
          image: 'https://picsum.photos/600/400?random=1',
          timestamp: '5 hours ago',
          likes: 45,
          comments: 8,
          shares: 2,
          liked: true
        },
        {
          id: 3,
          user: {
            username: 'mike9012',
            age: 32,
            avatar: null,
            initials: 'MJ'
          },
          content: 'Anyone up for a weekend coding session? Working on an interesting project and would love to collaborate!',
          timestamp: '1 day ago',
          likes: 23,
          comments: 15,
          shares: 5,
          liked: false
        }
      ];
      } catch (error) {
        logger.error('Failed to fetch posts', { userId: user?.id, error: error.message });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (newPost) => {
      try {
        logger.info('Creating new post', { userId: user?.id });
        // TODO: Replace with actual API call
        // const response = await apiHelpers.post('/posts', newPost);
        // return response.data;
        return newPost;
      } catch (error) {
        logger.error('Failed to create post', { userId: user?.id, error: error.message });
        throw error;
      }
    },
    onSuccess: (newPost) => {
      logger.info('Post created successfully', { userId: user?.id });
      // Update the posts cache
      queryClient.setQueryData(['posts'], (oldPosts) => [newPost, ...(oldPosts || [])]);
    },
    onError: (error) => {
      logger.error('Create post mutation failed', { userId: user?.id, error: error.message });
    }
  });

  // Like post mutation
  const likePostMutation = useMutation({
    mutationFn: async (postId) => {
      try {
        logger.info('Toggling like on post', { userId: user?.id, postId });
        // TODO: Replace with actual API call
        // const response = await apiHelpers.post(`/posts/${postId}/like`);
        // return response.data;
        return postId;
      } catch (error) {
        logger.error('Failed to like post', { userId: user?.id, postId, error: error.message });
        throw error;
      }
    },
    onMutate: async (postId) => {
      logger.debug('Optimistically updating like', { postId });
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const previousPosts = queryClient.getQueryData(['posts']);

      queryClient.setQueryData(['posts'], (oldPosts) =>
        oldPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                liked: !post.liked,
                likes: post.liked ? post.likes - 1 : post.likes + 1
              }
            : post
        )
      );

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      logger.warn('Like post failed, rolling back', { postId, error: err.message });
      // Rollback on error
      queryClient.setQueryData(['posts'], context.previousPosts);
    },
  });

  const handleCreatePost = (newPost) => {
    createPostMutation.mutate(newPost);
  };

  const handleLikePost = (postId) => {
    likePostMutation.mutate(postId);
  };

  const handleLogout = async () => {
    try {
      await logout(); // logout() already handles navigation to /login
    } catch (error) {
      logger.error('Logout failed from Feed page', { error: error.message });
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading feed..." />;
  }

  return (
    <div className="feed-container">
      <Header user={user} onLogout={handleLogout} />

      <main className="feed-main">
        <div className="feed-layout">
          {/* Left Sidebar */}
          <aside className="feed-sidebar-left">
            <Sidebar user={user} />
          </aside>

          {/* Main Feed Content */}
          <div className="feed-content">
            {/* Create Post */}
            <CreatePost user={user} onCreatePost={handleCreatePost} />

            {/* Posts Feed */}
            <div className="posts-container">
              {posts.length > 0 ? (
                posts.map(post => (
                  <Post
                    key={post.id}
                    post={post}
                    onLike={() => handleLikePost(post.id)}
                  />
                ))
              ) : (
                <div className="no-posts">
                  <p>No posts to show yet. Be the first to share something!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <aside className="feed-sidebar-right">
            <RightPanel />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Feed;
