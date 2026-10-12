import { ChangeEvent, useMemo, useState } from "react";
import {
  Button as RaButton,
  RaRecord,
  Title,
  useGetList,
  useNotify,
  useRedirect,
} from "react-admin";
import { Link as RouterLink } from "react-router";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Chip,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

import { httpClient } from "./httpClient";

const apiUrl = import.meta.env.VITE_API_URL;

interface Parser {
  id: string;
  name: string;
  description: string;
  extensions: string[];
  maxBytes: number;
}

// "imported" rows come back with the saved transaction's values.
type RowStatus = "new" | "imported" | "ignored";
type RowAction = "import" | "ignore" | "skip";

interface ParsedRow {
  importHash: string;
  transactionDate: string;
  yearMonth: string;
  description: string;
  amount: number | string;
  recurrentId: string | null;
  paidWithAssetId: string | null;
  status: RowStatus;
  transactionId: number | null;
  action: RowAction;
}

const ACTION_LABELS: Record<RowAction, string> = {
  import: "Import",
  ignore: "Ignore",
  skip: "Skip",
};

// Imported rows have no choices; ignored rows are already ignored.
const ACTIONS: Record<RowStatus, RowAction[]> = {
  new: ["import", "ignore", "skip"],
  ignored: ["import", "skip"],
  imported: [],
};

const DEFAULT_ACTION: Record<RowStatus, RowAction> = {
  new: "import",
  ignored: "skip",
  imported: "skip",
};

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

const extensionOf = (name: string) => {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot).toLowerCase() : "";
};

// Mirrors the backend check, so a bad file is refused before uploading.
const fileError = (file: File, parser: Parser) => {
  if (!parser.extensions.includes(extensionOf(file.name))) {
    return `${parser.name} only reads ${parser.extensions.join(", ")} files`;
  }
  if (file.size > parser.maxBytes) {
    return `File is larger than ${parser.maxBytes / (1024 * 1024)} MB`;
  }
  return null;
};

// Shared by the bulk "apply" controls and every row.
const IdAutocomplete = ({
  label,
  options,
  value,
  onChange,
  width,
  error = false,
  disabled = false,
}: {
  label?: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  width: number;
  error?: boolean;
  disabled?: boolean;
}) => (
  <Autocomplete
    size="small"
    disabled={disabled}
    options={options}
    value={value}
    onChange={(_, newValue) => onChange(newValue)}
    sx={{ width }}
    renderInput={(params) => (
      <TextField {...params} label={label} error={error && !value} />
    )}
  />
);

const isComplete = (row: ParsedRow) =>
  !!row.recurrentId &&
  !!row.paidWithAssetId &&
  /^\d{4}-(0[1-9]|1[0-2])$/.test(row.yearMonth) &&
  row.amount !== "" &&
  Number.isFinite(Number(row.amount));

