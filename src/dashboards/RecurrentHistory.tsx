import { Fragment, useEffect, useState } from "react";
import { fetchUtils } from "react-admin";
import { Link as RouterLink } from "react-router";
import {
  Alert,
  Card,
  CardContent,
  Link,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import { FLOW_CLASSES, formatNumberWithColor, formatter } from "../lib";

const apiUrl = import.meta.env.VITE_API_URL;
const reportRoute = "reports/recurrent_history";

type Stats = {
  total: number;
  transactions: number;
  activeMonths: number;
  monthlyAverage: number;
  activeAverage: number | null;
  median: number;
  min: number;
  max: number;
  stdDev: number;
};

type Series = {
  id: string;
  currency: string | null;
  flowClass: string | null;
  // The recurrent was deleted but its transactions remain.
  missing: boolean;
  // The recurrent's stored amount, null when it was deleted.
  target: number | null;
  months: number[];
  stats: Stats;
};

type Report = {
  months: string[];
  recurrents: Series[];
  totals: { currency: string; months: number[]; stats: Stats }[];
};

const STAT_COLUMNS: { key: keyof Stats; label: string; count?: boolean }[] = [
  { key: "total", label: "Total" },
  { key: "monthlyAverage", label: "Avg / month" },
  { key: "activeAverage", label: "Avg / active month" },
  { key: "median", label: "Median" },
  { key: "min", label: "Min" },
  { key: "max", label: "Max" },
  { key: "stdDev", label: "Std dev" },
  { key: "activeMonths", label: "Active months", count: true },
  { key: "transactions", label: "Transactions", count: true },
];

const toYearMonth = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const defaultRange = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 11, 15);
  return { start: toYearMonth(start), end: toYearMonth(today) };
};

const transactionsLink = (recurrentId: string, yearMonth?: string) =>
  `/assets/recurrentTransactions?filter=${encodeURIComponent(
    JSON.stringify(yearMonth ? { recurrentId, yearMonth } : { recurrentId }),
  )}`;

const amount = (value: number | null) =>
  value === null ? "-" : formatNumberWithColor(value);

// A month meets its target when it's at least the recurrent's amount, for
// income (100 target: 100 or 110 is fine) and expenses alike (-100 target:
// -90 is fine, -110 went over). Without a target (deleted recurrent or a zero
// amount) only the sign is shown: negatives red, everything else default.
const targetColor = (value: number, target: number | null) => {
  if (value === 0) return "text.primary";
  if (!target) return value < 0 ? "error.main" : "text.primary";
  return value >= target ? "success.main" : "error.main";
};

const stickySx = {
  position: "sticky",
  left: 0,
  zIndex: 1,
  bgcolor: "background.paper",
  whiteSpace: "nowrap",
} as const;

