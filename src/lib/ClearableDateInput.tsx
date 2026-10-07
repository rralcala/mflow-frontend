import { useInput } from "react-admin";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

interface ClearableDateInputProps {
  source: string;
  label?: string;
  helperText?: string;
}

// Native date pickers have no reliable way to empty an optional date, so this
// date input has a button that sets the value back to null.
export const ClearableDateInput = ({
  source,
  label,
  helperText,
}: ClearableDateInputProps) => {
  const { field, fieldState } = useInput({
    source,
    format: (value) => value ?? "",
    parse: (value) => (value === "" ? null : value),
  });

  return (
    <TextField
      {...field}
      type="date"
      size="small"
      variant="filled"
      margin="dense"
      label={label ?? source}
      error={fieldState.invalid}
      helperText={fieldState.error?.message ?? helperText}
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          endAdornment: field.value ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={`Clear ${label ?? source}`}
                size="small"
                onClick={() => field.onChange(null)}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
};
