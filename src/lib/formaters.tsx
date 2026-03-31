import { ReactNode } from 'react';

export const formatterPct = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,

});

export const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    useGrouping: true,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
});

export function formatNumberWithColor(value: number): ReactNode {
    const formatted = formatter.format(value);
    if (value < 0) {
        return <span style={{ color: 'red' }}>{formatted}</span>;
    }
    return <span>{formatted}</span>;
}

export function formatPctWithNan(value: number): ReactNode {
    if (isNaN(value)) {
        return <span>-</span>;
    }
    return formatterPct.format(value);
}
