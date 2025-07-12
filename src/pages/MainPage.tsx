import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import SideMenu from '../components/SideMenu';
import { Outlet } from 'react-router';
import { alpha } from '@mui/material/styles';
import { Stack } from '@mui/material';

function MainPage() {
  return (
    <>
      <CssBaseline enableColorScheme />
      <Stack>
        <Stack direction="row">
          <SideMenu />

          {/* Main content */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: 'auto',
            })}
          >
              <Outlet />
          </Box>
        </Stack>
      </Stack>
    </>
  )
}

export default MainPage
