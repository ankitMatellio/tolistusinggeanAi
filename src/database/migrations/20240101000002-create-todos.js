'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('todos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed'),
        defaultValue: 'pending',
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('todos', ['userId'], {
      name: 'todos_userId_index',
    });
    await queryInterface.addIndex('todos', ['status'], {
      name: 'todos_status_index',
    });
    await queryInterface.addIndex('todos', ['createdAt'], {
      name: 'todos_createdAt_index',
    });
    await queryInterface.addIndex('todos', ['deletedAt'], {
      name: 'todos_deletedAt_index',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('todos');
  },
};

