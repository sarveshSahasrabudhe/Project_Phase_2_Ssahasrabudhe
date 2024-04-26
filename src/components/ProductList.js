import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, TablePagination, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function ProductList({ selectedJson }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!selectedJson) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const jsonFileUrl = `/data/${selectedJson}.json`;

      try {
        const response = await axios.get(jsonFileUrl);
        setProducts(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedJson]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filterProducts = () => {
    return products.filter((product) => {
      if (selectedJson.includes("Reviews")) {
        const searchFields = [product.reviewerName, product.reviewText, product.summary].join(" ").toLowerCase();
        return searchFields.includes(searchQuery.toLowerCase());
      } else if (selectedJson.includes("Metadata")) {
        const searchFields = [product.title, product.description].join(" ").toLowerCase();
        return searchFields.includes(searchQuery.toLowerCase());
      }
      return false;
    });
  };

  const renderTableHeader = () => {
    if (selectedJson.includes("Reviews")) {
      return (
        <TableRow>
          <TableCell>Reviewer Name</TableCell>
          <TableCell>Review Text</TableCell>
          <TableCell>Overall Rating</TableCell>
          <TableCell>Review Time</TableCell>
        </TableRow>
      );
    } else if (selectedJson.includes("Metadata")) {
      return (
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Image</TableCell>
        </TableRow>
      );
    }
  };

  const renderTableRows = () => {
    const filteredProducts = filterProducts();
    return filteredProducts
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((product, index) => (
        <TableRow key={index}>
          {selectedJson.includes("Reviews") ? (
            <>
              <TableCell>{product.reviewerName}</TableCell>
              <TableCell>{product.reviewText}</TableCell>
              <TableCell>{product.overall}</TableCell>
              <TableCell>{product.reviewTime}</TableCell>
            </>
          ) : (
            <>
              <TableCell>{product.title}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>
                <img src={product.imUrl} alt={product.title} style={{width: "100px"}} />
              </TableCell>
            </>
          )}
        </TableRow>
      ));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Paper>
      <TextField
        id="search"
        type="search"
        label="Search"
        variant="outlined"
        margin="dense"
        size="small"
        fullWidth
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
          marginTop: 2,
          marginBottom: 2,
        }}
      />
      <TableContainer>
        <Table>
          <TableHead>{renderTableHeader()}</TableHead>
          <TableBody>{renderTableRows()}</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filterProducts().length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default ProductList;
