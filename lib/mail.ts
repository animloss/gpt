import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  template: "ret" | "duyuru";
  variables: Record<string, string>;
  type: "retMaili" | "duyuruMaili";
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  port: Number(process.env.SMTP_PORT || 2525),
  auth: {
    user: process.env.SMTP_USER || "demo",
    pass: process.env.SMTP_PASS || "demo"
  }
});

function renderTemplate(name: "ret" | "duyuru", variables: Record<string, string>) {
  const filePath = path.join(process.cwd(), "emails", `${name}.html`);
  let template = fs.readFileSync(filePath, "utf8");
  Object.keys(variables).forEach((key) => {
    template = template.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
  });
  return template;
}

export async function sendEmail(options: SendEmailOptions) {
  const html = renderTemplate(options.template, options.variables);
  await transporter.sendMail({
    from: "Müzik Distribütörü <no-reply@muzik.local>",
    to: options.to,
    subject: options.subject,
    html
  });
}
