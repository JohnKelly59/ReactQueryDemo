import React, { useState, useRef, useEffect } from 'react';
import { useInfiniteQuery } from 'react-query';
import { CircularProgress, List, ListItem, ListItemText, Box } from '@mui/material';

const fetchPosts = async ({ pageParam = 1 }) => {
  // Simulate a delay to better demonstrate loading states
  await new Promise(resolve => setTimeout(resolve, 500));
  const res = await fetch(`http://localhost:3001/posts?_limit=10&_page=${pageParam}`);
  return { data: await res.json(), nextPage: pageParam + 1, totalPages: 10 };
};

function InfiniteQueriesPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery('infinite-posts', fetchPosts, {
    getNextPageParam: (lastPage) => lastPage.nextPage <= lastPage.totalPages ? lastPage.nextPage : undefined,
  });

  const loadMoreRef = useRef();

  useEffect(() => {
    const currentRef = loadMoreRef.current;
  
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
  
    if (currentRef) {
      observer.observe(currentRef);
    }
  
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  if (status === 'loading') return <CircularProgress />;
  if (status === 'error') return <div>Error fetching data</div>;

  return (
    <div>
      <List>
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map(post => (
              <ListItem key={post.id}>
                <ListItemText primary={post.title} secondary={post.body} />
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }} ref={loadMoreRef}>
        {isFetchingNextPage && <CircularProgress size={60} />}
      </Box>
    </div>
  );
}

export default InfiniteQueriesPage;
