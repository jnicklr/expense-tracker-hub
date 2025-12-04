import { Alert } from "@mui/material";

interface Props {
  successMessage: string | null;
  errorMessage: string | null;
  setSuccessMessage: (v: string | null) => void;
  setErrorMessage: (v: string | null) => void;
}

export default function AuthAlerts({
  successMessage,
  errorMessage,
  setSuccessMessage,
  setErrorMessage,
}: Props) {
  return (
    <>
      {successMessage && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage(null)}
          sx={{ mb: 2 }}
        >
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert
          severity="error"
          onClose={() => setErrorMessage(null)}
          sx={{ mb: 2 }}
        >
          {errorMessage}
        </Alert>
      )}
    </>
  );
}
