export type PaginatedResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  total: number;
  page: number;
  totalPages: number;
};

