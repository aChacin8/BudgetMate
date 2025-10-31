import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BudgetMate API Documentation',
            version: '1.0.0',
            description: 'API documentation for BudgetMate application',
        }
    }
}