
import useMediaQuery from '@mui/material/useMediaQuery';
import DesktopApp from './DesktopApp';
import MobileApp from './MobileApp';

export default function App() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  
  if (isMobile) {
    return <MobileApp/>
  }
  return <DesktopApp/>
}
