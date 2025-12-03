import { Response } from 'express';
import AuthService from '../services/AuthService';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/errorHandler';

class AuthController {
  register = asyncHandler(async (req: any, res: Response) => {
    const result = await AuthService.register(req.body);
    sendSuccess(res, result, 201);
  });

  login = asyncHandler(async (req: any, res: Response) => {
    const result = await AuthService.login(req.body);
    sendSuccess(res, result);
  });
}

export default new AuthController();

