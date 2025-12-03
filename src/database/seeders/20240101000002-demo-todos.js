'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const todos = [
      // User 1 todos
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Complete project documentation',
        description: 'Write comprehensive API documentation with examples',
        status: 'pending',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Review code changes',
        description: 'Review pull requests and provide feedback',
        status: 'completed',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-03'),
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440003',
        userId: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Setup CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing',
        status: 'pending',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
      // User 2 todos
      {
        id: '660e8400-e29b-41d4-a716-446655440004',
        userId: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Design user interface',
        description: 'Create mockups for the new dashboard',
        status: 'pending',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440005',
        userId: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Implement authentication',
        description: 'Add JWT-based authentication system',
        status: 'completed',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-04'),
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440006',
        userId: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Write unit tests',
        description: 'Achieve 80% code coverage',
        status: 'pending',
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06'),
      },
      // User 3 todos
      {
        id: '660e8400-e29b-41d4-a716-446655440007',
        userId: '550e8400-e29b-41d4-a716-446655440003',
        title: 'Deploy to staging',
        description: 'Deploy latest version to staging environment',
        status: 'completed',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440008',
        userId: '550e8400-e29b-41d4-a716-446655440003',
        title: 'Monitor performance',
        description: 'Set up monitoring and alerting',
        status: 'pending',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04'),
      },
    ];

    await queryInterface.bulkInsert('todos', todos);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('todos', null, {});
  },
};

