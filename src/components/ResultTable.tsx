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
  IconButton,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Tooltip,
  TableSortLabel,
} from '@mui/material';
import { ViewColumn as ViewColumnIcon } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { PrintingDataRow } from '../data/printing2024';

interface ResultTableProps {
  data: PrintingDataRow[];
}

type SortDirection = 'asc' | 'desc';
type SortBy = keyof PrintingDataRow | null;

export default function ResultTable({ data }: ResultTableProps) {
  const [sortBy, setSortBy] = useState<SortBy>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [visibleColumns, setVisibleColumns] = useState<
    Set<keyof PrintingDataRow>
  >(new Set());
  const [columnMenuAnchor, setColumnMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No data to display</Typography>
      </Box>
    );
  }

  // Get headers from the first row
  const headers = Object.keys(data[0]) as (keyof PrintingDataRow)[];

  // Initialize visible columns if not set
  if (visibleColumns.size === 0) {
    setVisibleColumns(new Set(headers));
  }

  // Filter visible headers
  const visibleHeaders = headers.filter((header) => visibleColumns.has(header));

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortBy) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortBy, sortDirection]);

  // Handle sort
  const handleSort = (column: keyof PrintingDataRow) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Handle column visibility
  const handleColumnVisibility = (column: keyof PrintingDataRow) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (newVisibleColumns.has(column)) {
      // Don't allow hiding the last column
      if (newVisibleColumns.size > 1) {
        newVisibleColumns.delete(column);
      }
    } else {
      newVisibleColumns.add(column);
    }
    setVisibleColumns(newVisibleColumns);
  };

  const handleColumnMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setColumnMenuAnchor(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
  };

  return (
    <Box>
      {/* Table controls */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {sortBy && (
            <Typography variant="caption" color="text.secondary">
              Sorted by: <strong>{sortBy}</strong> (
              {sortDirection === 'asc' ? '↑' : '↓'})
            </Typography>
          )}
        </Box>
        <Tooltip title="Show/Hide Columns">
          <IconButton
            onClick={handleColumnMenuOpen}
            size="small"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ViewColumnIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 400,
          overflow: 'auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          },
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {visibleHeaders.map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor: 'background.paper',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                  }}
                >
                  <TableSortLabel
                    active={sortBy === header}
                    direction={sortBy === header ? sortDirection : 'asc'}
                    onClick={() => handleSort(header)}
                    sx={{
                      '& .MuiTableSortLabel-icon': {
                        opacity: sortBy === header ? 1 : 0.5,
                      },
                    }}
                  >
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow
                key={index}
                hover
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'action.hover',
                  },
                  '&:hover': {
                    backgroundColor: 'action.selected',
                  },
                }}
              >
                {visibleHeaders.map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontFamily:
                        typeof row[header] === 'number'
                          ? 'monospace'
                          : 'inherit',
                      fontWeight:
                        typeof row[header] === 'number' ? 'medium' : 'normal',
                    }}
                  >
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

      {/* Column visibility menu */}
      <Menu
        anchorEl={columnMenuAnchor}
        open={Boolean(columnMenuAnchor)}
        onClose={handleColumnMenuClose}
        PaperProps={{
          sx: {
            maxHeight: 300,
            minWidth: 200,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Show/Hide Columns
          </Typography>
        </Box>
        {headers.map((header) => (
          <MenuItem key={header} onClick={() => handleColumnVisibility(header)}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={visibleColumns.has(header)}
                  disabled={
                    visibleColumns.has(header) && visibleColumns.size === 1
                  }
                />
              }
              label={header.charAt(0).toUpperCase() + header.slice(1)}
              sx={{ margin: 0 }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
