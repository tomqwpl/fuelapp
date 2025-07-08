import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import SetupPage from './pages/SetupPage.tsx';
import ReportsPage from './pages/ReportsPage.tsx';
import FuelingPage from './pages/FuelingPage.tsx';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <HomePage/> } />
          <Route path="/setup" element={ <SetupPage/> } />
          <Route path="/reports" element={ <ReportsPage/> } />
          <Route path="/fueling" element={ <FuelingPage/> } />
        </Routes>
      </BrowserRouter>
  )
}

export default App
