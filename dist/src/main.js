"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const config_1 = require("./common/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter({
        logger: {
            level: 'info',
        },
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    await app.register(require('@fastify/cors'), {
        origin: config_1.config.FRONTEND_ORIGIN,
        credentials: true,
    });
    await app.register(require('@fastify/rate-limit'), {
        max: 100,
        timeWindow: '1 minute',
    });
    await app.register(require('@fastify/multipart'));
    app.setGlobalPrefix('api/v1');
    const port = process.env.PORT || 8000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Motorcycle Wash API is running on: http://localhost:${port}/api/v1`);
    console.log(`📖 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌍 Timezone: ${config_1.config.TZ}`);
}
bootstrap().catch((error) => {
    console.error('Failed to start application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map