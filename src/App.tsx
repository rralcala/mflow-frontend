import { Admin, Resource, CustomRoutes, EditGuesser, ShowGuesser } from "react-admin";
import jsonServerProvider from 'ra-data-json-server';

import { authProvider } from './authProvider';
import { httpClient } from './httpClient';

import { Dashboard } from "./Dashboard";
import { AssetList, AssetShow } from "./assets";
import { AccountShow, AccountList, AccountEdit } from "./accounts";
import { RecurrentList, RecurrentShow, RecurrentEdit, RecurrentCreate } from "./recurrents";
import { RecurrenttransactionList, RecurrenttransactionShow, RecurrenttransactionEdit, RecurrenttransactionCreate } from "./recurrentTransaction";
import { UpcomingpaymentList, UpcomingpaymentShow } from "./upcomingPayments";
import { MonthlytransactionList, MonthlytransactionShow } from "./mothlyTransactions";
import { ExchangerateList } from "./exchangeRates";
import { DashboardCashFlow } from "./DashboardCashFlow";

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DownloadIcon from '@mui/icons-material/Download';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SavingsIcon from '@mui/icons-material/Savings';
import UploadIcon from '@mui/icons-material/Upload';
import { Route } from "react-router";
import { BondList } from "./bonds";
import { BondscheduleEdit, BondscheduleList, BondscheduleShow } from "./bondSchedules";

const apiUrl = import.meta.env.VITE_API_URL;

const dataProvider = jsonServerProvider(apiUrl + "/", httpClient);

export const App = () => (
    <Admin 
      title="mFlow" 
      dataProvider={dataProvider}  
      authProvider={authProvider}
      dashboard={Dashboard}
      requireAuth >
      <Resource name="recurrents" 
        list={RecurrentList} 
        show={RecurrentShow} 
        edit={RecurrentEdit} 
        create={RecurrentCreate} icon={MenuBookIcon} />
      <Resource name="recurrentTransactions" 
        list={RecurrenttransactionList} 
        show={RecurrenttransactionShow}  
        edit={RecurrenttransactionEdit} 
        create={RecurrenttransactionCreate} 
        icon={ReceiptIcon} />
      <Resource name="bonds" list={BondList} show={ShowGuesser} icon={AccountBalanceIcon} />
      <Resource name="bondSchedules" list={BondscheduleList} show={BondscheduleShow} edit={BondscheduleEdit}  icon={AccountBalanceIcon} />
      <Resource name="assets" list={AssetList} show={AssetShow} icon={AccountBalanceIcon} />
      <Resource name="accounts" list={AccountList} show={AccountShow} edit={AccountEdit} icon={SavingsIcon} /> {/* Assuming you have a users resource, you can use ListGuesser for it. */}
      <Resource name="upcomingPayments" list={UpcomingpaymentList} show={UpcomingpaymentShow} icon={DownloadIcon} /> {/* This resource is only used for the dashboard, so we don't need to specify list, show, edit, or create components. */}
      <Resource name="monthlyTransactions" list={MonthlytransactionList}  show={MonthlytransactionShow} icon={UploadIcon} /> {/* Assuming you have a users resource, you can use ListGuesser for it. */}
      <Resource name="exchangeRates" list={ExchangerateList} icon={CurrencyExchangeIcon} />
      <CustomRoutes>
        <Route path="/dashboard-cf" element={<DashboardCashFlow />} />
    </CustomRoutes>

    </Admin>
);