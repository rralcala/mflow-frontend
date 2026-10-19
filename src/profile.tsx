import { useState, useEffect, ReactNode } from "react";
import { Title } from "react-admin";

import {
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
  Typography,
} from "@mui/material";

import { fetcherEffect } from "./httpClient";
import { formatter, formatterPct } from "./lib";

const profileRoute = "auth/profile";

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
    </Stack>
  );
};
