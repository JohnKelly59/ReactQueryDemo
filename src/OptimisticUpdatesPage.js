import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { TextField, Button, Box, CircularProgress } from '@mui/material';

// Mock function to simulate updating a post
const updatePost = async ({ postId, title }) => {
  // Simulate a delay to mimic async behavior in a real app
  await new Promise(resolve => setTimeout(resolve, 500));
  const response = await fetch(`http://localhost:3001/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({ id: postId, title }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Component to fetch and display a post
const Post = ({ postId }) => {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState('');

  // Fetch post details
  const { data: post, isError, error, isLoading: isFetching } = useQuery(['post', postId], async () => {
    const res = await fetch(`http://localhost:3001/posts/${postId}`);
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  }, {
    // This will keep the old data visible while fetching the new data
    keepPreviousData: true,
  });

  // Mutation with optimistic update
  const { mutate, isLoading: isMutating } = useMutation(updatePost, {
    onMutate: async (newData) => {
      await queryClient.cancelQueries(['post', postId]);

      const previousPost = queryClient.getQueryData(['post', postId]);

      queryClient.setQueryData(['post', postId], old => ({ ...old, title: newData.title }));

      return { previousPost };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['post', postId], context.previousPost);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['post', postId]);
    },
  });

  const handleUpdate = () => {
    mutate({ postId, title: newTitle });
    setNewTitle(''); // Clear input field after mutation
  };

  if (isError) return <div>Error: {error.message}</div>;
  if (isFetching) return <CircularProgress />;

  return (
    <Box sx={{ mb: 2 }}>
      <div>
        <h3>Current Title: {post?.title}</h3>
        <TextField
          size="small"
          label="New Title"
          variant="outlined"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={isMutating} // Disable input while updating
        />
        <Button onClick={handleUpdate} disabled={isMutating || !newTitle} sx={{ ml: 1 }}>
          {isMutating ? 'Updating...' : 'Update Title'}
        </Button>
      </div>
    </Box>
  );
};

function OptimisticUpdatesPage() {
  return (
    <div>
      <h2>Optimistic Update Example</h2>
      <Post postId={1} />
    </div>
  );
}

export default OptimisticUpdatesPage;
