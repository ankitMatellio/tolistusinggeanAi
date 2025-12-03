import { Response } from 'express';
import TodoService, { TodoQueryParams } from '../services/TodoService';
import { sendSuccess, sendPaginated } from '../utils/response';
import { asyncHandler } from '../utils/errorHandler';
import { AuthRequest } from '../middlewares/auth';

class TodoController {
  create = asyncHandler(async (req: AuthRequest, res: Response) => {
    const todo = await TodoService.createTodo(req.userId!, req.body);
    sendSuccess(res, todo, 201);
  });

  getById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const todo = await TodoService.getTodoById(id, req.userId!);
    sendSuccess(res, todo);
  });

  list = asyncHandler(async (req: AuthRequest, res: Response) => {
    const getNumber = (value: any, defaultValue: number): number => {
      if (typeof value === 'string') {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? defaultValue : parsed;
      }
      if (typeof value === 'number') {
        return value;
      }
      return defaultValue;
    };

    const queryParams: TodoQueryParams = {
      page: getNumber(req.query.page, 1),
      limit: getNumber(req.query.limit, 10),
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
      status: typeof req.query.status === 'string' ? req.query.status as any : undefined,
      sortBy: typeof req.query.sortBy === 'string' ? req.query.sortBy : 'createdAt',
      sortOrder: (typeof req.query.sortOrder === 'string' ? req.query.sortOrder : 'DESC') as 'ASC' | 'DESC',
      startDate: typeof req.query.startDate === 'string' ? req.query.startDate : undefined,
      endDate: typeof req.query.endDate === 'string' ? req.query.endDate : undefined,
    };

    const { todos, totalCount } = await TodoService.listTodos(req.userId!, queryParams);
    sendPaginated(res, todos, totalCount, queryParams.page, queryParams.limit);
  });

  update = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const todo = await TodoService.updateTodo(id, req.userId!, req.body);
    sendSuccess(res, todo);
  });

  delete = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await TodoService.deleteTodo(id, req.userId!);
    sendSuccess(res, { message: 'Todo deleted successfully' });
  });
}

export default new TodoController();

