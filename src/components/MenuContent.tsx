import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link } from 'react-router';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, path: "/" },
  { text: 'Setup', icon: <SettingsRoundedIcon /> , path: "/setup" },
  { text: 'Fueling', icon: <LocalGasStationIcon /> , path: "/fueling" },
  { text: 'Reports', icon: <AssessmentIcon /> , path: "/reports" },
];

const secondaryListItems = [
  { text: 'About', icon: <InfoRoundedIcon /> },
];

export default function MenuContent() {

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === 0} component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
