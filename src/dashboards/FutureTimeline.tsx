import { useState, useEffect, useMemo } from "react";
import { Chart } from "react-google-charts";
import { fetchUtils } from "react-admin";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";

import { formatter, formatNumberWithColor } from "../lib";

const apiUrl = import.meta.env.VITE_API_URL;
const reportRoute = "reports/future_timeline";

// Reference categorical palette, assigned to pools in fixed order.
const SERIES_COLORS = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#4a3aa7",
  "#e34948",
];
const MUTED = "#8a8985";

type Flows = {
  income: number;
  expenses: number;
  interest: number;
  maturities: number;
  sales: number;
  netCashFlow: number;
};

type Month = Flows & {
  id: string;
  date: string;
  cashTotal: number;
  liquidTotal: number;
  netWorth: number;
  balances: Record<string, number>;
  minBalances: Record<string, number>;
  negativePools: string[];
};

type Pool = {
  id: string;
  name: string;
  type: string;
  country: string;
  currency: string;
  isFallback: boolean;
  startBalance: number;
  endBalance: number;
  minBalance: number;
  minDate: string;
  firstNegativeDate: string | null;
  monthsNegative: number;
  requiredTopUp: number;
  requiredTopUpUsd: number;
};

type AssetValue = {
  id: string;
  type: string;
  country: string;
  currency: string;
  growth: string | null;
  soldOn: string | null;
  transferredOn: string | null;
  transferredTo: string | null;
  isPool: boolean;
  startValue: number;
  endValue: number;
  startValueUsd: number;
  endValueUsd: number;
};

type Timeline = {
  summary: {
    startDate: string;
    endDate: string;
    months: number;
    startNetWorth: number;
    endNetWorth: number;
    desiredEstate: number;
    estateGap: number;
    firstNegativeDate: string | null;
    negativePools: number;
    requiredTopUpUsd: number;
    minCashTotal: number;
    minCashTotalDate: string | null;
    onTrack: boolean;
  };
  inflationRates: Record<string, number>;
  fxRates: Record<string, number>;
  warnings: string[];
  pools: Pool[];
  months: Month[];
  assets: AssetValue[];
};

const ym = (date: string | null) => (date ? date.slice(0, 7) : "-");

// Collapse months into calendar years: flows are summed, balances are the
// year-end values and lows are the worst month of the year.
function toYearly(months: Month[]): Month[] {
  const years = new Map<string, Month>();
  for (const m of months) {
    const year = m.date.slice(0, 4);
    const prev = years.get(year);
    if (!prev) {
      years.set(year, { ...m, id: year, minBalances: { ...m.minBalances } });
      continue;
    }
    const minBalances = { ...prev.minBalances };
    for (const [key, value] of Object.entries(m.minBalances)) {
      minBalances[key] = Math.min(minBalances[key] ?? value, value);
    }
    years.set(year, {
      ...m,
      id: year,
      income: prev.income + m.income,
      expenses: prev.expenses + m.expenses,
      interest: prev.interest + m.interest,
      maturities: prev.maturities + m.maturities,
      sales: prev.sales + m.sales,
      netCashFlow: prev.netCashFlow + m.netCashFlow,
      minBalances,
      negativePools: [...new Set([...prev.negativePools, ...m.negativePools])],
    });
  }
  return [...years.values()];
}

