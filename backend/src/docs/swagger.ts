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
        },
    },
    apis: ["./src/doc/paths/*.yaml", "./src/doc/schemas/*.yaml"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
