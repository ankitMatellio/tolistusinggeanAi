import Joi from 'joi';

export const todoCreateSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('pending', 'completed').optional(),
});

export const todoUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('pending', 'completed').optional(),
});

export const todoQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().allow('').optional(),
  status: Joi.string().valid('pending', 'completed').optional(),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'title').default('createdAt'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().optional(),
});

export const validate = (schema: Joi.Schema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation error',
          details: error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        },
      });
    }

    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Joi.Schema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Query validation error',
          details: error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        },
      });
    }

    req.query = value;
    next();
  };
};

