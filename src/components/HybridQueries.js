import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

function HybridQueries() {
    const [reviewsData, setReviewsData] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/data/Amazon_Appliances_Reviews.json'); // Adjust the path as necessary
                setReviewsData(response.data);
            } catch (error) {
                console.error('Error fetching review data:', error);
            }
        };
        fetchData();
    }, []);

    const handleOptionSelection = (option) => {
        setSelectedOption(option);
    };

    const filterAndSortReviewsByYear = () => {
        const years = [2011, 2012, 2013, 2014];
        return years.map(year => ({
            year,
            reviews: reviewsData
                .filter(review => new Date(review.unixReviewTime * 1000).getFullYear() === year)
                .slice(0, 3) // Assuming reviews are sorted by some similarity metric
        }));
    };

    const renderReviewsByYear = () => {
        if (selectedOption !== 1) return null;

        const yearlyReviews = filterAndSortReviewsByYear();

        return yearlyReviews.map(yearData => (
            <Paper style={{ margin: '20px 0' }} key={yearData.year}>
                <Typography variant="h6" gutterBottom>
                    Top 3 Similar Reviews for {yearData.year}
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Reviewer Name</TableCell>
                                <TableCell>Review Text</TableCell>
                                <TableCell>Review Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {yearData.reviews.map((review, index) => (
                                <TableRow key={index}>
                                    <TableCell>{review.reviewerName}</TableCell>
                                    <TableCell>{review.reviewText}</TableCell>
                                    <TableCell>{new Date(review.unixReviewTime * 1000).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        ));
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Select a Hybrid Search Query</Typography>
            <Button variant="contained" style={{ margin: '10px' }} onClick={() => handleOptionSelection(1)}>
                Top 3 Similar Reviews by Year
            </Button>
            <Button variant="contained" style={{ margin: '10px' }} onClick={() => handleOptionSelection(2)}>
                Top 3 Similar Reviews by Product Category
            </Button>
            {renderReviewsByYear()}
        </Container>
    );
}

export default HybridQueries;
