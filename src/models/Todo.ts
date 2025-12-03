import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

export enum TodoStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

interface TodoAttributes {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TodoStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface TodoCreationAttributes
  extends Optional<TodoAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

class Todo extends Model<TodoAttributes, TodoCreationAttributes> implements TodoAttributes {
  public id!: string;
  public userId!: string;
  public title!: string;
  public description?: string;
  public status!: TodoStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public deletedAt?: Date | null;
}

Todo.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(TodoStatus)),
      defaultValue: TodoStatus.PENDING,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'todos',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
  }
);

// Associations
Todo.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Todo, { foreignKey: 'userId', as: 'todos' });

export default Todo;

