import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FetchData from './FetchData';
import PaginationPage from './PaginationPage';
import InfiniteQueriesPage from './InfiniteQueriesPage';
import OptimisticUpdatesPage from './OptimisticUpdatesPage';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            React Query Demo
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/pagination">Pagination</Button>
          <Button color="inherit" component={Link} to="/infinite">Infinite Queries</Button>
          <Button color="inherit" component={Link} to="/optimistic">Optimistic Updates</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<FetchData />} />
          <Route path="/pagination" element={<PaginationPage />} />
          <Route path="/infinite" element={<InfiniteQueriesPage />} />
          <Route path="/optimistic" element={<OptimisticUpdatesPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
