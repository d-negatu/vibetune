import React, { useEffect, useState } from 'react';

const MusicPostFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://us-central1-mapbot-9a988.cloudfunctions.net/getMusicFeed');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h2>Music Feed</h2>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <p><strong>{post.type.toUpperCase()}:</strong> {post.id}</p>
          <p>{post.note}</p>
          <p><em>Posted by {post.userId}</em></p>
        </div>
      ))}
    </div>
  );
};

export default MusicPostFeed;