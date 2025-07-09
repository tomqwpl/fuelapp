import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import SetupPage from './pages/SetupPage.tsx';
import ReportsPage from './pages/ReportsPage.tsx';
import FuelingPage from './pages/FuelingPage.tsx';
import CarInfoPage from './pages/CarInfoPage.tsx';
import LocationInfoPage from './pages/LocationPage.tsx';
import MainPage from './pages/MainPage.tsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <MainPage/> }>
            <Route index element={<HomePage/>}/>
            <Route path="setup" element={ <SetupPage/> } />
            <Route path="reports" element={ <ReportsPage/> } />
            <Route path="fueling" element={ <FuelingPage/> } />
            <Route path="car/:carId" element={ <CarInfoPage/> } />
            <Route path="location/:locationId" element={ <LocationInfoPage/> } />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
