export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}