export const DashboardRecurrentHistory = () => {
  const [range, setRange] = useState(defaultRange);
  const [flowClass, setFlowClass] = useState("");
  const [view, setView] = useState<"months" | "stats">("months");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!range.start || !range.end) return;
    const params = new URLSearchParams({
      startYearMonth: range.start,
      endYearMonth: range.end,
    });
    if (flowClass) params.set("flowClass", flowClass);
    let current = true;
    setLoading(true);
    fetchUtils
      .fetchJson(`${apiUrl}${reportRoute}?${params}`, {
        user: { authenticated: true },
        credentials: "include",
      })
      .then((response) => {
        if (!current) return;
        setReport(response.json);
        setError(null);
      })
      .catch((e) => current && setError(e.message))
      .finally(() => current && setLoading(false));
    // Drop responses for a range that has since changed.
    return () => {
      current = false;
    };
  }, [range, flowClass]);

  // Recurrents grouped by currency, deleted recurrents last.
  const groups: { currency: string | null; rows: Series[] }[] = [];
  for (const row of report?.recurrents ?? []) {
    let group = groups.find((g) => g.currency === row.currency);
    if (!group) {
      group = { currency: row.currency, rows: [] };
      groups.push(group);
    }
    group.rows.push(row);
  }
  groups.sort((a, b) =>
    a.currency === null
      ? 1
      : b.currency === null
        ? -1
        : a.currency.localeCompare(b.currency),
  );

  const months = report?.months ?? [];

  // Month cells of a recurrent are colored against its target; total rows
  // keep the plain formatting.
  const monthCell = (value: number, month: string, row?: Series) => {
    if (!row) {
      return value === 0 ? (
        <Typography component="span" color="text.disabled">
          -
        </Typography>
      ) : (
        amount(value)
      );
    }
    const text = (
      <Typography
        component="span"
        variant="body2"
        sx={{ color: targetColor(value, row.target) }}
      >
        {formatter.format(value)}
      </Typography>
    );
    return value === 0 ? (
      text
    ) : (
      <Link
        component={RouterLink}
        to={transactionsLink(row.id, month)}
        underline="hover"
        color="inherit"
      >
        {text}
      </Link>
    );
  };

  const valueCells = (values: number[], stats: Stats, row?: Series) =>
    view === "months" ? (
      <>
        {values.map((value, i) => (
          <TableCell key={months[i]} align="right">
            {monthCell(value, months[i], row)}
          </TableCell>
        ))}
        <TableCell align="right">{amount(stats.total)}</TableCell>
      </>
    ) : (
      STAT_COLUMNS.map(({ key, count }) => (
        <TableCell key={key} align="right">
          {count ? stats[key] : amount(stats[key])}
        </TableCell>
      ))
    );

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Recurrent History</Typography>
          <Stack
            direction="row"
            spacing={2}
            useFlexGap
            sx={{ alignItems: "center", flexWrap: "wrap" }}
          >
            <TextField
              type="month"
              size="small"
              label="From"
              value={range.start}
              onChange={(e) => setRange({ ...range, start: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              type="month"
              size="small"
              label="To"
              value={range.end}
              onChange={(e) => setRange({ ...range, end: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              select
              size="small"
              label="Flow class"
              value={flowClass}
              onChange={(e) => setFlowClass(e.target.value)}
              slotProps={{
                select: { displayEmpty: true },
                inputLabel: { shrink: true },
              }}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">All</MenuItem>
              {FLOW_CLASSES.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
            <ToggleButtonGroup
              size="small"
              exclusive
              value={view}
              onChange={(_, value) => value && setView(value)}
            >
              <ToggleButton value="months">Months</ToggleButton>
              <ToggleButton value="stats">Statistics</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Recorded transactions only. Months are green when they reach the
            amount set on the recurrent and red when they fall short of it.
            Statistics use one total per month in the range, counting months
            without transactions as zero.
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {!error && loading && !report && <p>Loading...</p>}
          {!error && report && report.recurrents.length === 0 && (
            <Alert severity="info">No transactions in this range.</Alert>
          )}
          {!error && report && report.recurrents.length > 0 && (
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ opacity: loading ? 0.6 : 1 }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={stickySx}>Recurrent</TableCell>
                    {view === "months" ? (
                      <>
                        {months.map((month) => (
                          <TableCell
                            key={month}
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {month}
                          </TableCell>
                        ))}
                        <TableCell align="right">Total</TableCell>
                      </>
                    ) : (
                      STAT_COLUMNS.map(({ key, label }) => (
                        <TableCell key={key} align="right">
                          {label}
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groups.map((group) => {
                    const total = report.totals.find(
                      (t) => t.currency === group.currency,
                    );
                    return (
                      <Fragment key={group.currency ?? "missing"}>
                        <TableRow>
                          <TableCell
                            colSpan={
                              1 +
                              (view === "months"
                                ? months.length + 1
                                : STAT_COLUMNS.length)
                            }
                            sx={{ bgcolor: "action.hover", fontWeight: "bold" }}
                          >
                            {group.currency ?? "Deleted recurrents"}
                          </TableCell>
                        </TableRow>
                        {group.rows.map((row) => (
                          <TableRow key={row.id} hover>
                            <TableCell sx={stickySx}>
                              {row.missing ? (
                                row.id
                              ) : (
                                <Link
                                  component={RouterLink}
                                  to={transactionsLink(row.id)}
                                  underline="hover"
                                >
                                  {row.id}
                                </Link>
                              )}
                              {row.flowClass && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ ml: 1 }}
                                >
                                  {row.flowClass}
                                </Typography>
                              )}
                            </TableCell>
                            {valueCells(row.months, row.stats, row)}
                          </TableRow>
                        ))}
                        {total && (
                          <TableRow sx={{ "& td": { fontWeight: "bold" } }}>
                            <TableCell sx={stickySx}>
                              Total {total.currency}
                            </TableCell>
                            {valueCells(total.months, total.stats)}
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
