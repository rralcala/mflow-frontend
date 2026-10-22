import { useState, useEffect, FormEvent, ReactNode } from "react";
import { Title, useNotify } from "react-admin";

import {
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { fetcherEffect, httpClient } from "./httpClient";
import { formatter, formatterPct } from "./lib";

const apiUrl = import.meta.env.VITE_API_URL;
const profileRoute = "auth/profile";
const passwordRoute = "auth/password";
// Keep in step with lib/passwords.py in the backend.
const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 30;

type Profile = {
  id: string;
  username: string;
  name: string;
  email: string;
  config: Record<string, unknown>;
};

const isScalar = (value: unknown) =>
  ["string", "number", "boolean"].includes(typeof value);

const isRateMap = (key: string, value: unknown) =>
  key.endsWith("_RATES") &&
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  Object.values(value).every((rate) => !isNaN(Number(rate)));

const renderValue = (key: string, value: unknown): ReactNode => {
  if (value === null || value === undefined || value === "") {
    return <Typography color="text.secondary">Not set</Typography>;
  }
  if (key === "DESIRED_ESTATE" && typeof value === "number") {
    return formatter.format(value);
  }
  if (isScalar(value)) {
    return String(value);
  }
  if (isRateMap(key, value)) {
    return (
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
        {Object.entries(value as Record<string, unknown>).map(
          ([name, rate]) => (
            <Chip
              key={name}
              size="small"
              label={`${name}: ${formatterPct.format(Number(rate))}`}
            />
          ),
        )}
      </Stack>
    );
  }
  if (Array.isArray(value) && value.every(isScalar)) {
    if (value.length === 0) {
      return <Typography color="text.secondary">None</Typography>;
    }
    return (
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
        {value.map((item) => (
          <Chip key={String(item)} size="small" label={String(item)} />
        ))}
      </Stack>
    );
  }
  return (
    <Typography component="pre" variant="body2" sx={{ m: 0 }}>
      {JSON.stringify(value, null, 2)}
    </Typography>
  );
};

const passwordError = (password: string, current: string) => {
  if (password.length < MIN_PASSWORD_LENGTH)
    return `At least ${MIN_PASSWORD_LENGTH} characters`;
  if (password.length > MAX_PASSWORD_LENGTH)
    return `At most ${MAX_PASSWORD_LENGTH} characters`;
  if (password.trim() !== password) return "Can't start or end with whitespace";
  if (password === current) return "Must differ from the current password";
  return null;
};

const ChangePasswordCard = () => {
  const notify = useNotify();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const nextError = next ? passwordError(next, current) : null;
  const confirmError =
    confirm && confirm !== next ? "Passwords don't match" : null;
  const canSubmit =
    !busy && current && next && confirm && !nextError && !confirmError;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    try {
      await httpClient(apiUrl + passwordRoute, {
        method: "POST",
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      setCurrent("");
      setNext("");
      setConfirm("");
      notify("Password changed", { type: "success" });
    } catch (error) {
      notify((error as Error).message || "Could not change the password", {
        type: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Change password
        </Typography>
        <Stack
          component="form"
          onSubmit={submit}
          spacing={2}
          sx={{ maxWidth: 400 }}
        >
          <TextField
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
          <TextField
            label="New password"
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            error={Boolean(nextError)}
            helperText={
              nextError ??
              `${MIN_PASSWORD_LENGTH}–${MAX_PASSWORD_LENGTH} characters`
            }
            required
          />
          <TextField
            label="Repeat new password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={Boolean(confirmError)}
            helperText={confirmError ?? " "}
            required
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!canSubmit}
            sx={{ alignSelf: "flex-start" }}
          >
            Change password
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetcherEffect(setProfile, setError, setLoading, profileRoute)();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!profile) return null;

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Title title="Profile" />
      <Card>
        <CardContent>
          <Typography variant="h5">
            {profile.name || profile.username}
          </Typography>
          <Typography color="text.secondary">
            {profile.username}
            {profile.email ? ` · ${profile.email}` : ""}
          </Typography>
        </CardContent>
      </Card>
      <Typography variant="h6">Settings</Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="user settings">
          <TableBody>
            {Object.entries(profile.config).map(([key, value]) => (
              <TableRow
                key={key}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ width: "30%", verticalAlign: "top" }}
                >
                  {key}
                </TableCell>
                <TableCell>{renderValue(key, value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ChangePasswordCard />
    </Stack>
  );
};
