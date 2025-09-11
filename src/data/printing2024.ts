export interface PrintingDataRow {
  date: string; // YYYY-MM format
  product: 'T-Shirt Classic' | 'T-Shirt Premium';
  units: number;
  revenue: number;
  country: string;
  channel: 'Online' | 'Wholesale';
}

export const printing2024Data: PrintingDataRow[] = [
  // January 2024
  { date: '2024-01', product: 'T-Shirt Classic', units: 450, revenue: 4500, country: 'USA', channel: 'Online' },
  { date: '2024-01', product: 'T-Shirt Premium', units: 200, revenue: 3000, country: 'USA', channel: 'Online' },
  { date: '2024-01', product: 'T-Shirt Classic', units: 300, revenue: 3000, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-01', product: 'T-Shirt Premium', units: 150, revenue: 2250, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-01', product: 'T-Shirt Classic', units: 250, revenue: 2500, country: 'UK', channel: 'Online' },
  
  // February 2024
  { date: '2024-02', product: 'T-Shirt Classic', units: 520, revenue: 5200, country: 'USA', channel: 'Online' },
  { date: '2024-02', product: 'T-Shirt Premium', units: 230, revenue: 3450, country: 'USA', channel: 'Online' },
  { date: '2024-02', product: 'T-Shirt Classic', units: 280, revenue: 2800, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-02', product: 'T-Shirt Premium', units: 180, revenue: 2700, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-02', product: 'T-Shirt Classic', units: 320, revenue: 3200, country: 'UK', channel: 'Online' },
  { date: '2024-02', product: 'T-Shirt Premium', units: 90, revenue: 1350, country: 'Germany', channel: 'Online' },
  
  // March 2024
  { date: '2024-03', product: 'T-Shirt Classic', units: 600, revenue: 6000, country: 'USA', channel: 'Online' },
  { date: '2024-03', product: 'T-Shirt Premium', units: 280, revenue: 4200, country: 'USA', channel: 'Online' },
  { date: '2024-03', product: 'T-Shirt Classic', units: 350, revenue: 3500, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-03', product: 'T-Shirt Premium', units: 200, revenue: 3000, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-03', product: 'T-Shirt Classic', units: 380, revenue: 3800, country: 'UK', channel: 'Online' },
  { date: '2024-03', product: 'T-Shirt Premium', units: 120, revenue: 1800, country: 'Germany', channel: 'Online' },
  
  // April 2024
  { date: '2024-04', product: 'T-Shirt Classic', units: 480, revenue: 4800, country: 'USA', channel: 'Online' },
  { date: '2024-04', product: 'T-Shirt Premium', units: 220, revenue: 3300, country: 'USA', channel: 'Online' },
  { date: '2024-04', product: 'T-Shirt Classic', units: 320, revenue: 3200, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-04', product: 'T-Shirt Premium', units: 160, revenue: 2400, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-04', product: 'T-Shirt Classic', units: 290, revenue: 2900, country: 'UK', channel: 'Online' },
  { date: '2024-04', product: 'T-Shirt Premium', units: 110, revenue: 1650, country: 'Germany', channel: 'Online' },
  { date: '2024-04', product: 'T-Shirt Classic', units: 180, revenue: 1800, country: 'France', channel: 'Wholesale' },
  
  // May 2024
  { date: '2024-05', product: 'T-Shirt Classic', units: 550, revenue: 5500, country: 'USA', channel: 'Online' },
  { date: '2024-05', product: 'T-Shirt Premium', units: 260, revenue: 3900, country: 'USA', channel: 'Online' },
  { date: '2024-05', product: 'T-Shirt Classic', units: 340, revenue: 3400, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-05', product: 'T-Shirt Premium', units: 190, revenue: 2850, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-05', product: 'T-Shirt Classic', units: 310, revenue: 3100, country: 'UK', channel: 'Online' },
  { date: '2024-05', product: 'T-Shirt Premium', units: 130, revenue: 1950, country: 'Germany', channel: 'Online' },
  { date: '2024-05', product: 'T-Shirt Classic', units: 220, revenue: 2200, country: 'France', channel: 'Wholesale' },
  
  // June 2024
  { date: '2024-06', product: 'T-Shirt Classic', units: 620, revenue: 6200, country: 'USA', channel: 'Online' },
  { date: '2024-06', product: 'T-Shirt Premium', units: 300, revenue: 4500, country: 'USA', channel: 'Online' },
  { date: '2024-06', product: 'T-Shirt Classic', units: 400, revenue: 4000, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-06', product: 'T-Shirt Premium', units: 210, revenue: 3150, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-06', product: 'T-Shirt Classic', units: 350, revenue: 3500, country: 'UK', channel: 'Online' },
  { date: '2024-06', product: 'T-Shirt Premium', units: 140, revenue: 2100, country: 'Germany', channel: 'Online' },
  { date: '2024-06', product: 'T-Shirt Classic', units: 250, revenue: 2500, country: 'France', channel: 'Wholesale' },
  { date: '2024-06', product: 'T-Shirt Premium', units: 80, revenue: 1200, country: 'France', channel: 'Online' },
  
  // July 2024
  { date: '2024-07', product: 'T-Shirt Classic', units: 580, revenue: 5800, country: 'USA', channel: 'Online' },
  { date: '2024-07', product: 'T-Shirt Premium', units: 270, revenue: 4050, country: 'USA', channel: 'Online' },
  { date: '2024-07', product: 'T-Shirt Classic', units: 380, revenue: 3800, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-07', product: 'T-Shirt Premium', units: 200, revenue: 3000, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-07', product: 'T-Shirt Classic', units: 330, revenue: 3300, country: 'UK', channel: 'Online' },
  { date: '2024-07', product: 'T-Shirt Premium', units: 150, revenue: 2250, country: 'Germany', channel: 'Online' },
  { date: '2024-07', product: 'T-Shirt Classic', units: 280, revenue: 2800, country: 'France', channel: 'Wholesale' },
  
  // August 2024
  { date: '2024-08', product: 'T-Shirt Classic', units: 650, revenue: 6500, country: 'USA', channel: 'Online' },
  { date: '2024-08', product: 'T-Shirt Premium', units: 320, revenue: 4800, country: 'USA', channel: 'Online' },
  { date: '2024-08', product: 'T-Shirt Classic', units: 420, revenue: 4200, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-08', product: 'T-Shirt Premium', units: 230, revenue: 3450, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-08', product: 'T-Shirt Classic', units: 370, revenue: 3700, country: 'UK', channel: 'Online' },
  { date: '2024-08', product: 'T-Shirt Premium', units: 160, revenue: 2400, country: 'Germany', channel: 'Online' },
  { date: '2024-08', product: 'T-Shirt Classic', units: 300, revenue: 3000, country: 'France', channel: 'Wholesale' },
  { date: '2024-08', product: 'T-Shirt Premium', units: 95, revenue: 1425, country: 'France', channel: 'Online' },
  
  // September 2024
  { date: '2024-09', product: 'T-Shirt Classic', units: 590, revenue: 5900, country: 'USA', channel: 'Online' },
  { date: '2024-09', product: 'T-Shirt Premium', units: 290, revenue: 4350, country: 'USA', channel: 'Online' },
  { date: '2024-09', product: 'T-Shirt Classic', units: 360, revenue: 3600, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-09', product: 'T-Shirt Premium', units: 180, revenue: 2700, country: 'Canada', channel: 'Wholesale' },
  { date: '2024-09', product: 'T-Shirt Classic', units: 340, revenue: 3400, country: 'UK', channel: 'Online' },
  { date: '2024-09', product: 'T-Shirt Premium', units: 140, revenue: 2100, country: 'Germany', channel: 'Online' },
  { date: '2024-09', product: 'T-Shirt Classic', units: 270, revenue: 2700, country: 'France', channel: 'Wholesale' },
];

export const getDatasetSummary = () => ({
  totalRows: printing2024Data.length,
  dateRange: '2024-01 to 2024-09',
  countries: ['USA', 'Canada', 'UK', 'Germany', 'France'],
  products: ['T-Shirt Classic', 'T-Shirt Premium'],
  channels: ['Online', 'Wholesale'],
});
