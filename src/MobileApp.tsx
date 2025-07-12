import { BrowserRouter, Routes, Route } from "react-router";
import MainPage from './mobile/MainPage.tsx';
import HomePage from './mobile/HomePage.tsx';
import FuelingStartPage from './mobile/FuelingStartPage.tsx';
import FuelingPage from './mobile/FuelingPage.tsx';
import AccountPage from './mobile/AccountPage.tsx';


export default function MobileApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <MainPage/> }>
            <Route index element={<HomePage/>}/>
            <Route path="fueling" element={<FuelingStartPage/>}/>
            <Route path="fueling/:eventId" element={<FuelingPage/>}/>
            <Route path="account" element={<AccountPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

