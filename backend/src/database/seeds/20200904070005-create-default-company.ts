import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.bulkInsert(
          "Plans",
          [
            {
              name: "Plano Essencial",
              users: 1,
              connections: 1,
              queues: 3,
              value: 49.99,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: "Plano Avançado",
              users: 3,
              connections: 1,
              queues: 5,
              value: 89.99,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: "Plano Empresarial",
              users: 5,
              connections: 2,
              queues: 8,
              value: 149.99,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: "Plano Executivo",
              users: 7,
              connections: 4,
              queues: 10,
              value: 279.99,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: "Plano Corporativo",
              users: 10,
              connections: 6,
              queues: 15,
              value: 389.99,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: "Plano Essencial Plus",
              users: 1,
              connections: 1,
              queues: 3,
              value: 69.99,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: "Plano Avançado Plus",
              users: 3,
              connections: 1,
              queues: 5,
              value: 119.99,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: "Plano Empresarial Plus",
              users: 5,
              connections: 2,
              queues: 8,
              value: 199.99,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: "Plano Executivo Plus",
              users: 7,
              connections: 4,
              queues: 10,
              value: 329.99,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              name: "Plano Corporativo Plus",
              users: 10,
              connections: 6,
              queues: 15,
              value: 459.99,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          { transaction: t }
        ),
        queryInterface.bulkInsert(
          "Companies",
          [
            {
              name: "Empresa 1",
              planId: 1,
              dueDate: "3000-01-01 04:00:00+01",
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          { transaction: t }
        )
      ]);
    });
  },

  down: async (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.bulkDelete("Companies", {}),
      queryInterface.bulkDelete("Plans", {})
    ]);
  }
};
