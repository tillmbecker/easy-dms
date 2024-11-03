export interface InvoiceData {
  invoiceNumber: string | undefined;
  invoiceDate: Date | undefined;
  dueDate: Date | undefined;
  vendorName: string | undefined;
  vendorAddress: string | undefined;
  customerName: string | undefined;
  customerAddress: string | undefined;
  totalAmount: number | undefined;
}
