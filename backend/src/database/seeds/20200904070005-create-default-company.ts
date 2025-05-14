import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.bulkInsert(
          "Plans",
          [
            {
              id: 1,
              name: "Plano Essencial",
              users: 1,
              connections: 1,
              queues: 3,
              value: 49.99,
              useCampaigns: false,
              useSchedules: true,
              useInternalChat: true,
              useExternalApi: false,
              useKanban: false,
              useOpenAi: false,
              useIntegrations: false,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
							id: 2,
              name: "Plano Avançado",
              users: 3,
              connections: 1,
              queues: 5,
              value: 89.99,
              useCampaigns: false,
              useSchedules: true,
              useInternalChat: true,
              useExternalApi: false,
              useKanban: false,
              useOpenAi: false,
              useIntegrations: false,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
							id: 3,
              name: "Plano Empresarial",
              users: 5,
              connections: 2,
              queues: 8,
              value: 149.99,
              useCampaigns: false,
              useSchedules: true,
              useInternalChat: true,
              useExternalApi: false,
              useKanban: false,
              useOpenAi: false,
              useIntegrations: false,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
							id: 4,
              name: "Plano Executivo",
              users: 7,
              connections: 4,
              queues: 10,
              value: 279.99,
              useCampaigns: false,
              useSchedules: true,
              useInternalChat: true,
              useExternalApi: false,
              useKanban: false,
              useOpenAi: false,
              useIntegrations: false,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
							id: 5,
              name: "Plano Corporativo",
              users: 10,
              connections: 6,
              queues: 15,
              value: 389.99,
              useCampaigns: false,
              useSchedules: true,
              useInternalChat: true,
              useExternalApi: false,
              useKanban: false,
              useOpenAi: false,
              useIntegrations: false,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
							id: 6,
              name: "Plano Essencial Plus",
              users: 1,
              connections: 1,
              queues: 3,
              value: 69.99,
              useCampaigns: true,
              useSchedules: true,
              useInternalChat: true,
              useExternalApi: false,
              useKanban: true,
              useOpenAi: false,
              useIntegrations: false,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
							id: 7,
              name: "Plano Avançado Plus",
              users: 3,
              connections: 1,
              queues: 5,
              value: 119.99,
              useCampaigns: true,
              useSchedules: true,
              useInternalChat: true,
              useExternalApi: true,
              useKanban: false,
              useOpenAi: false,
              useIntegrations: false,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
							id: 8,
              name: "Plano Empresarial Plus",
              users: 5,
              connections: 2,
              queues: 8,
              value: 199.99,
              useCampaigns: true,
              useSchedules: true,
              useInternalChat: true,
              useExternalApi: true,
              useKanban: true,
              useOpenAi: false,
              useIntegrations: false,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
							id: 9,
              name: "Plano Executivo Plus",
              users: 7,
              connections: 4,
              queues: 10,
              value: 329.99,
              useCampaigns: true,
              useSchedules: true,
              useInternalChat: true,
              useExternalApi: true,
              useKanban: true,
              useOpenAi: false,
              useIntegrations: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
							id: 10,
              name: "Plano Corporativo Plus",
              users: 10,
              connections: 6,
              queues: 15,
              value: 459.99,
              useCampaigns: true,
              useSchedules: true,
              useInternalChat: true,
              useExternalApi: true,
              useKanban: true,
              useOpenAi: true,
              useIntegrations: true,
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
              planId: 10,
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
