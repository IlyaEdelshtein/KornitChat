import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { PrintingDataRow } from '../data/printing2024';

interface ResultChartProps {
  data: PrintingDataRow[];
}

export default function ResultChart({ data }: ResultChartProps) {
  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">No data to display</Typography>
      </Box>
    );
  }

  // Group data by date for time series, or by other fields for categorical
  const hasDateField = data.some((row) => row.date);

  if (hasDateField) {
    // Time series chart - group by date
    const groupedData = data.reduce(
      (acc, row) => {
        const existingEntry = acc.find((item) => item.date === row.date);
        if (existingEntry) {
          existingEntry.revenue += row.revenue;
          existingEntry.units += row.units;
        } else {
          acc.push({
            date: row.date,
            revenue: row.revenue,
            units: row.units,
          });
        }
        return acc;
      },
      [] as Array<{ date: string; revenue: number; units: number }>
    );

    // Sort by date
    groupedData.sort((a, b) => a.date.localeCompare(b.date));

    return (
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="revenue" orientation="left" />
            <YAxis yAxisId="units" orientation="right" />
            <Tooltip
              formatter={(value: number, name: string) => [
                typeof value === 'number' ? value.toLocaleString() : value,
                name === 'revenue' ? 'Revenue ($)' : 'Units',
              ]}
            />
            <Legend />
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              strokeWidth={2}
              name="Revenue ($)"
            />
            <Line
              yAxisId="units"
              type="monotone"
              dataKey="units"
              stroke="#82ca9d"
              strokeWidth={2}
              name="Units"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  } else {
    // Categorical chart - group by product, country, or channel
    const hasProduct = data.some((row) => row.product);
    const hasCountry = data.some((row) => row.country);
    const hasChannel = data.some((row) => row.channel);

    let groupByField: keyof PrintingDataRow = 'product';
    if (hasCountry && !hasProduct) groupByField = 'country';
    if (hasChannel && !hasProduct && !hasCountry) groupByField = 'channel';

    const groupedData = data.reduce(
      (acc, row) => {
        const key = row[groupByField] as string;
        const existingEntry = acc.find((item) => item.name === key);
        if (existingEntry) {
          existingEntry.revenue += row.revenue;
          existingEntry.units += row.units;
        } else {
          acc.push({
            name: key,
            revenue: row.revenue,
            units: row.units,
          });
        }
        return acc;
      },
      [] as Array<{ name: string; revenue: number; units: number }>
    );

    return (
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={groupedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="revenue" orientation="left" />
            <YAxis yAxisId="units" orientation="right" />
            <Tooltip
              formatter={(value: number, name: string) => [
                typeof value === 'number' ? value.toLocaleString() : value,
                name === 'revenue' ? 'Revenue ($)' : 'Units',
              ]}
            />
            <Legend />
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              fill="#8884d8"
              name="Revenue ($)"
            />
            <Bar yAxisId="units" dataKey="units" fill="#82ca9d" name="Units" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  }
}
