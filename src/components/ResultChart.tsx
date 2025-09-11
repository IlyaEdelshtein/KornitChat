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
import { Box, Typography, useTheme } from '@mui/material';
import { PrintingDataRow } from '../data/printing2024';

interface ResultChartProps {
  data: PrintingDataRow[];
  chartType?: 'line' | 'bar';
}

export default function ResultChart({
  data,
  chartType = 'line',
}: ResultChartProps) {
  const theme = useTheme();

  // Modern color palette
  const colors = {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Purple
    accent: '#06b6d4', // Cyan
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    gradients: {
      primary: 'url(#colorRevenue)',
      secondary: 'url(#colorUnits)',
    },
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
            {label}
          </Typography>
          {payload.map((entry: any, index: number) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                color: entry.color,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  borderRadius: '50%',
                }}
              />
              {entry.name}:{' '}
              {typeof entry.value === 'number'
                ? entry.value.toLocaleString()
                : entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };
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
      <Box
        sx={{
          width: '100%',
          height: 350,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)'
              : 'linear-gradient(135deg, rgba(99,102,241,0.02) 0%, rgba(139,92,246,0.05) 100%)',
          borderRadius: 2,
          p: 2,
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.1)'}`,
        }}
      >
        <ResponsiveContainer>
          {chartType === 'line' ? (
            <LineChart
              data={groupedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.primary}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.primary}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.secondary}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.secondary}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="2 4"
                stroke={
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.05)'
                }
                strokeWidth={1}
              />
              <XAxis
                dataKey="date"
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                stroke={colors.primary}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="units"
                orientation="right"
                stroke={colors.secondary}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke={colors.primary}
                strokeWidth={3}
                name="Revenue ($)"
                dot={{
                  fill: colors.primary,
                  strokeWidth: 2,
                  r: 5,
                  filter: 'url(#glow)',
                }}
                activeDot={{
                  r: 7,
                  stroke: colors.primary,
                  strokeWidth: 2,
                  fill: '#fff',
                }}
                animationDuration={1000}
              />
              <Line
                yAxisId="units"
                type="monotone"
                dataKey="units"
                stroke={colors.secondary}
                strokeWidth={3}
                name="Units"
                dot={{
                  fill: colors.secondary,
                  strokeWidth: 2,
                  r: 5,
                  filter: 'url(#glow)',
                }}
                activeDot={{
                  r: 7,
                  stroke: colors.secondary,
                  strokeWidth: 2,
                  fill: '#fff',
                }}
                animationDuration={1200}
              />
            </LineChart>
          ) : (
            <BarChart
              data={groupedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient
                  id="barGradientRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={colors.primary}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.primary}
                    stopOpacity={0.6}
                  />
                </linearGradient>
                <linearGradient
                  id="barGradientUnits"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={colors.secondary}
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.secondary}
                    stopOpacity={0.6}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="2 4"
                stroke={
                  theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.05)'
                }
                strokeWidth={1}
              />
              <XAxis
                dataKey="date"
                stroke={theme.palette.text.secondary}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                stroke={colors.primary}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="units"
                orientation="right"
                stroke={colors.secondary}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="rect" />
              <Bar
                yAxisId="revenue"
                dataKey="revenue"
                fill="url(#barGradientRevenue)"
                name="Revenue ($)"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
              <Bar
                yAxisId="units"
                dataKey="units"
                fill="url(#barGradientUnits)"
                name="Units"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          )}
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
      <Box
        sx={{
          width: '100%',
          height: 350,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)'
              : 'linear-gradient(135deg, rgba(99,102,241,0.02) 0%, rgba(139,92,246,0.05) 100%)',
          borderRadius: 2,
          p: 2,
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.1)'}`,
        }}
      >
        <ResponsiveContainer>
          <BarChart
            data={groupedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient
                id="catGradientRevenue"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={colors.accent} stopOpacity={0.9} />
                <stop
                  offset="95%"
                  stopColor={colors.accent}
                  stopOpacity={0.6}
                />
              </linearGradient>
              <linearGradient id="catGradientUnits" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors.success}
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor={colors.success}
                  stopOpacity={0.6}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke={
                theme.palette.mode === 'dark'
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.05)'
              }
              strokeWidth={1}
            />
            <XAxis
              dataKey="name"
              stroke={theme.palette.text.secondary}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              yAxisId="revenue"
              orientation="left"
              stroke={colors.accent}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="units"
              orientation="right"
              stroke={colors.success}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="rect" />
            <Bar
              yAxisId="revenue"
              dataKey="revenue"
              fill="url(#catGradientRevenue)"
              name="Revenue ($)"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
            />
            <Bar
              yAxisId="units"
              dataKey="units"
              fill="url(#catGradientUnits)"
              name="Units"
              radius={[6, 6, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  }
}
