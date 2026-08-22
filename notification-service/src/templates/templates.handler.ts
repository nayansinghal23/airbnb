import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';

export async function renderMailTemplate(templateId: string, params: Record<string, any>): Promise<string> {
    const templatePath = path.join(__dirname, 'mailer', `${templateId}.hbs`);
    try {
        const content = await fs.readFile(templatePath, 'utf-8');
        const template = Handlebars.compile(content);
        return template(params);
    } catch (error) {
        console.error('Error while reading mail template : ', error);
        throw error;
    }
}