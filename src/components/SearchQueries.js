import React, { useState } from "react";
import { Typography, Button, Container } from "@mui/material";
import Table1 from "./Table1";
import Table2 from "./Table2"; 
import Table3 from "./Table3"; 

function SearchQueries() {
  const [showTable, setShowTable] = useState(null);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Select a Query
      </Typography>
      <Button
        variant="contained"
        onClick={() => setShowTable(1)}
        style={{ margin: "10px" }}
      >
        Show Appliances
      </Button>
      <Button
        variant="contained"
        onClick={() => setShowTable(2)}
        style={{ margin: "10px" }}
      >
        Show Products which has price greater $6
      </Button>

      <Button
        variant="contained"
        onClick={() => setShowTable(3)}
        style={{ margin: "10px" }}
      >
        Reviewer Name: Steve
      </Button>
      {showTable === 1 && <Table1 />}
      {showTable === 2 && <Table2 />}
      {showTable === 3 && <Table3 />}
    </Container>
  );
}

export default SearchQueries;
