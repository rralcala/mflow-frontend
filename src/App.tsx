import { Admin, Resource, CustomRoutes } from "react-admin";
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
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { Route } from "react-router";
import { BondList, BondShow } from "./bonds";
import { BondscheduleEdit, BondscheduleList, BondscheduleShow } from "./bondSchedules";
import { InstrumentEdit, InstrumentList, InstrumentShow, InstrumentCreate } from "./instruments";
import { DepositCertificateList, DepositCertificateShow } from "./depositCertificates";
import { DepositCertificateScheduleEdit, DepositCertificateScheduleShow, DepositCertificateSchedulesList } from "./depositCertificateSchedules";
import { PayableList, PayableShow, PayableEdit, PayableCreate } from "./payables";

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
      <Resource name="payables" list={PayableList} show={PayableShow} edit={PayableEdit} create={PayableCreate} icon={ReceiptIcon} />
      
      <Resource name="assets" list={AssetList} show={AssetShow} icon={AccountBalanceIcon} />
      <Resource name="accounts" list={AccountList} show={AccountShow} edit={AccountEdit} icon={SavingsIcon} />
      <Resource name="bonds" list={BondList} show={BondShow} icon={RequestQuoteIcon} />
      <Resource name="bondSchedules" list={BondscheduleList} show={BondscheduleShow} edit={BondscheduleEdit}  icon={RequestQuoteIcon} />
      <Resource name="depositCertificates" list={DepositCertificateList} show={DepositCertificateShow} icon={RequestQuoteIcon} />
      <Resource name="depositCertificateSchedules" list={DepositCertificateSchedulesList} show={DepositCertificateScheduleShow} edit={DepositCertificateScheduleEdit}  icon={RequestQuoteIcon} />
      <Resource name="instruments" list={InstrumentList} show={InstrumentShow} edit={InstrumentEdit} create={InstrumentCreate} icon={AccountBalanceIcon} />
      
      <Resource name="upcomingPayments" list={UpcomingpaymentList} show={UpcomingpaymentShow} icon={DownloadIcon} />
      <Resource name="monthlyTransactions" list={MonthlytransactionList}  show={MonthlytransactionShow} icon={UploadIcon} />
      <Resource name="exchangeRates" list={ExchangerateList} icon={CurrencyExchangeIcon} />
      <CustomRoutes>
        <Route path="/dashboard-cf" element={<DashboardCashFlow />} />
    </CustomRoutes>

    </Admin>
);