const SummaryCard = ({
  title,
  value,
  detail,
}: {
  title: string;
  value: React.ReactNode;
  detail?: React.ReactNode;
}) => (
  <Card sx={{ flex: 1, minWidth: 200 }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5">{value}</Typography>
      {detail && (
        <Typography variant="caption" color="text.secondary">
          {detail}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export const DashboardFutureTimeline = () => {
  const [data, setData] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [capitalGrowth, setCapitalGrowth] = useState(false);
  const [granularity, setGranularity] = useState<"yearly" | "monthly">(
    "yearly",
  );

  useEffect(() => {
    setLoading(true);
    fetchUtils
      .fetchJson(
        `${apiUrl}${reportRoute}?capitalGrowth=${capitalGrowth ? 1 : 0}`,
        { user: { authenticated: true }, credentials: "include" },
      )
      .then((response) => {
        setData(response.json);
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [capitalGrowth]);

  const rows = useMemo(() => {
    if (!data) return [];
    return granularity === "yearly" ? toYearly(data.months) : data.months;
  }, [data, granularity]);

  if (loading && !data) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return null;

  const { summary, pools, fxRates } = data;
  const usd = (value: number, currency: string) =>
    value / (fxRates[currency] ?? 1);
  const poolColor = (index: number) => SERIES_COLORS[index] ?? MUTED;

  // Pools in the chart are converted to USD so they share one axis; the lowest
  // point of each month is plotted because that's where a pool overdraws.
  const poolChart = [
    ["Month", ...pools.map((p) => `${p.name} (${p.currency})`)],
    ...data.months.map((m) => [
      new Date(`${m.date}T00:00:00`),
      ...pools.map((p) => usd(m.minBalances[p.id], p.currency)),
    ]),
  ];

  const netWorthChart = [
    ["Month", "Net worth", "Desired estate"],
    ...data.months.map((m) => [
      new Date(`${m.date}T00:00:00`),
      m.netWorth,
      summary.desiredEstate,
    ]),
  ];

  const chartBase = {
    legend: { position: "top", maxLines: 3 },
    hAxis: { format: "yyyy", gridlines: { color: "#eeeeec" } },
    vAxis: {
      format: "short",
      gridlines: { color: "#eeeeec" },
      baselineColor: "#52514e",
    },
    lineWidth: 2,
    focusTarget: "category",
    crosshair: { trigger: "focus", orientation: "vertical", color: MUTED },
    chartArea: { left: 70, right: 20, top: 70, bottom: 40 },
  };

  const shortfall = summary.firstNegativeDate !== null;

  return (
    <Stack spacing={2} sx={{ mt: 2, mb: 4 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: "center", flexWrap: "wrap" }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Future timeline {ym(summary.startDate)} → {ym(summary.endDate)}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={capitalGrowth}
              onChange={(e) => setCapitalGrowth(e.target.checked)}
              disabled={loading}
            />
          }
          label="Include instrument appreciation"
        />
      </Stack>

      {shortfall ? (
        <Alert severity="error" icon={<WarningIcon />}>
          {summary.negativePools} target account
          {summary.negativePools === 1 ? "" : "s"} go negative, first in{" "}
          <b>{ym(summary.firstNegativeDate)}</b>; together they would need{" "}
          <b>{formatter.format(summary.requiredTopUpUsd)} USD</b> to never dip
          below zero.{" "}
          {summary.minCashTotal >= 0 ? (
            <>
              Total cash across target accounts never goes below zero, so moving
              money between accounts (or retargeting income) is enough.
            </>
          ) : (
            <>
              Even after moving money between accounts, total cash bottoms at{" "}
              <b>{formatter.format(summary.minCashTotal)} USD</b> in{" "}
              {ym(summary.minCashTotalDate)}: that much new cash (or fewer
              expenses, or selling non-cash assets) is needed.
            </>
          )}
        </Alert>
      ) : (
        <Alert severity="success" icon={<CheckCircleIcon />}>
          No target account goes negative before {ym(summary.endDate)}.
        </Alert>
      )}
      {data.warnings.map((w) => (
        <Alert severity="warning" key={w}>
          {w}
        </Alert>
      ))}

      <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
        <SummaryCard
          title="Net worth today"
          value={formatter.format(summary.startNetWorth)}
          detail="USD"
        />
        <SummaryCard
          title={`Net worth at ${ym(summary.endDate)}`}
          value={formatNumberWithColor(summary.endNetWorth)}
          detail={
            <>
              Desired estate {formatter.format(summary.desiredEstate)} · gap{" "}
              {formatNumberWithColor(summary.estateGap)}
            </>
          }
        />
        <SummaryCard
          title="Lowest total cash"
          value={formatNumberWithColor(summary.minCashTotal)}
          detail={`USD in ${ym(summary.minCashTotalDate)}`}
        />
        <SummaryCard
          title="Inflation used"
          value={Object.entries(data.inflationRates)
            .map(([c, r]) => `${c} ${(r * 100).toFixed(1)}%`)
            .join(" · ")}
          detail="Applied to expenses, income, yearly payables and housing (not loans)"
        />
      </Stack>

      <Paper sx={{ p: 1 }}>
        <Chart
          chartType="LineChart"
          width="100%"
          height="420px"
          data={poolChart}
          options={{
            ...chartBase,
            title: "Lowest monthly balance per target account (USD)",
            colors: pools.map((_, i) => poolColor(i)),
          }}
          legendToggle
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Target account</TableCell>
              <TableCell align="right">Today</TableCell>
              <TableCell align="right">Lowest</TableCell>
              <TableCell>Lowest in</TableCell>
              <TableCell>First negative</TableCell>
              <TableCell align="right">Months negative</TableCell>
              <TableCell align="right">Top-up needed</TableCell>
              <TableCell align="right">At end</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pools.map((p, i) => (
              <TableRow key={p.id} hover>
                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 3,
                        borderRadius: 2,
                        background: poolColor(i),
                        display: "inline-block",
                      }}
                    />
                    <span>
                      {p.name} <small>{p.currency}</small>
                    </span>
                    {p.isFallback && (
                      <Chip size="small" label="no target set" />
                    )}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  {formatNumberWithColor(p.startBalance)}
                </TableCell>
                <TableCell align="right">
                  {formatNumberWithColor(p.minBalance)}
                </TableCell>
                <TableCell>{ym(p.minDate)}</TableCell>
                <TableCell>
                  {p.firstNegativeDate ? (
                    <Chip
                      size="small"
                      color="error"
                      icon={<WarningIcon />}
                      label={ym(p.firstNegativeDate)}
                    />
                  ) : (
                    <Chip
                      size="small"
                      color="success"
                      variant="outlined"
                      icon={<CheckCircleIcon />}
                      label="Never"
                    />
                  )}
                </TableCell>
                <TableCell align="right">{p.monthsNegative}</TableCell>
                <TableCell align="right">
                  {p.requiredTopUp > 0
                    ? `${formatter.format(p.requiredTopUp)} ${p.currency}`
                    : "-"}
                </TableCell>
                <TableCell align="right">
                  {formatNumberWithColor(p.endBalance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper sx={{ p: 1 }}>
        <Chart
          chartType="LineChart"
          width="100%"
          height="320px"
          data={netWorthChart}
          options={{
            ...chartBase,
            title: "Net worth vs desired estate (USD)",
            colors: [SERIES_COLORS[0], MUTED],
            series: { 1: { lineDashStyle: [6, 4] } },
          }}
        />
      </Paper>

      <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Balances
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={granularity}
          onChange={(_, value) => value && setGranularity(value)}
        >
          <ToggleButton value="yearly">Yearly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                {granularity === "yearly" ? "Year" : "Month"}
              </TableCell>
              <TableCell align="right">Income</TableCell>
              <TableCell align="right">Expenses</TableCell>
              <TableCell align="right">Interest</TableCell>
              <TableCell align="right">Maturities</TableCell>
              <TableCell align="right">Sales</TableCell>
              <TableCell align="right">Net flow</TableCell>
              {pools.map((p) => (
                <TableCell align="right" key={p.id}>
                  {p.name} <small>{p.currency}</small>
                </TableCell>
              ))}
              <TableCell align="right">Cash (USD)</TableCell>
              <TableCell align="right">Net worth (USD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((m) => (
              <TableRow
                key={m.id}
                hover
                sx={
                  m.negativePools.length
                    ? { backgroundColor: "rgba(227, 73, 72, 0.06)" }
                    : undefined
                }
              >
                <TableCell>{m.id}</TableCell>
                <TableCell align="right">
                  {formatter.format(m.income)}
                </TableCell>
                <TableCell align="right">
                  {formatNumberWithColor(m.expenses)}
                </TableCell>
                <TableCell align="right">
                  {formatter.format(m.interest)}
                </TableCell>
                <TableCell align="right">
                  {formatter.format(m.maturities)}
                </TableCell>
                <TableCell align="right">{formatter.format(m.sales)}</TableCell>
                <TableCell align="right">
                  {formatNumberWithColor(m.netCashFlow)}
                </TableCell>
                {pools.map((p) => (
                  <TableCell
                    align="right"
                    key={p.id}
                    title={`Lowest this period: ${formatter.format(m.minBalances[p.id])}`}
                  >
                    {formatNumberWithColor(m.balances[p.id])}
                  </TableCell>
                ))}
                <TableCell align="right">
                  {formatNumberWithColor(m.cashTotal)}
                </TableCell>
                <TableCell align="right">
                  {formatNumberWithColor(m.netWorth)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6">
        Asset values at {ym(summary.endDate)}
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Growth</TableCell>
              <TableCell align="right">Today (USD)</TableCell>
              <TableCell align="right">At end (USD)</TableCell>
              <TableCell align="right">At end (native)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.assets.map((a) => (
              <TableRow key={a.id} hover>
                <TableCell>{a.id}</TableCell>
                <TableCell>{a.type}</TableCell>
                <TableCell>{a.country}</TableCell>
                <TableCell>
                  {a.soldOn
                    ? `sold ${a.soldOn}`
                    : a.transferredOn
                      ? `moved to ${a.transferredTo} ${a.transferredOn}`
                      : (a.growth ?? (a.isPool ? "cash pool" : "-"))}
                </TableCell>
                <TableCell align="right">
                  {formatNumberWithColor(a.startValueUsd)}
                </TableCell>
                <TableCell align="right">
                  {formatNumberWithColor(a.endValueUsd)}
                </TableCell>
                <TableCell align="right">
                  {formatNumberWithColor(a.endValue)}{" "}
                  <small>{a.currency}</small>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
