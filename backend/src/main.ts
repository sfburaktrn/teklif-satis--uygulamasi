import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Enable CORS for frontend communication
    app.enableCors();
    await app.listen(3001); // Running on port 3001 to avoid conflict with frontend (3000)
}
bootstrap();
