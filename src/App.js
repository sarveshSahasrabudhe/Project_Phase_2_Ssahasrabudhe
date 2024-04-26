import logo from './logo.svg';
import './App.css';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import SearchQueries from './components/SearchQueries';

function App() {
  return (
    <BrowserRouter>
    <Routes>  {/* Use Routes instead of Switch */}
      <Route path="/" element={<Dashboard />} />  {/* Update route definition */}
      <Route path="/search-queries" element={<SearchQueries />} />
    </Routes>
  </BrowserRouter>


  );
}

export default App;
