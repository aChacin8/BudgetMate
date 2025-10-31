import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "LinkCanopy API Documentation",
            version: "1.0.0",
            description: "API documentation for the LinkCanopy application.",
        },
        servers: [
            {
                url: "#",
                description: "LinkCanopy, Render Production Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "1" },
                        firstName: { type: "string", example: "Alejandro" },
                        lastName: { type: "string", example: "Chacín" },
                        email: { type: "string", example: "encrypted@email.com" },
                        nonce: { type: "string", example: "randomNonceValue" },
                        password: { type: "string", example: "hashedPasswordValue" },
                        phone: { type: "string", example: "5512345678" },
                        token: { type: "string", example: "123456" },
                        isPremium: { type: "boolean", example: false },
                    },
                },
                Earning: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "1" },
                        baseAmount: { type: "number", example: 150000.00 },
                        periodStart: {  type: "date", example: "2023-01-01" },
                        periodEnd: {  type: "date", example: "2023-01-31" },
                        userId: { type: "string", example: "1" },
                    }
                },
                EarningExpense: {
                    type: "object",
                    propierties: {
                        id: { type: "string", example: "1" },
                        name: { type: "string", example: "Shopping" },
                        amount: { type: "number", example: 2000.00 },
                        earningId: { type: "string", example: "1"},
                    }
                },
                ExtraEarnings: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "1" },
                        source: { type: "string", example: "Freelance Project" },
                        amount: { type: "number", example: 5000.00 },
                        earningId: { type: "string", example: "1"},
                    }
                },
                Budeget: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "1" },
                        name: { type: "string", example: "Travel to Japan" },
                        amount: { type: "number", example: 30000.00 },
                        isActive: { type: "boolean", example: true },
                        budgetType: { type: "string", example: "Future" },
                        description: { type: "string", example: "Saving for a trip to Japan next year." },
                        earningId: { type: "string", example: "1"},
                    }
                },
                BudgetExpense: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "1" },
                        name: { type: "string", example: "Flight Tickets" },
                        amount: { type: "number", example: 15000.00 },
                        budgetId: { type: "string", example: "1"},
                    }
                },
                MonthSummary: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "1" },
                        month: { type: "date", example: "2023-01-01" },
                        totalEarnings: { type: "number", example: 155000.00 },
                        totalExpenses: { type: "number", example: 50000.00 },
                        netSavings: { type: "number", example: 105000.00 },
                        userId: { type: "string", example: "1"},
                    }
                }
            },
        },
    },
    apis: ["./src/doc/paths/*.yaml"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
