import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";

interface TableBaseProps<T> {
  columns: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  maxHeight?: number;
  maxCellWidth?: number; // nova prop opcional em px
}

export const TableBase = <T,>({
  columns,
  data,
  renderRow,
  emptyMessage = "Nenhum registro encontrado.",
  maxHeight,
  maxCellWidth = 200, // padrão de 200px por célula
}: TableBaseProps<T>) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        width: "100%",
        boxShadow: "0px 1px 5px rgba(0,0,0,0.1)",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <TableContainer
        sx={{
          maxHeight: maxHeight || "unset",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Table stickyHeader={!!maxHeight}>
          {/* Cabeçalho */}
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    fontWeight: 700,
                    fontSize: "17px",
                    padding: "16px 22px",
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    textAlign: "center",
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Corpo */}
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 3 }}
                >
                  <Typography
                    variant="body2"
                    color={theme.palette.text.secondary}
                  >
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                    "& td": {
                      padding: "18px 22px",
                      fontSize: "15px",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      color: theme.palette.text.primary,
                      textAlign: "center",
                      maxWidth: `${maxCellWidth}px`, // limite horizontal
                      whiteSpace: "normal", // quebra linha
                      wordWrap: "break-word", // força quebra de palavra longa
                    },
                    "&:last-of-type td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  {renderRow(item, index)}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
