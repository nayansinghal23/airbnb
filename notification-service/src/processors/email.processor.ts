import { Worker, Job } from 'bullmq';

import { NotificationDTO } from '../dto/notification.dto';
import { MAILE_QUEUE } from '../queues/mailer.queue';
import { MAILER_PAYLOAD } from '../producers/email.producer';
import { getRedisConnection } from '../config/redis.config';
import { renderMailTemplate } from '../templates/templates.handler';
import { sendEmail } from '../services/mailer.service';


export function setupMailWorker() {
    const emailProcessor = new Worker<NotificationDTO>(
        MAILE_QUEUE,
        async (job: Job) => {
            if(job.name !== MAILER_PAYLOAD) {
                throw new Error("Invalid job name");
            }
            // call service layer from here
            const payload = job.data;
            const emailContent = await renderMailTemplate(payload.templateId, payload.params);
            await sendEmail(payload.to, payload.subject, emailContent);
        },
        {
            connection: getRedisConnection(),
        }
    );
    
    emailProcessor.on("failed", () => {
        console.error("Email processing failed");
    });
    
    emailProcessor.on("completed", () => {
        console.log("Email processing completed");
    });
}