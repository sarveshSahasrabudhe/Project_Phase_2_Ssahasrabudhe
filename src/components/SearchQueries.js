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

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/data/Amazon_Appliances_${selectedQuery}.json`);
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
    setSelectedQuery(queryType);
    switch (queryType) {
        case 'Metadata':
            setSearchPlaceholder("Search by Product Description or Title");
            setSearchDescription("Type a product description or title to search:");
            break;
        case 'Reviews':
            setSearchPlaceholder("Search by Reviewer Name");
            setSearchDescription("Type a reviewer name to search:");
            break;
        case 'Categories':
            setSearchPlaceholder("Search by Product Categories");
            setSearchDescription("Type a product category to search:");
            break;
        default:
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

    if (selectedQuery === 'Reviews') {
        return data.filter(item => {
            // Ensure that reviewerName is defined before calling toLowerCase()
            return item.reviewerName && item.reviewerName.toLowerCase().includes(searchQuery.toLowerCase());
        });
    } else if (selectedQuery === 'Metadata') {
        return data.filter(item => {
            // Check that title and description exist and perform a case insensitive search
            const titleMatch = item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase());
            const descriptionMatch = item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase());
            return titleMatch || descriptionMatch;
        });
    } else if (selectedQuery === 'Categories') {
        // Handle category searching if implemented
        return data.filter(item => {
            const categoriesMatch = item.categories && JSON.parse(item.categories.replace(/'/g, '"')).some(catArray => 
                catArray.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            return categoriesMatch;
        });
    }

    return []; // Default case to return empty array if no valid query type is selected
};

  const renderTable = () => {
    if (!selectedQuery) return null;

    const filteredData = filterData();

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
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <img src={item.imUrl} alt={item.title} style={{ width: 100 }} />
                  </TableCell>
                  <TableCell>{item.categories && JSON.parse(item.categories.replace(/'/g, '"')).map(cat => cat.join(", ")).join(" | ")}</TableCell>
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
