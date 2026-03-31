import * as React from 'react';
import { useState, createElement } from 'react';

import {
    DashboardMenuItem,
    MenuItemLink,
    MenuProps,
    useSidebarState,
    useResourceDefinitions,
} from 'react-admin';
import clsx from 'clsx';

import SubMenu from './SubMenu';

import { Box } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';

type MenuName = 'menuCD' | 'menuBonds' | 'menuReports' | 'menuAssets';


const Menu = ({ dense = false }: MenuProps) => {
    const [state, setState] = useState({
        menuCD: true,
        menuBonds: true,
        menuReports: true,
        menuAssets: true,
    });
    const resources = useResourceDefinitions();
    const [open] = useSidebarState();

    const handleToggle = (menu: MenuName) => {
        setState(state => ({ ...state, [menu]: !state[menu] }));
    };

    return (
        <Box
            sx={{
                width: open ? 250 : 50,
                marginTop: 1,
                marginBottom: 1,
                transition: theme =>
                    theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
            }}
            className={clsx({
                'RaMenu-open': open,
                'RaMenu-closed': !open,
            })}
        >
            <DashboardMenuItem />
            <MenuItemLink
                to="/assets/recurrents"
                state={{ _scrollToTop: true }}
                primaryText={"Recurrents"}
                leftIcon={createElement(resources["assets/recurrents"].icon)}
                dense={dense}
            />
            <MenuItemLink
                to="/assets/recurrentTransactions"
                state={{ _scrollToTop: true }}
                primaryText={"Recurrent Transactions"}
                leftIcon={createElement(resources["assets/recurrentTransactions"].icon)}
                dense={dense}
            />
            <MenuItemLink
                to="/assets/payables"
                state={{ _scrollToTop: true }}
                primaryText={"Payables"}
                leftIcon={createElement(resources["assets/payables"].icon)}
                dense={dense}
            />

            <SubMenu
                handleToggle={() => handleToggle('menuAssets')}
                isOpen={state.menuAssets}
                name="Assets"
                icon={createElement(resources["assets/assets"].icon)}
                dense={dense}
            >
                <MenuItemLink
                    to="/assets/assets"
                    state={{ _scrollToTop: true }}
                    primaryText={"Assets"}
                    leftIcon={createElement(resources["assets/assets"].icon)}
                    dense={dense}
                />
                <MenuItemLink
                    to="/assets/accounts"
                    state={{ _scrollToTop: true }}
                    primaryText={"Accounts"}
                    leftIcon={createElement(resources["assets/accounts"].icon)}
                    dense={dense}
                />
                <SubMenu
                    handleToggle={() => handleToggle('menuBonds')}
                    isOpen={state.menuBonds}
                    name="Bonds"
                    icon={createElement(resources["assets/bonds"].icon)}
                    dense={dense}
                >
                    <MenuItemLink
                        to="/assets/bonds"
                        state={{ _scrollToTop: true }}
                        primaryText={"Bonds"}
                        leftIcon={createElement(resources["assets/bonds"].icon)}
                        dense={dense}
                    />
                    <MenuItemLink
                        to="/assets/bondSchedules"
                        state={{ _scrollToTop: true }}
                        primaryText={"Interest Schedules"}
                        leftIcon={createElement(resources["assets/bondSchedules"].icon)}
                        dense={dense}
                    />
                </SubMenu>
                <SubMenu
                    handleToggle={() => handleToggle('menuCD')}
                    isOpen={state.menuCD}
                    name="Deposit Certificates"
                    icon={createElement(resources["assets/depositCertificates"].icon)}
                    dense={dense}
                >
                    <MenuItemLink
                        to="/assets/depositCertificates"
                        state={{ _scrollToTop: true }}
                        primaryText={"Deposit Certificates"}
                        leftIcon={createElement(resources["assets/depositCertificates"].icon)}
                        dense={dense}
                    />
                    <MenuItemLink
                        to="/assets/depositCertificateSchedules"
                        state={{ _scrollToTop: true }}
                        primaryText={"Interest Schedules"}
                        leftIcon={createElement(resources["assets/depositCertificateSchedules"].icon)}
                        dense={dense}
                    />
                </SubMenu>
                <MenuItemLink
                    to="/assets/instruments"
                    state={{ _scrollToTop: true }}
                    primaryText={"Instruments"}
                    leftIcon={createElement(resources["assets/instruments"].icon)}
                    dense={dense}
                />
            </SubMenu>
            <SubMenu
                handleToggle={() => handleToggle('menuReports')}
                isOpen={state.menuReports}
                name="Reports"
                icon={<BarChartIcon />}
                dense={dense}
            >
                <MenuItemLink
                    to="/reports/upcoming_payments"
                    state={{ _scrollToTop: true }}
                    primaryText={"Upcoming Payments"}
                    leftIcon={createElement(resources["reports/upcoming_payments"].icon)}
                    dense={dense}
                />
                <MenuItemLink
                    to="/assets/monthlyTransactions"
                    state={{ _scrollToTop: true }}
                    primaryText={"Monthly Transactions"}
                    leftIcon={createElement(resources["assets/monthlyTransactions"].icon)}
                    dense={dense}
                />
                <MenuItemLink
                    to="/exchangeRates"
                    state={{ _scrollToTop: true }}
                    primaryText={"Exchange Rates"}
                    leftIcon={createElement(resources["exchangeRates"].icon)}
                    dense={dense}
                />
                <MenuItemLink
                    to="/dashboard-abl"
                    state={{ _scrollToTop: true }}
                    primaryText={"Asset By Location"}
                    leftIcon={<DashboardIcon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/dashboard-cf"
                    state={{ _scrollToTop: true }}
                    primaryText={"Cash Flow"}
                    leftIcon={<DashboardIcon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/dashboard-vh"
                    state={{ _scrollToTop: true }}
                    primaryText={"Valuation History"}
                    leftIcon={<DashboardIcon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/dashboard-nws"
                    state={{ _scrollToTop: true }}
                    primaryText={"Net Worth Summary"}
                    leftIcon={<DashboardIcon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/dashboard-pa"
                    state={{ _scrollToTop: true }}
                    primaryText={"Projection Analysis"}
                    leftIcon={<DashboardIcon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/dashboard-sa"
                    state={{ _scrollToTop: true }}
                    primaryText={"Spending Analysis"}
                    leftIcon={<DashboardIcon />}
                    dense={dense}
                />
                <MenuItemLink
                    to="/dashboard-ip"
                    state={{ _scrollToTop: true }}
                    primaryText={"Investment Clusters"}
                    leftIcon={<DashboardIcon />}
                    dense={dense}
                />
            </SubMenu>

        </Box>
    );
};

export default Menu;