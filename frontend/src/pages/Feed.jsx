import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import Header from '../components/layout/Header';
import CreatePost from '../components/feed/CreatePost';
import Post from '../components/feed/Post';
import Sidebar from '../components/feed/Sidebar';
import RightPanel from '../components/feed/RightPanel';

const Feed = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/me');
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        fetchPosts();
      } catch (err) {
        console.error('Authentication failed:', err);
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    // Check localStorage first
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    verifyAuth();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      // For now, using mock data. Replace with actual API call
      const mockPosts = [
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

      setPosts(mockPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleCreatePost = (newPost) => {
    // Add new post to the beginning of the posts array
    setPosts([newPost, ...posts]);
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

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
              {loading ? (
                <div className="loading-posts">
                  <div className="spinner">
                    <div className="spinner-circle"></div>
                  </div>
                </div>
              ) : posts.length > 0 ? (
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