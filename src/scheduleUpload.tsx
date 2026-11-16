import { ChangeEvent, useState } from "react";
import {
  RaRecord,
  Title,
  useGetList,
  useNotify,
  useRedirect,
} from "react-admin";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
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

import { httpClient } from "./httpClient";

const apiUrl = import.meta.env.VITE_API_URL;

type Kind = "bond" | "cd";

// Each kind has its own schedule table, so CDs post to their own endpoint.
const KINDS: Record<
  Kind,
  { label: string; resource: string; upload: string; list: string }
> = {
  bond: {
    label: "Bond",
    resource: "assets/bonds",
    upload: "assets/bondSchedulesUpload",
    list: "assets/bondSchedules",
  },
  cd: {
    label: "Deposit Certificate",
    resource: "assets/depositCertificates",
    upload: "assets/cdSchedulesUpload",
    list: "assets/depositCertificateSchedules",
  },
};

interface ScheduleRow {
  date: string;
  amount: string;
  paid: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const rowError = (row: ScheduleRow) => {
  if (!DATE_RE.test(row.date)) return "date must be YYYY-MM-DD";
  if (row.amount === "" || !Number.isFinite(Number(row.amount)))
    return "amount must be a number";
  if (row.paid !== "0" && row.paid !== "1") return "paid must be 0 or 1";
  return null;
};

// Reads `date,amount,paid` columns (any order). An `iid` column is dropped:
// the selected bond or CD is sent as the `iid` query parameter, which the API
// applies to every row in place of the CSV's own.
const parseCsv = (text: string): ScheduleRow[] => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) throw new Error("The file is empty");
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const index = (name: string) => header.indexOf(name);
  for (const name of ["date", "amount"]) {
    if (index(name) < 0) throw new Error(`Missing a "${name}" column`);
  }
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const paid = index("paid") >= 0 ? cells[index("paid")] : "0";
    return {
      date: cells[index("date")] ?? "",
      amount: cells[index("amount")] ?? "",
      paid: paid === "" ? "0" : paid,
    };
  });
};

const toCsv = (rows: ScheduleRow[]) =>
  ["date,amount,paid"]
    .concat(rows.map((r) => `${r.date},${r.amount},${r.paid}`))
    .join("\n");

export const ScheduleUpload = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [kind, setKind] = useState<Kind>("bond");
  const [target, setTarget] = useState<RaRecord | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<ScheduleRow[]>([]);
  const [busy, setBusy] = useState(false);

  const config = KINDS[kind];
  const { data: options = [], isPending } = useGetList<RaRecord>(
    config.resource,
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "name", order: "ASC" },
    },
  );

  const errors = rows.map(rowError);
  const invalid = errors.filter(Boolean).length;
  const ready = !!target && rows.length > 0 && invalid === 0;

  const chooseFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Let the same file be chosen again after a fix.
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = parseCsv(await file.text());
      if (!parsed.length) throw new Error("The file has no rows");
      setRows(parsed);
      setFileName(file.name);
    } catch (error) {
      setRows([]);
      setFileName(null);
      notify((error as Error).message, { type: "error" });
    }
  };

  const upload = async () => {
    if (!target) return;
    setBusy(true);
    try {
      const { json } = await httpClient(
        `${apiUrl}/${config.upload}?iid=${encodeURIComponent(target.id)}`,
        {
          method: "POST",
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "text/csv",
          }),
          body: toCsv(rows),
        },
      );
      notify(`${target.name}: ${json.message}`, { type: "success" });
      redirect("list", config.list);
    } catch (error) {
      notify((error as Error).message || "Upload failed", { type: "error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card sx={{ mt: 2 }}>
      <Title title="Upload Interest Schedule" />
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 2 }}
          >
            <ToggleButtonGroup
              exclusive
              size="small"
              value={kind}
              onChange={(_, value: Kind | null) => {
                if (value) {
                  setKind(value);
                  setTarget(null);
                }
              }}
            >
              {(Object.keys(KINDS) as Kind[]).map((k) => (
                <ToggleButton key={k} value={k}>
                  {KINDS[k].label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Autocomplete
              size="small"
              loading={isPending}
              options={options}
              value={target}
              onChange={(_, value) => setTarget(value)}
              getOptionLabel={(o) => `${o.name} (#${o.id})`}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              sx={{ width: 320 }}
              renderInput={(params) => (
                <TextField {...params} label={config.label} />
              )}
            />
            <Button variant="outlined" component="label">
              {fileName ?? "Choose CSV"}
              <input
                hidden
                type="file"
                accept=".csv,text/csv"
                onChange={chooseFile}
              />
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            CSV with a header row and columns <code>date,amount,paid</code>{" "}
            (date as YYYY-MM-DD, paid as 0 or 1, defaults to 0). An{" "}
            <code>iid</code> column is ignored; rows go to the selected{" "}
            {config.label.toLowerCase()}.
          </Typography>

          {rows.length > 0 && (
            <>
              <TableContainer sx={{ maxHeight: 480 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Paid</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell align="right">{row.amount}</TableCell>
                        <TableCell>{row.paid === "1" ? "Yes" : "No"}</TableCell>
                        <TableCell sx={{ color: "error.main" }}>
                          {errors[i]}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box>
                <Button
                  variant="contained"
                  onClick={upload}
                  disabled={!ready || busy}
                >
                  Upload {rows.length} row{rows.length === 1 ? "" : "s"}
                </Button>
                {!ready && (
                  <Typography
                    variant="body2"
                    color="error"
                    component="span"
                    sx={{ ml: 2 }}
                  >
                    {invalid
                      ? `Fix ${invalid} invalid row${invalid === 1 ? "" : "s"} first.`
                      : `Select a ${config.label.toLowerCase()}.`}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
