export interface CreateProjectInput {
  name: string;
  client: string;
  description: string;
  status: string;
  start_date?: string;
  end_date?: string;
}
