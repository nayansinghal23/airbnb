import { NotificationDTO } from "../dto/notification.dto";
import { mailerQueue } from "../queues/mailer.queue";

export const MAILER_PAYLOAD = "payload:mailer";

export const addEmailToQueue = async (payload: NotificationDTO) => {
    await mailerQueue.add(MAILER_PAYLOAD, payload);
}