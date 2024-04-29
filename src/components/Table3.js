// Table.js
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Title from "./Title";
import axios from "axios";

export default function Table1() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:9200/amazon_product_reviews/_search",
          {
            size: 10, // Adjust the size as needed
            query: {
              match: {
                reviewerName: "Steve", // Search for reviews mentioning "easy installation"
              },
            },
          }
        );
        const hits = response.data.hits.hits;
        const parsedData = hits.map((hit) => hit._source);
        setData(parsedData);
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Title> Reviewer Name: Steve (Scroll down fo more)</Title>
      <div style={{ maxHeight: "400px", overflow: "auto" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Reviewer Name</b>
                </TableCell>
                <TableCell align="left">
                  <b>Review</b>
                </TableCell>
                <TableCell align="left">
                  <b>Review Time</b>
                </TableCell>
                {/* Add more table headers as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.reviewerName}</TableCell>
                  <TableCell align="left" style={{ maxWidth: "800px" }}>
                    {row.reviewText}
                  </TableCell>
                  <TableCell align="left">{row.reviewTime}</TableCell>
                  {/* Add more table cells for additional data fields */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </React.Fragment>
  );
}
