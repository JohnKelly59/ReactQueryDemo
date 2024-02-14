import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material';

const fetchPosts = async (page = 1) => {
  const res = await fetch(`http://localhost:3001/posts?_limit=10&_page=${page}`);
  return res.json();
};

function PaginationPage() {
  const [page, setPage] = useState(1);
  const { isLoading, isError, error, data } = useQuery(['posts', page], () => fetchPosts(page), {
    keepPreviousData: true,
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <List>
        {data.map(post => (
          <ListItem key={post.id}>
            <ListItemText primary={post.title} secondary={post.body} />
          </ListItem>
        ))}
      </List>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <Button variant="contained" onClick={() => setPage(old => Math.max(old - 1, 1))} disabled={page === 1}>
          Previous Page
        </Button>
        <Button variant="contained" onClick={() => setPage(old => old + 1)}>
          Next Page
        </Button>
      </div>
    </div>
  );
}

export default PaginationPage;
