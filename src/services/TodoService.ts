import { Op, WhereOptions } from 'sequelize';
import Todo, { TodoStatus } from '../models/Todo';
import { AppError } from '../utils/errorHandler';
import logger from '../utils/logger';

export interface TodoQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: TodoStatus;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  status?: TodoStatus;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  status?: TodoStatus;
}

class TodoService {
  async createTodo(userId: string, data: CreateTodoData): Promise<Todo> {
    try {
      const todo = await Todo.create({
        userId,
        title: data.title,
        description: data.description,
        status: data.status || TodoStatus.PENDING,
      });

      logger.info(`Todo created: ${todo.id} for user: ${userId}`);
      return todo;
    } catch (error: any) {
      logger.error(`Error creating todo: ${error.message}`);
      throw new AppError('Failed to create todo', 500);
    }
  }

  async getTodoById(id: string, userId: string): Promise<Todo> {
    const todo = await Todo.findOne({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!todo) {
      throw new AppError('Todo not found', 404);
    }

    return todo;
  }

  async listTodos(userId: string, params: TodoQueryParams) {
    const { page, limit, search, status, sortBy, sortOrder, startDate, endDate } = params;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: WhereOptions = {
      userId,
      deletedAt: null,
    };

    // Status filter
    if (status) {
      where.status = status;
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        where.createdAt[Op.lte] = new Date(endDate);
      }
    }

    // Search filter (title and description)
    if (search) {
      where[Op.or as any] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Execute query
    const { rows, count } = await Todo.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      todos: rows,
      totalCount: count,
    };
  }

  async updateTodo(id: string, userId: string, data: UpdateTodoData): Promise<Todo> {
    const todo = await this.getTodoById(id, userId);

    if (data.title !== undefined) {
      todo.title = data.title;
    }
    if (data.description !== undefined) {
      todo.description = data.description;
    }
    if (data.status !== undefined) {
      todo.status = data.status;
    }

    await todo.save();
    logger.info(`Todo updated: ${todo.id} for user: ${userId}`);

    return todo;
  }

  async deleteTodo(id: string, userId: string): Promise<void> {
    const todo = await this.getTodoById(id, userId);
    await todo.destroy();
    logger.info(`Todo soft deleted: ${todo.id} for user: ${userId}`);
  }
}

export default new TodoService();

