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
                width: open ? 200 : 50,
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
                to="/recurrents"
                state={{ _scrollToTop: true }}
                primaryText={"Recurrents"}
                leftIcon={createElement(resources["recurrents"].icon)}
                dense={dense}
            />
            <MenuItemLink
                to="/recurrentTransactions"
                state={{ _scrollToTop: true }}
                primaryText={"Recurrent Transactions"}
                leftIcon={createElement(resources["recurrentTransactions"].icon)}
                dense={dense}
            />
            <MenuItemLink
                to="/payables"
                state={{ _scrollToTop: true }}
                primaryText={"Payables"}
                leftIcon={createElement(resources["payables"].icon)}
                dense={dense}
            />

            <SubMenu
                handleToggle={() => handleToggle('menuAssets')}
                isOpen={state.menuAssets}
                name="Assets"
                icon={createElement(resources["assets"].icon)}
                dense={dense}
            >
                <MenuItemLink
                    to="/assets"
                    state={{ _scrollToTop: true }}
                    primaryText={"Assets"}
                    leftIcon={createElement(resources["assets"].icon)}
                    dense={dense}
                />
                <MenuItemLink
                    to="/accounts"
                    state={{ _scrollToTop: true }}
                    primaryText={"Accounts"}
                    leftIcon={createElement(resources["accounts"].icon)}
                    dense={dense}
                />
                <SubMenu
                    handleToggle={() => handleToggle('menuBonds')}
                    isOpen={state.menuBonds}
                    name="Bonds"
                    icon={createElement(resources["bonds"].icon)}
                    dense={dense}
                >
                    <MenuItemLink
                        to="/bonds"
                        state={{ _scrollToTop: true }}
                        primaryText={"Bonds"}
                        leftIcon={createElement(resources["bonds"].icon)}
                        dense={dense}
                    />
                    <MenuItemLink
                        to="/bondSchedules"
                        state={{ _scrollToTop: true }}
                        primaryText={"Interest Schedules"}
                        leftIcon={createElement(resources["bondSchedules"].icon)}
                        dense={dense}
                    />
                </SubMenu>
                <SubMenu
                    handleToggle={() => handleToggle('menuCD')}
                    isOpen={state.menuCD}
                    name="Deposit Certificates"
                    icon={createElement(resources["depositCertificates"].icon)}
                    dense={dense}
                >
                    <MenuItemLink
                        to="/depositCertificates"
                        state={{ _scrollToTop: true }}
                        primaryText={"Deposit Certificates"}
                        leftIcon={createElement(resources["depositCertificates"].icon)}
                        dense={dense}
                    />
                    <MenuItemLink
                        to="/depositCertificateSchedules"
                        state={{ _scrollToTop: true }}
                        primaryText={"Interest Schedules"}
                        leftIcon={createElement(resources["depositCertificateSchedules"].icon)}
                        dense={dense}
                    />
                </SubMenu>
                <MenuItemLink
                    to="/instruments"
                    state={{ _scrollToTop: true }}
                    primaryText={"Instruments"}
                    leftIcon={createElement(resources["instruments"].icon)}
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
                    to="/upcomingPayments"
                    state={{ _scrollToTop: true }}
                    primaryText={"Upcoming Payments"}
                    leftIcon={createElement(resources["upcomingPayments"].icon)}
                    dense={dense}
                />
                <MenuItemLink
                    to="/monthlyTransactions"
                    state={{ _scrollToTop: true }}
                    primaryText={"Monthly Transactions"}
                    leftIcon={createElement(resources["monthlyTransactions"].icon)}
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
                    to="/dashboard-vh"
                    state={{ _scrollToTop: true }}
                    primaryText={"Valuation History"}
                    leftIcon={<DashboardIcon />}
                    dense={dense}
                />
            </SubMenu>

        </Box>
    );
};

export default Menu;