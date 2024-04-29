import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Button } from "@mui/material";
import Table4 from "./Table4"; // Import Table4 component
import Table5 from "./Table5"; // Import Table4 component

function HybridQueries() {
  const [reviewsData, setReviewsData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "/data/Amazon_Appliances_Reviews.json"
//         ); // Adjust the path as necessary
//         setReviewsData(response.data);
//       } catch (error) {
//         console.error("Error fetching review data:", error);
//       }
//     };
//     fetchData();
//   }, []);

  const handleOptionSelection = (option) => {
    setSelectedOption(option);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Select a Hybrid Search Query
      </Typography>
      <Button
        variant="contained"
        style={{ margin: "10px" }}
        onClick={() => handleOptionSelection(1)}
      >
        Top 3 Similar Reviews by Year
      </Button>
      <Button
        variant="contained"
        style={{ margin: "10px" }}
        onClick={() => handleOptionSelection(2)}
      >
        Top 3 Similar Reviews by Product Category
      </Button>
      {selectedOption === 1 && <Table4  />}
      {selectedOption === 2 && <Table5  />}
    </Container>
  );
}

export default HybridQueries;
