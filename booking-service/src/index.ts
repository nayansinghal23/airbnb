import express from "express";
import dotenv from "dotenv";

import v1Router from "./routers/index.router";
import { addEmailToQueue } from "./producers/email.producer";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
function sendMail() {
  addEmailToQueue({
    to: "nayansinghal393@gmail.com",
    subject: "Sample email (Booking service)",
    templateId: `sample-template`,
    params: {
      name: "Nayan",
      orderId: "12345",
    }
  });
}
sendMail();

app.use('/api/v1', v1Router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
