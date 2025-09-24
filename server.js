const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const TO_EMAIL = "teamwork@averaconsultants.com";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 587,
  secure: false, 
  auth: {
    user: "no-reply@averaconsultants.com", 
    pass: "tfwrdpqusdlhxsla", 
  },
});

app.get("/", (_req, res) => {
  res.send("Email API is running");
});

app.post("/send-email", async (req, res) => {
  const { name, email, role, service, message } = req.body;

  if (!name || !email || !role || !service) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields.",
    });
  }

  try {
  await transporter.sendMail({
    from: `Avera Website <teamwork@averaconsultants.com>`,
    replyTo: email,
    to: TO_EMAIL,
    subject: `New Contact Form: ${service} (from ${name})`, 
    text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Role: ${role}
Service: ${service}
Message: ${message || "N/A"}

Search Tags: [Avera-Contact] [${service}] [${role}]
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #d37650; margin-bottom: 10px;">New Contact Form Submission</h2>
        
        <table style="width:100%; border-collapse: collapse;">
          <tr>
            <td style="padding:8px; font-weight:bold; width:150px;">Name:</td>
            <td style="padding:8px;">${name}</td>
          </tr>
          <tr style="background:#f9f9f9;">
            <td style="padding:8px; font-weight:bold;">Email:</td>
            <td style="padding:8px;">${email}</td>
          </tr>
          <tr>
            <td style="padding:8px; font-weight:bold;">Role:</td>
            <td style="padding:8px;">${role}</td>
          </tr>
          <tr style="background:#f9f9f9;">
            <td style="padding:8px; font-weight:bold;">Service:</td>
            <td style="padding:8px;">${service}</td>
          </tr>
          <tr>
            <td style="padding:8px; font-weight:bold; vertical-align:top;">Message:</td>
            <td style="padding:8px;">${message || "N/A"}</td>
          </tr>
        </table>

        <p style="margin-top:20px; font-size:0.9em; color:#555;">
          🔖 Search Tags: <b>[Avera-Contact]</b> <b>[${service}]</b> <b>[${role}]</b>
        </p>

        <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />
        <p style="font-size:0.85em; color:#888;">This email was generated from the Avera Consultants website contact form.</p>
      </div>
    `,
  });

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("Error sending email:", err);

    res.status(500).json({
      success: false,
      message: "Failed to send email.",
      error: err.message,
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
