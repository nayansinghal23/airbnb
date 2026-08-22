import express from "express";
import dotenv from "dotenv";

import { setupMailWorker } from "./processors/email.processor";
import { addEmailToQueue } from "./producers/email.producer";
import { renderMailTemplate } from "./templates/templates.handler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function sendMail() {
  setupMailWorker();
  addEmailToQueue({
    to: "nayan.20scse1010595@galgotiasuniversity.edu.in",
    templateId: "welcome",
    subject: "Course onboarding mail🎉",
    params: {
      name: "Nayan Galgotia",
      appName: "booking.com"
    },
  });
}
sendMail();


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
