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
          "http://localhost:9200/amazon_product_metadata/_search",
          {
            size: 10, // Adjust the size as needed
            query: {
              match: {
                categories: "Parts", // Search for reviews mentioning "easy installation"
              },
            },
          }
        );
        const hits = response.data.hits.hits;
        console.log("hits:", hits);

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
      <Title>Appliance Products (Scroll down fo more)</Title>
      <div style={{ maxHeight: "400px", overflow: "auto" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Title</b>
                </TableCell>
                <TableCell align="left">
                  <b>Description</b>
                </TableCell>
                <TableCell align="left">
                  <b>Price</b>
                </TableCell>
                <TableCell align="left">
                  <b>Categories</b>
                </TableCell>
                {/* New column for Categories */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.title || "No title available"}</TableCell>
                  <TableCell align="left">
                    {row.description || "No description available"}
                  </TableCell>
                  <TableCell align="left">
                    {row.price || "No price available"}
                  </TableCell>
                  <TableCell align="left">
                    {row.categories || "No categories available"}
                  </TableCell>
                  {/* Displaying categories */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </React.Fragment>
  );
    }
