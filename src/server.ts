import { createServer, type Server } from 'node:http';
import { initializeApplication } from './app.js';
import { loadEnv } from './infrastructure/env/env.js';

const application = initializeApplication();
const applicationServer: Server = createServer(application);
const PORT = process.env.PORT;

async function initializeServer(applicationServer: Server): Promise<void> {
        loadEnv();
        console.log('.....ENVIRONMENT VARIABLES LOADED SUCESSFULLY');

        applicationServer.listen(PORT, () => {
                console.log(`....SERVER RUNNING ON PORT : ${PORT}`);
        });
}

process.on('SIGINT', () => {
        applicationServer.close((err) => {
                console.error(err);
                process.exit(0);
        });
});
process.on('SIGTERM', () => {
        applicationServer.close((err) => {
                console.error(err);
                process.exit(0);
        });
});

await initializeServer(applicationServer).catch((err) => {
        console.error(err);
        process.exit(1);
});
