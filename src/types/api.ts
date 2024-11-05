type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
};
