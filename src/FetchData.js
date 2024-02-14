import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { CircularProgress, Button, TextField, Snackbar, Box, List, ListItem, ListItemText } from '@mui/material';

// Function to fetch posts
const fetchPosts = async () => {
  const response = await fetch('http://localhost:3001/posts?_limit=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Function to update a post
const updatePost = async ({ postId, ...data }) => {
  const response = await fetch(`http://localhost:3001/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function FetchAndUpdatePosts() {
  const queryClient = useQueryClient();
  const [postId, setPostId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch posts
  const { data: posts, error, isLoading } = useQuery('posts', fetchPosts);

  // Update a post
  const { mutate, isLoading: isMutating } = useMutation(updatePost, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('posts');
      setSnackbarOpen(true); // Show success message
      // Optionally clear fields after update
      setPostId('');
      setTitle('');
      setBody('');
    },
  });

  // Handler to update the post
  const handleUpdatePost = () => {
    if (!postId) {
      alert('Please enter a valid Post ID');
      return;
    }
    mutate({
      postId: parseInt(postId, 10), // Ensure postId is a number
      title: title,
      body: body,
      userId: 1, // Assuming static userId or add field for dynamic input
    });
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
    <Box sx={{ margin: '20px' }}>
      <TextField
        size="small"
        label="Post ID"
        variant="outlined"
        value={postId}
        onChange={(e) => setPostId(e.target.value)}
        sx={{ marginRight: '8px', width: '100px' }}
      />
      <TextField
        size="small"
        label="Title"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ marginRight: '8px', width: '200px' }}
      />
      <TextField
        size="small"
        label="Body"
        variant="outlined"
        value={body}
        multiline
        rows={2}
        onChange={(e) => setBody(e.target.value)}
        sx={{ width: '300px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdatePost}
        disabled={isMutating}
        sx={{ marginLeft: '8px', height: '40px' }}
      >
        {isMutating ? 'Updating...' : 'Update Post'}
      </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Post updated successfully!"
      />
      <List sx={{ marginTop: '20px' }}>
        {posts.map(post => (
          <ListItem key={post.id} divider>
            <ListItemText primary={post.title} secondary={post.body} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default FetchAndUpdatePosts;
