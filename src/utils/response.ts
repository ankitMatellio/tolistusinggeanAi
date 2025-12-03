import { Response } from 'express';

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  data: T;
}

export const sendSuccess = <T>(res: Response, data: T, statusCode: number = 200): void => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  totalCount: number,
  page: number,
  limit: number
): void => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  res.status(200).json({
    success: true,
    data,
    pagination: {
      totalCount,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage,
      hasPreviousPage,
    },
  });
};

