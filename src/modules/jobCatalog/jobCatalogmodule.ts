import { FindJobs } from './application/findJobs.js';
import { GetAllJobs } from './application/getAllJobs.js';
import { Arbeitnow_Ingestion_Cron } from './cron/ingest_ARBEITNOW_Cron.js';
import { Remotive_Ingestion_Cron } from './cron/ingest_RemotiveJob+Cron.js';

export const jobCatalog_usecase_http = {
        findJobs: new FindJobs(),
        getAllJobs: new GetAllJobs()
};

export function start_JobCatalog_Cron() {
        Arbeitnow_Ingestion_Cron();
        Remotive_Ingestion_Cron();
}
