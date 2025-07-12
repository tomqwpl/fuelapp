import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import { Link, Outlet } from 'react-router';

function MainPage() {
  return (
    <>
      <Box>
        <CssBaseline />
        <Box sx={{padding: "20px"}}>
          <Outlet/>
        </Box>
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
          >
            <BottomNavigationAction label="Home" icon={<HomeRoundedIcon />} component={Link} to="/"/>
            <BottomNavigationAction label="Fuel" icon={<LocalGasStationIcon />} component={Link} to="/fueling"/>
            <BottomNavigationAction label="Account" icon={<PersonIcon />} component={Link} to="/account"/>
          </BottomNavigation>
        </Paper>
      </Box>      
    </>
  )
}

export default MainPage
