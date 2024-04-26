// import React, { useState, useEffect, useContext } from 'react';
// import { useTheme } from '@mui/material/styles';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import Title from './Title';
// import axios from 'axios';

// function ProductSubcategoryChart() {
//   const theme = useTheme();
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const subcategoryData = await loadAndCountSubcategories();
//       setData(subcategoryData);
//     };
    
//     fetchData();
//   }, []);

//   const loadAndCountSubcategories = async () => {
//     try {
//       const response = await axios.get('/data/Amazon_Appliances_Metadata.json');
//       const data = response.data;
  
//       const subcategoryCounts = data.reduce((acc, item) => {
//         // Assume each item's categories field is a string that needs parsing
//         const categories = JSON.parse(item.categories.replace(/'/g, '"'));
  
//         categories.forEach((categoryArray) => {
//           const subcategory = categoryArray[categoryArray.length - 1]; // Get last element as the subcategory
//           if (acc[subcategory]) {
//             acc[subcategory] += 1;
//           } else {
//             acc[subcategory] = 1;
//           }
//         });
  
//         return acc;
//       }, {});
  
//       // Convert counts to the array format expected by the chart
//       return Object.entries(subcategoryCounts).map(([name, count]) => ({ name, count }));
//     } catch (error) {
//       console.error("Failed to load or parse JSON:", error);
//       return [];
//     }
//   };
  

//   return (
//     <React.Fragment>
//       <Title>Number of Products in Every Subcategory</Title>
//       <BarChart
//         width={730}
//         height={250}
//         data={data}
//         margin={{
//           top: 20, right: 30, left: 20, bottom: 5,
//         }}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="count" fill="#8884d8" />
//       </BarChart>
//     </React.Fragment>
//   );
// }

// export default ProductSubcategoryChart;
