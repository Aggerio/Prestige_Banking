// Define the row data type
export interface RowData {
  id: number;
  description: { title: string; revenue: string };
  transactionId: string;
  type: string;
  card: string;
  date: string;
  amount: number;
}
