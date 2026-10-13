import { FC, createElement, ReactNode } from "react";
import { Card, Box, Typography } from "@mui/material";
import { Link, To } from "react-router-dom";

interface Props {
  icon: FC<{ fontSize?: "large" }>;
  to: To;
  title?: string;
  subtitle?: Record<string, unknown>;
  children?: ReactNode;
}

const amountFormat = new Intl.NumberFormat(undefined, {
  style: "decimal",
  useGrouping: true,
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export const CardWithIcon = ({ icon, title, subtitle, to }: Props) => {
  const amount = Number(subtitle?.amount ?? 0);
  const budget = Number(subtitle?.budget ?? 0);
  const currency = subtitle?.currency ? String(subtitle.currency) : "";
  // Share of the recurrent's monthly amount still unspent.
  const percent = budget ? Math.round((amount / budget) * 100) : null;

  return (
    <Card
      sx={{
        minHeight: 52,
        display: "flex",
        flexDirection: "column",
        flex: "1",
        "& a": {
          textDecoration: "none",
          color: "inherit",
        },
      }}
    >
      <Link to={to}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            "& .icon": {
              color: "secondary.main",
            },
            "&:before": {
              position: "absolute",
              top: "50%",
              left: 0,
              display: "block",
              content: `''`,
              height: "200%",
              aspectRatio: "1",
              transform: "translate(-30%, -60%)",
              borderRadius: "50%",
              backgroundColor: "secondary.main",
              opacity: 0.15,
            },
          }}
        >
          <Box
            className="icon"
            sx={{
              width: "3em",
            }}
          >
            {createElement(icon, { fontSize: "large" })}
          </Box>
          <Box
            sx={{
              textAlign: "right",
            }}
          >
            <Typography color="textSecondary">{title}</Typography>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {amountFormat.format(-amount)} {currency}
            </Typography>
            {percent !== null && (
              <Typography variant="body2" color="textSecondary">
                {percent}% of {amountFormat.format(-budget)} {currency} left
              </Typography>
            )}
          </Box>
        </Box>
      </Link>
    </Card>
  );
};

export default CardWithIcon;
