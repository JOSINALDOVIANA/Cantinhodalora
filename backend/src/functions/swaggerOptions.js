export const swaggerOptions = {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
    ]
};

    export const options={
        definition: {
            openapi: "3.0.0",
            info: {
                title: "API Cantinho da Lora",
                version: "1.0.0",
                description: "Documentação da API do Cantinho da Lora"
            },
        },
        apis: ["./src/routes/*.js", "./src/controller/*.js"], // arquivos onde estão suas rotas e controllers
    };