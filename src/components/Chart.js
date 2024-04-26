import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Function to safely parse JSON strings within the data
const safeParseJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString.replace(/'/g, '"'));
  } catch (e) {
    console.error('Failed to parse JSON string:', jsonString, 'Error:', e);
    return [];
  }
};

// Function to process products data from JSON and organize it by subcategory
const processProductsData = (metadata) => {
  const counts = metadata.reduce((acc, item) => {
    const categories = safeParseJSON(item.categories);
    if (categories && categories.length > 0) {
      const subcategory = categories[0][categories[0].length - 1];
      acc[subcategory] = (acc[subcategory] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
};

// Function to process reviews data and map it to subcategories
const processReviewsData = (reviews, metadata) => {
  const subcategories = processProductsData(metadata).reduce((acc, { name }) => {
    acc[name] = 0; // Initialize all subcategories with zero count
    return acc;
  }, {});

  reviews.forEach((review) => {
    const product = metadata.find((product) => product.asin === review.asin);
    if (product) {
      const categories = safeParseJSON(product.categories);
      if (categories && categories.length > 0) {
        const subcategory = categories[0][categories[0].length - 1];
        subcategories[subcategory] += 1; // Increment the count for this subcategory
      }
    }
  });

  return Object.keys(subcategories).map((name) => ({
    name,
    count: subcategories[name],
  }));
};

const processAverageReviewWordCountData = (reviews, metadata) => {
  let wordCounts = {};
  let reviewCounts = {};

  reviews.forEach(review => {
    const product = metadata.find(p => p.asin === review.asin);
    if (product) {
      const categories = safeParseJSON(product.categories);
      if (categories && categories.length > 0) {
        const subcategory = categories[0][categories[0].length - 1];
        const wordCount = review.reviewText ? review.reviewText.split(/\s+/).length : 0;

        wordCounts[subcategory] = (wordCounts[subcategory] || 0) + wordCount;
        reviewCounts[subcategory] = (reviewCounts[subcategory] || 0) + 1;
      }
    }
  });

  // Calculate average word count for each subcategory
  const avgWordCounts = Object.keys(wordCounts).map(subcategory => ({
    name: subcategory,
    count: Math.round(wordCounts[subcategory] / reviewCounts[subcategory])
  }));

  return avgWordCounts;
};


const processJanuaryReviewsDataByYear = (reviews) => {
  const years = [2011, 2012, 2013, 2014];
  let reviewsCountByYear = {};

  years.forEach(year => {
    reviewsCountByYear[year] = reviews.filter(review => {
      const reviewDate = new Date(review.unixReviewTime * 1000);
      return reviewDate.getMonth() === 0 && reviewDate.getFullYear() === year;
    }).length; // Count reviews for January of the year
  });

  // Transform the reviewsCountByYear object to match the expected data structure for the chart
  let chartData = Object.entries(reviewsCountByYear).map(([year, count]) => ({
    name: year,
    count: count
  }));

  return chartData;
};

const Chart = ({ selectedOption, metadata, reviews }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState([]);
  const [dataByYear, setDataByYear] = useState({}); // Stores data for each year



  useEffect(() => {
    if (selectedOption === 'How many reviews submitted every January for years: 2011, 2012, 2013, 2014?') {
      let januaryReviewsData = processJanuaryReviewsDataByYear(reviews);
      setChartData(januaryReviewsData); // Use the new logic for option 4
      setDataByYear({}); // Reset dataByYear to avoid conflict with the new logic
    } else {

      setDataByYear({});
      switch (selectedOption) {
        case 'How many products are there in every product subcategory?':
          setChartData(processProductsData(metadata));
          break;
        case 'How many reviews for every product subcategory?':
          setChartData(processReviewsData(reviews, metadata));
          break;
        case 'What is the average size (characters/words) of the review text/body?':
          setChartData(processAverageReviewWordCountData(reviews, metadata));
          break;
      }
    }
  }, [selectedOption, metadata, reviews]);


  return (
    <React.Fragment>
      <Title>{selectedOption}</Title>
      {Object.keys(dataByYear).length > 0 ? (
        Object.entries(dataByYear).map(([year, data]) => (
          <React.Fragment key={year}>
            <Title>January {year}</Title>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </React.Fragment>
        ))
      ) : (
        // This block is for rendering the chart for options 1, 2, and 3
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </React.Fragment>
  );
};


export default Chart;