export const RecurrentTransactionImport = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [parserId, setParserId] = useState("generic_csv");
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [bulkRecurrent, setBulkRecurrent] = useState<string | null>(null);
  const [bulkPaidWith, setBulkPaidWith] = useState<string | null>(null);

  const { data: parsers = [] } = useGetList<Parser & RaRecord>(
    "assets/transactionParsers",
  );
  const { data: recurrents = [] } = useGetList<RaRecord>("assets/recurrents", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "id", order: "ASC" },
  });
  const { data: assets = [] } = useGetList<RaRecord>("assets/assets", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "id", order: "ASC" },
    filter: { liquid: true },
  });
  const recurrentIds = useMemo(
    () => recurrents.map((r) => String(r.id)),
    [recurrents],
  );
  const assetIds = useMemo(() => assets.map((a) => String(a.id)), [assets]);

  const parser = parsers.find((p) => p.id === parserId);
  const toImport = rows.filter((row) => row.action === "import");
  const toIgnore = rows.filter(
    (row) => row.action === "ignore" && row.status === "new",
  );
  const ready =
    toImport.length + toIgnore.length > 0 && toImport.every(isComplete);

  const updateRow = (index: number, changes: Partial<ParsedRow>) =>
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, ...changes } : row)),
    );

  const applyToImported = (changes: Partial<ParsedRow>) =>
    setRows((current) =>
      current.map((row) =>
        row.action === "import" ? { ...row, ...changes } : row,
      ),
    );

  const parse = async () => {
    if (!file) return;
    const body = new FormData();
    body.append("parser", parserId);
    body.append("file", file);
    setBusy(true);
    try {
      const { json } = await httpClient(
        `${apiUrl}/assets/recurrentTransactionsParse`,
        { method: "POST", body },
      );
      const parsed = (json as Omit<ParsedRow, "action">[]).map((row) => ({
        ...row,
        action: DEFAULT_ACTION[row.status],
      }));
      setRows(parsed);
      const count = (status: RowStatus) =>
        parsed.filter((row) => row.status === status).length;
      const processed = [
        count("imported") && `${count("imported")} already imported`,
        count("ignored") && `${count("ignored")} ignored before`,
      ].filter(Boolean);
      notify(
        `Parsed ${plural(parsed.length, "transaction")}` +
          (processed.length ? `, ${processed.join(", ")}` : ""),
        { type: "info" },
      );
    } catch (error) {
      setRows([]);
      notify((error as Error).message || "Could not parse the file", {
        type: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    const transactions = toImport.map((row) => ({
      importHash: row.importHash,
      recurrentId: row.recurrentId,
      yearMonth: row.yearMonth,
      description: row.description,
      amount: Number(row.amount),
      transactionDate: row.transactionDate,
      paidWithAssetId: row.paidWithAssetId,
    }));
    const ignored = toIgnore.map((row) => ({
      importHash: row.importHash,
      transactionDate: row.transactionDate,
      description: row.description,
      amount: Number(row.amount),
    }));
    setBusy(true);
    try {
      const { json } = await httpClient(
        `${apiUrl}/assets/recurrentTransactionsImport`,
        { method: "POST", body: JSON.stringify({ transactions, ignored }) },
      );
      notify(
        `Imported ${plural(json.inserted, "transaction")}` +
          (json.ignored ? `, ignored ${json.ignored}` : "") +
          (json.skipped ? `, skipped ${json.skipped} already processed` : ""),
        { type: "success" },
      );
      redirect("list", "assets/recurrentTransactions");
    } catch (error) {
      notify((error as Error).message || "Import failed", { type: "error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card sx={{ mt: 2 }}>
      <Title title="Import Recurrent Transactions" />
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <TextField
              select
              size="small"
              label="Parser"
              value={parsers.length ? parserId : ""}
              onChange={(e) => {
                setParserId(e.target.value);
                // A file chosen for another parser may not fit this one.
                const next = parsers.find((p) => p.id === e.target.value);
                if (file && next && fileError(file, next)) {
                  setFile(null);
                  setRows([]);
                }
              }}
              sx={{ minWidth: 200 }}
            >
              {parsers.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="outlined" component="label" disabled={!parser}>
              {file ? file.name : "Choose file"}
              <input
                hidden
                type="file"
                accept={parser?.extensions.join(",")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const chosen = e.target.files?.[0] ?? null;
                  const error = chosen && parser && fileError(chosen, parser);
                  if (error) {
                    notify(error, { type: "error" });
                  }
                  setFile(error ? null : chosen);
                  setRows([]);
                  // Let the same file be chosen again after a fix.
                  e.target.value = "";
                }}
              />
            </Button>
            <Button
              variant="contained"
              onClick={parse}
              disabled={!file || !parser || busy}
            >
              Parse
            </Button>
          </Stack>
          {parser && (
            <Typography variant="body2" color="text.secondary">
              {parser.description}
            </Typography>
          )}

          {rows.length > 0 && (
            <>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <IdAutocomplete
                  label="Recurrent"
                  options={recurrentIds}
                  value={bulkRecurrent}
                  onChange={setBulkRecurrent}
                  width={260}
                />
                <Button
                  disabled={!bulkRecurrent || !toImport.length}
                  onClick={() =>
                    applyToImported({ recurrentId: bulkRecurrent })
                  }
                >
                  Apply to rows to import
                </Button>
                <IdAutocomplete
                  label="Paid with"
                  options={assetIds}
                  value={bulkPaidWith}
                  onChange={setBulkPaidWith}
                  width={260}
                />
                <Button
                  disabled={!bulkPaidWith || !toImport.length}
                  onClick={() =>
                    applyToImported({ paidWithAssetId: bulkPaidWith })
                  }
                >
                  Apply to rows to import
                </Button>
              </Stack>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Action</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Year Month</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Recurrent</TableCell>
                      <TableCell>Paid with</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => {
                      const importing = row.action === "import";
                      const locked = row.status === "imported";
                      return (
                        <TableRow
                          key={row.importHash}
                          sx={{
                            opacity: importing
                              ? 1
                              : row.action === "ignore"
                                ? 0.5
                                : 0.7,
                          }}
                        >
                          <TableCell>
                            {locked ? (
                              <Link
                                component={RouterLink}
                                to={`/assets/recurrentTransactions/${row.transactionId}`}
                              >
                                Edit
                              </Link>
                            ) : (
                              <TextField
                                select
                                size="small"
                                value={row.action}
                                onChange={(e) =>
                                  updateRow(index, {
                                    action: e.target.value as RowAction,
                                  })
                                }
                                sx={{ width: 110 }}
                              >
                                {ACTIONS[row.status].map((action) => (
                                  <MenuItem key={action} value={action}>
                                    {ACTION_LABELS[action]}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            {row.transactionDate}
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              disabled={locked}
                              value={row.yearMonth}
                              onChange={(e) =>
                                updateRow(index, { yearMonth: e.target.value })
                              }
                              sx={{ width: 110 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              fullWidth
                              disabled={locked}
                              value={row.description}
                              slotProps={{ htmlInput: { maxLength: 200 } }}
                              onChange={(e) =>
                                updateRow(index, {
                                  description: e.target.value,
                                })
                              }
                              sx={{ minWidth: 200 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextField
                              size="small"
                              type="number"
                              disabled={locked}
                              value={row.amount}
                              onChange={(e) =>
                                updateRow(index, { amount: e.target.value })
                              }
                              sx={{ width: 140 }}
                            />
                          </TableCell>
                          <TableCell>
                            <IdAutocomplete
                              options={recurrentIds}
                              value={row.recurrentId}
                              onChange={(value) =>
                                updateRow(index, { recurrentId: value })
                              }
                              width={220}
                              disabled={locked}
                              error={importing}
                            />
                          </TableCell>
                          <TableCell>
                            <IdAutocomplete
                              options={assetIds}
                              value={row.paidWithAssetId}
                              onChange={(value) =>
                                updateRow(index, { paidWithAssetId: value })
                              }
                              width={220}
                              disabled={locked}
                              error={importing}
                            />
                          </TableCell>
                          <TableCell>
                            {row.status === "imported" && (
                              <Chip size="small" label="Already imported" />
                            )}
                            {row.status === "ignored" && (
                              <Chip size="small" label="Ignored before" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box>
                <Button
                  variant="contained"
                  onClick={save}
                  disabled={!ready || busy}
                >
                  {[
                    toImport.length && `Import ${toImport.length}`,
                    toIgnore.length && `Ignore ${toIgnore.length}`,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Import"}
                </Button>
                {toImport.length > 0 && !ready && (
                  <Typography
                    variant="body2"
                    color="error"
                    component="span"
                    sx={{ ml: 2 }}
                  >
                    Every row to import needs a recurrent, a paid-with asset, a
                    YYYY-MM year month and an amount.
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

export const ImportTransactionsButton = () => (
  <RaButton
    component={RouterLink}
    to="/recurrent-transactions-import"
    label="Import"
  >
    <UploadIcon />
  </RaButton>
);
