import { Admin, Resource, ShowGuesser, ListGuesser } from "react-admin";
import jsonServerProvider from 'ra-data-json-server';
import { authProvider } from './authProvider';
import { httpClient } from './httpClient';
import { RecurrentList, RecurrentShow, RecurrentEdit, RecurrentCreate } from "./recurrents";
import { RecurrenttransactionList, RecurrenttransactionShow, RecurrenttransactionEdit, RecurrenttransactionCreate } from "./recurrentTransaction";
import { AssetList, AssetShow } from "./assets";
import { AccountShow, AccountList, AccountEdit } from "./accounts";

import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Dashboard } from "./Dashboard";
import { UpcomingpaymentList, UpcomingpaymentShow } from "./upcomingPayments";
import { MonthlytransactionList, MonthlytransactionShow } from "./mothlyTransactions";
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

const apiUrl = import.meta.env.VITE_API_URL;

const dataProvider = jsonServerProvider(apiUrl + "/", httpClient);

export const App = () => (
    <Admin 
      title="mFlow" 
      dataProvider={dataProvider}  
      authProvider={authProvider}
      dashboard={Dashboard}
      requireAuth >
      <Resource name="assets" list={AssetList} show={AssetShow} icon={AccountBalanceIcon} />
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
      <Resource name="accounts" list={AccountList} show={AccountShow} edit={AccountEdit} /> {/* Assuming you have a users resource, you can use ListGuesser for it. */}
      <Resource name="upcomingPayments" list={UpcomingpaymentList} show={UpcomingpaymentShow} icon={DownloadIcon} /> {/* This resource is only used for the dashboard, so we don't need to specify list, show, edit, or create components. */}
      <Resource name="monthlyTransactions" list={MonthlytransactionList}  show={MonthlytransactionShow} icon={UploadIcon} /> {/* Assuming you have a users resource, you can use ListGuesser for it. */}
      <Resource name="exchangeRates" list={ListGuesser}  show={ShowGuesser} />
    </Admin>
);