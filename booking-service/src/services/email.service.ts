import { getUserDetails } from "../api/user.api";

import { EmailDTO } from "../dto/email.dto";

import { addEmailToQueue } from "../producers/email.producer";

export async function sendEmail(dto: EmailDTO) {
    try {
        const { data } = await getUserDetails(dto.userId, dto.cookie);
        const to = data.data.email;
        await addEmailToQueue({
            to,
            subject: dto.subject,
            templateId: dto.templateId,
            params: {
              name: data.data.username,
            }
        });
    } catch (error) {
        throw new Error("An error occurred while sending mail");
    }
}