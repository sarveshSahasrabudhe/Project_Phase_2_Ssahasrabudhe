import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography, Button, Container, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SearchQueries() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuery, setSelectedQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchPlaceholder, setSearchPlaceholder] = useState("");
  const [searchDescription, setSearchDescription] = useState("");

  useEffect(() => {
    if (!selectedQuery) return;

    const jsonFileUrl = `/data/Amazon_Appliances_${selectedQuery}.json`;
    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(jsonFileUrl);
            setData(response.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, [selectedQuery]);

  const handleQuerySelection = (queryType) => {
    setSearchQuery("");  // Clear previous searches
    switch (queryType) {
        case 'Metadata':
        case 'Categories':
            setSelectedQuery('Metadata'); // Fetch Metadata for both products and categories
            setSearchPlaceholder("Search by Product Description or Title");
            setSearchDescription("Type a product description or title to search:");
            break;
        case 'Reviews':
            setSelectedQuery('Reviews'); // Fetch Reviews for reviewer names
            setSearchPlaceholder("Search by Reviewer Name");
            setSearchDescription("Type a reviewer name to search:");
            break;
        default:
            setSelectedQuery("");
            setSearchPlaceholder("");
            setSearchDescription("");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filterData = () => {
    if (!data) return [];

    switch (selectedQuery) {
        case 'Reviews':
            return data.filter(item =>
                item.reviewerName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        case 'Metadata':
            return data.filter(item => {
                const titleMatch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
                const descriptionMatch = item.description?.toLowerCase().includes(searchQuery.toLowerCase());
                const categoriesMatch = selectedQuery === 'Categories' && item.categories && JSON.stringify(item.categories).toLowerCase().includes(searchQuery.toLowerCase());
                return titleMatch || descriptionMatch || categoriesMatch;
            });
        default:
            return []; // No data to display if the query type isn't specified
    }
  };

  const renderTable = () => {
    if (!selectedQuery) return null;

    const filteredData = filterData();
    const isReviewSearch = selectedQuery === 'Reviews';

    return (
      <Paper>
        <Typography sx={{ mt: 2, mb: 1 }}>
          {searchDescription}
        </Typography>
        <TextField
          id="search"
          type="search"
          label="Search"
          variant="outlined"
          placeholder={searchPlaceholder}
          margin="dense"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: '400px',
            margin: 'auto',
            marginBottom: 2,
          }}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {isReviewSearch ? (
                  <>
                    <TableCell>Reviewer Name</TableCell>
                    <TableCell>Review Text</TableCell>
                    <TableCell>Overall Rating</TableCell>
                    <TableCell>Review Time</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Category</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={index}>
                  {isReviewSearch ? (
                    <>
                      <TableCell>{item.reviewerName}</TableCell>
                      <TableCell>{item.reviewText}</TableCell>
                      <TableCell>{item.overall}</TableCell>
                      <TableCell>{new Date(item.reviewTime * 1000).toLocaleString()}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <img src={item.imUrl} alt={item.title} style={{ width: 100 }} />
                      </TableCell>
                      <TableCell>{item.categories && JSON.parse(item.categories.replace(/'/g, '"')).map(cat => cat.join(", ")).join(" | ")}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Select a Fuzzy/Exact-Search Query
      </Typography>
      <Button variant="contained" onClick={() => handleQuerySelection('Metadata')} style={{ margin: '10px' }}>
        Product Search by Description or Title
      </Button>
      <Button variant="contained" onClick={() => handleQuerySelection('Reviews')} style={{ margin: '10px' }}>
        Reviewer Name Search
      </Button>
      <Button variant="contained" onClick={() => handleQuerySelection('Categories')} style={{ margin: '10px' }}>
        Search for Products in Specific Categories
      </Button>
      {renderTable()}
    </Container>
  );
}

export default SearchQueries;
