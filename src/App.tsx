import { Admin, Resource, CustomRoutes } from "react-admin";
import jsonServerProvider from 'ra-data-json-server';
import { Route } from "react-router";

import { authProvider } from './authProvider';
import { httpClient } from './httpClient';

import { Layout } from "./layout";

import { AccountShow, AccountList, AccountEdit, AccountCreate } from "./accounts";
import { AssetList, AssetShow } from "./assets";
import { BondList, BondShow } from "./bonds";
import { BondscheduleEdit, BondscheduleList, BondscheduleShow } from "./bondSchedules";
import { DepositCertificateList, DepositCertificateShow } from "./depositCertificates";
import { DepositCertificateScheduleEdit, DepositCertificateScheduleShow, DepositCertificateSchedulesList } from "./depositCertificateSchedules";
import { ExchangerateList } from "./exchangeRates";
import { InstrumentEdit, InstrumentList, InstrumentShow, InstrumentCreate } from "./instruments";
import { MonthlytransactionList, MonthlytransactionShow } from "./mothlyTransactions";
import { PayableList, PayableShow, PayableEdit, PayableCreate } from "./payables";
import { RecurrentList, RecurrentShow, RecurrentEdit, RecurrentCreate } from "./recurrents";
import { RecurrenttransactionList, RecurrenttransactionShow, RecurrenttransactionEdit, RecurrenttransactionCreate } from "./recurrentTransaction";
import { UpcomingpaymentList, UpcomingpaymentShow } from "./upcomingPayments";
import {
  Dashboard,
  DashboardAssetByLocation,
  DashboardCashFlow,
  DashboardInvestmentPerformance,
  DashboardNetWorthSummary,
  DashboardProjectionAnalysis,
  DashboardSpendingAnalysis,
  DashboardValuationHistory,
}
  from "./dashboards";

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import ChecklistIcon from '@mui/icons-material/Checklist';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DownloadIcon from '@mui/icons-material/Download';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SavingsIcon from '@mui/icons-material/Savings';
import UploadIcon from '@mui/icons-material/Upload';

const apiUrl = import.meta.env.VITE_API_URL;

const dataProvider = jsonServerProvider(apiUrl + "/", httpClient);

export const App = () => (
  <Admin
    title="mFlow"
    disableTelemetry
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={Dashboard}
    layout={Layout}
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
    <Resource name="accounts" list={AccountList} show={AccountShow} edit={AccountEdit} create={AccountCreate} icon={SavingsIcon} />
    <Resource name="bonds" list={BondList} show={BondShow} icon={RequestQuoteIcon} />
    <Resource name="bondSchedules" list={BondscheduleList} show={BondscheduleShow} edit={BondscheduleEdit} icon={ChecklistIcon} />
    <Resource name="depositCertificates" list={DepositCertificateList} show={DepositCertificateShow} icon={RequestQuoteIcon} />
    <Resource name="depositCertificateSchedules" list={DepositCertificateSchedulesList} show={DepositCertificateScheduleShow} edit={DepositCertificateScheduleEdit} icon={ChecklistIcon} />
    <Resource name="instruments" list={InstrumentList} show={InstrumentShow} edit={InstrumentEdit} create={InstrumentCreate} icon={CandlestickChartIcon} />

    <Resource name="reports/upcoming_payments" list={UpcomingpaymentList} show={UpcomingpaymentShow} icon={DownloadIcon} />
    <Resource name="monthlyTransactions" list={MonthlytransactionList} show={MonthlytransactionShow} icon={UploadIcon} />
    <Resource name="exchangeRates" list={ExchangerateList} icon={CurrencyExchangeIcon} />
    <CustomRoutes>
      <Route path="/dashboard-abl" element={<DashboardAssetByLocation />} />
      <Route path="/dashboard-vh" element={<DashboardValuationHistory />} />
      <Route path="/dashboard-nws" element={<DashboardNetWorthSummary />} />
      <Route path="/dashboard-pa" element={<DashboardProjectionAnalysis />} />
      <Route path="/dashboard-sa" element={<DashboardSpendingAnalysis />} />
      <Route path="/dashboard-cf" element={<DashboardCashFlow />} />
      <Route path="/dashboard-ip" element={<DashboardInvestmentPerformance />} />
    </CustomRoutes>

  </Admin>
);