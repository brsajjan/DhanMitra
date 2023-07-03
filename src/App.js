import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './components/homepage/Homepage';
import StratingPage from './components/starting page/StratingPage';
import AllClients from './components/All Clients/AllClients';
import ClientLoanDetails from "./components/ViewClient/ClientLoanDetails"
import ViewClientLoans1 from './components/AllAboutClientLoans/ViewClientLoans1';
import Transactions from './components/Transactions/Transactions';

function App() {
  return (
    <>

      <BrowserRouter>

        <Routes>

          <Route path='/' element={<StratingPage />} />
          <Route path='/home' element={<Homepage />} />
          <Route path='/All Clients' element={<AllClients />} />
          <Route path='/ClientLoanDetails/:uid' element={<ClientLoanDetails />} />
          <Route path='/ViewClientLoan/:uid/:id' element={<ViewClientLoans1 />} />
          <Route path='/Transactions' element={<Transactions />} />

        </Routes>

      </BrowserRouter>

    </>
  );
}

export default App;
