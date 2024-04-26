import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search'; // For Fuzzy/Exact-Search Queries
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // Alternative for Hybrid-Search Queries
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Dropdown icon

import { useNavigate } from 'react-router-dom'; // Import useHistory

function MainListItems({ handleOptionSelection }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleSearchClick = () => {
    navigate('/search-queries'); // Correct usage of navigate to change routes
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    handleOptionSelection(option); // Call handleOptionSelection with the selected option

    console.log("Selected option:", option); // Replace this with your actual handling logic
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Tooltip title="Dashboard" placement="right" arrow>
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" sx={{ '& .MuiListItemText-primary': { whiteSpace: 'normal' } }} />
        </ListItemButton>
      </Tooltip>
      
      <Tooltip title="Quantitative Queries" placement="right" arrow>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Quantitative Queries" 
            sx={{ 
              marginRight: '30px', // Adjust the right margin to prevent overlap
              '& .MuiListItemText-primary': { whiteSpace: 'normal' } 
            }} 
          />
          <ExpandMoreIcon />
        </ListItemButton>
      </Tooltip>
      
      <Menu
        id="quantitative-queries-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose('')}
      >
        <MenuItem onClick={() => handleClose("How many products are there in every product subcategory?")}>
          How many products are there in every product subcategory?
        </MenuItem>
        <MenuItem onClick={() => handleClose("How many reviews for every product subcategory?")}>
          How many reviews for every product subcategory?
        </MenuItem>
        <MenuItem onClick={() => handleClose("What is the average size (characters/words) of the review text/body?")}>
          What is the average size (characters/words) of the review text/body?
        </MenuItem>
        <MenuItem onClick={() => handleClose("How many reviews submitted every January for years: 2011, 2012, 2013, 2014?")}>
          How many reviews submitted every January for years: 2011, 2012, 2013, 2014?
        </MenuItem>
      </Menu>
      
      <Tooltip title="Fuzzy/Exact-Search Queries" placement="right" arrow>
        <ListItemButton onClick={handleSearchClick}>
          <ListItemIcon>
            <SearchIcon />
          </ListItemIcon>
          <ListItemText primary="Fuzzy/Exact-Search Queries" sx={{ '& .MuiListItemText-primary': { whiteSpace: 'normal' } }} />
        </ListItemButton>
      </Tooltip>
      
      <Tooltip title="Hybrid-Search Queries" placement="right" arrow>
        <ListItemButton>
          <ListItemIcon>
            <TrendingUpIcon />
          </ListItemIcon>
          <ListItemText primary="Hybrid-Search Queries" sx={{ '& .MuiListItemText-primary': { whiteSpace: 'normal' } }} />
        </ListItemButton>
      </Tooltip>
    </React.Fragment>
  );
}

export { MainListItems };
