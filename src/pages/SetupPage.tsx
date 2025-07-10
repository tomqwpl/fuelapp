import LocationManager from '../components/LocationManager';
import CarManager from '../components/CarManager';
import EventManager from '../components/EventManager';
import React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '../components/TabPanel';

export default function SetupPage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Events"/>
        <Tab label="Cars"/>
        <Tab label="Locations"/>
      </Tabs>
    </Box>
    <TabPanel value={value} index={0}>
      <EventManager/>
    </TabPanel>
    <TabPanel value={value} index={1}>
      <CarManager/>
    </TabPanel>
    <TabPanel value={value} index={2}>
      <LocationManager/>
    </TabPanel>      
    </React.Fragment>
  )
}
