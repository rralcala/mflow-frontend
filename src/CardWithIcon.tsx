import * as React from 'react';
import { FC, createElement, ReactNode } from 'react';
import { Card, Box, Typography, Divider } from '@mui/material';
import { Link, To } from 'react-router-dom';
import { NumberField, RecordContextProvider, TextField } from 'react-admin';
import { Stack } from '@mui/material';

interface Props {
    icon: FC<any>;
    to: To;
    title?: string;
    subtitle?: any;
    children?: ReactNode;
}

export const CardWithIcon = ({ icon, title, subtitle, to, children }: Props) => (
    <Card
        sx={{
            minHeight: 52,
            display: 'flex',
            flexDirection: 'column',
            flex: '1',
            '& a': {
                textDecoration: 'none',
                color: 'inherit',
            },
        }}
    >
        <Link to={to}>
            <Box
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '& .icon': {
                        color: 'secondary.main',
                    },
                    '&:before': {
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        display: 'block',
                        content: `''`,
                        height: '200%',
                        aspectRatio: '1',
                        transform: 'translate(-30%, -60%)',
                        borderRadius: '50%',
                        backgroundColor: 'secondary.main',
                        opacity: 0.15,
                    },
                }}
            >
                <Box
                    className="icon"
                    sx={{
                        width: '3em',
                    }}
                >
                    {createElement(icon, { fontSize: 'large' })}
                </Box>
                <Box
                    sx={{
                        textAlign: 'right',
                    }}
                >
                    <Typography color="textSecondary">{title}</Typography>
                    <RecordContextProvider value={subtitle}>
                    <Typography variant="h5" component="h2">
                        <Stack spacing={1} direction="row"> 
                            <span>
                        <NumberField source="amount"  options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                }}/> </span>
                        <span>
                        <TextField source="currency"
                        />
                        </span>
                        </Stack>
                    </Typography>
                    </RecordContextProvider>
                </Box>
            </Box>
        </Link>
        {children && <Divider />}
        {children}
    </Card>
);

export default CardWithIcon;