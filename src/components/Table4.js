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

export default function Hybrid1() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("sadad");
        const years = [2011, 2012, 2013, 2014];

        const promises = years.map(async (year) => {
          const response = await axios.post(
            "http://localhost:9200/mini_dataset_amazon_product_reviews/_search",
            {
              size: 3, // Top 3 most similar reviews
              query: {
                bool: {
                  must: [
                    {
                      match: {
                        reviewTime: year, 
                      },
                    },
                    {
                      more_like_this: {
                        fields: ["reviewText"], 
                        like: "water filter", 
                        min_term_freq: 1,
                        min_doc_freq: 1,
                      },
                    },
                  ],
                },
              },
            }
          );

          console.log(response.data.hits.hits);

          return response.data.hits.hits.map((hit) => hit._source);
        });

        const results = await Promise.all(promises);

        setData(results.flat());
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Title>Top 3 Most Similar Reviews for Each Year (Scroll down fo more)</Title>
      <div style={{ maxHeight: "400px", overflow: "auto" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Year</b>
                </TableCell>
                <TableCell>
                  <b>Reviewer Name</b>
                </TableCell>
                <TableCell align="left">
                  <b>Review</b>
                </TableCell>
                {/* Add more table headers as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.reviewTime}</TableCell>
                  <TableCell>{row.reviewerName}</TableCell>
                  <TableCell align="left" style={{ maxWidth: "800px" }}>
                    {row.reviewText}
                  </TableCell>
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
