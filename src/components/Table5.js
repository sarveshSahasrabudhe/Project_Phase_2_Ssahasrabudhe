import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function ProductReviews() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.post(
          "http://localhost:9200/amazon_product_metadata/_search",
          {
            size: 10,
            query: {
              bool: {
                should: [
                  {
                    match_phrase: {
                      categories: "Refrigerator Parts & Accessories",
                    },
                  },
                  {
                    match_phrase: {
                      categories: "Humidifier Parts & Accessories",
                    },
                  },
                  { match_phrase: { categories: "Range Parts & Accessories" } },
                  {
                    match_phrase: {
                      categories: "Dishwasher Parts & Accessories",
                    },
                  },
                ],
                minimum_should_match: 1,
              },
            },
          }
        );
        const productsData = productResponse.data.hits.hits.map(
          (hit) => hit._source
        );
        setProducts(productsData);

        const reviewPromises = productsData.map((product) =>
          axios.post(
            "http://localhost:9200/mini_dataset_amazon_product_reviews/_search",
            {
              size: 3,
              query: { match: { asin: product.asin } },
            }
          )
        );

        const reviewResponses = await Promise.all(reviewPromises);
        const reviewsData = reviewResponses.reduce((acc, response, index) => {
          acc[productsData[index].asin] = response.data.hits.hits.map(
            (hit) => hit._source
          );
          return acc;
        }, {});
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Product Reviews
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Product Title</b>
              </TableCell>
              <TableCell>
                <b>ASIN</b>
              </TableCell>
              <TableCell>
                <b>Categories</b>
              </TableCell>
              <TableCell>
                <b>Reviews</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.asin}>
                <TableCell>{product.title || "No title available"}</TableCell>
                <TableCell>{product.asin}</TableCell>
                <TableCell>
                  {product.categories
                    ? product.categories.replace(/[\[\]']+/g, "")
                    : "No categories listed"}
                </TableCell>
                <TableCell>
                  {reviews[product.asin] && reviews[product.asin].length > 0
                    ? reviews[product.asin].map((review, index) => (
                        <div key={index}>
                          <Typography variant="subtitle2">
                            {review.reviewerName}
                          </Typography>
                          <Typography variant="body2">
                            {review.reviewText}
                          </Typography>
                          <Typography variant="caption">
                            {new Date(
                              review.reviewTime * 1000
                            ).toLocaleDateString()}
                          </Typography>
                        </div>
                      ))
                    : "No Reviews"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ProductReviews;
