import { printing2024Data, PrintingDataRow } from '../data/printing2024';

export interface MockResult {
  rows: PrintingDataRow[];
}

export function generateMockSql(question: string): string {
  const lowerQuestion = question.toLowerCase();

  // Simple template-based SQL generation
  if (lowerQuestion.includes('revenue') && lowerQuestion.includes('country')) {
    return `SELECT country, SUM(revenue) as total_revenue
FROM printing_2024 
GROUP BY country
ORDER BY total_revenue DESC;`;
  }

  if (lowerQuestion.includes('units') && lowerQuestion.includes('product')) {
    return `SELECT product, SUM(units) as total_units
FROM printing_2024 
GROUP BY product
ORDER BY total_units DESC;`;
  }

  if (lowerQuestion.includes('monthly') || lowerQuestion.includes('month')) {
    return `SELECT date, SUM(revenue) as monthly_revenue, SUM(units) as monthly_units
FROM printing_2024 
GROUP BY date
ORDER BY date;`;
  }

  if (lowerQuestion.includes('channel')) {
    return `SELECT channel, SUM(revenue) as revenue, SUM(units) as units
FROM printing_2024 
GROUP BY channel;`;
  }

  if (lowerQuestion.includes('premium') || lowerQuestion.includes('classic')) {
    return `SELECT product, date, SUM(revenue) as revenue, SUM(units) as units
FROM printing_2024 
WHERE product LIKE '%${lowerQuestion.includes('premium') ? 'Premium' : 'Classic'}%'
GROUP BY product, date
ORDER BY date;`;
  }

  // Default query
  return `SELECT * FROM printing_2024 
ORDER BY date DESC, revenue DESC
LIMIT 20;`;
}

export function getMockResult(question: string): MockResult {
  const lowerQuestion = question.toLowerCase();
  let filteredData = [...printing2024Data];

  // Apply simple filters based on question content
  if (lowerQuestion.includes('premium')) {
    filteredData = filteredData.filter(
      (row) => row.product === 'T-Shirt Premium'
    );
  } else if (lowerQuestion.includes('classic')) {
    filteredData = filteredData.filter(
      (row) => row.product === 'T-Shirt Classic'
    );
  }

  if (lowerQuestion.includes('online')) {
    filteredData = filteredData.filter((row) => row.channel === 'Online');
  } else if (lowerQuestion.includes('wholesale')) {
    filteredData = filteredData.filter((row) => row.channel === 'Wholesale');
  }

  if (lowerQuestion.includes('usa') || lowerQuestion.includes('america')) {
    filteredData = filteredData.filter((row) => row.country === 'USA');
  } else if (lowerQuestion.includes('canada')) {
    filteredData = filteredData.filter((row) => row.country === 'Canada');
  } else if (
    lowerQuestion.includes('uk') ||
    lowerQuestion.includes('britain')
  ) {
    filteredData = filteredData.filter((row) => row.country === 'UK');
  }

  // Limit results for better performance
  if (filteredData.length > 30) {
    filteredData = filteredData.slice(0, 30);
  }

  return { rows: filteredData };
}

export function inferTitleFromFirstMessage(text: string): string {
  if (text.length <= 50) {
    return text;
  }

  // Try to find a good break point
  const words = text.split(' ');
  let title = '';

  for (const word of words) {
    if ((title + ' ' + word).length > 50) {
      break;
    }
    title += (title ? ' ' : '') + word;
  }

  return title + '...';
}
