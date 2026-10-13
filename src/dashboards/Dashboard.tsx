// in src/Dashboard.js
import { useGetList } from "react-admin";

import { Card, CardContent, CardHeader } from "@mui/material";
import DollarIcon from "@mui/icons-material/AttachMoney";
import CardWithIcon from "../CardWithIcon";
import { Stack } from "@mui/material";

export const Dashboard = () => {
  // The recurrents shown here come from DASHBOARD_RECURRENTS in the user's config.json.
  const { data, isLoading, error } = useGetList("assets/dashboardBudgets");

  if (isLoading)
    return (
      <Card>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  if (error)
    return (
      <Card>
        <CardContent>Error loading data</CardContent>
      </Card>
    );

  return (
    <Stack spacing={1}>
      <Card>
        <CardHeader title="Welcome mFlow" />
        <CardContent>
          {data?.length
            ? "Here's a summary of key budgets:"
            : "No budgets selected for the dashboard yet."}
        </CardContent>
      </Card>
      {data?.map((budget) => (
        <CardWithIcon
          key={budget.id}
          to="/recurrentTransactions"
          icon={DollarIcon}
          title={`Remaining ${budget.label} for ${budget.yearMonth}`}
          subtitle={budget}
        />
      ))}
    </Stack>
  );
};
