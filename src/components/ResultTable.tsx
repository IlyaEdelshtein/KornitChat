import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { PrintingDataRow } from '../data/printing2024';

interface ResultTableProps {
  data: PrintingDataRow[];
}

export default function ResultTable({ data }: ResultTableProps) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No data to display</Typography>
      </Box>
    );
  }

  // Get headers from the first row
  const headers = Object.keys(data[0]) as (keyof PrintingDataRow)[];

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} hover>
              {headers.map((header) => (
                <TableCell key={header}>
                  {typeof row[header] === 'number'
                    ? row[header].toLocaleString()
                    : row[header]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
