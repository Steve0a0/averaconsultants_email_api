const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000; // change if you want

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Hardcoded email config ---
const TO_EMAIL = "stephenangeloirl@gmail.com"; // Receiver (your inbox)

// Replace these with your actual mail provider + credentials
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail SMTP
  port: 465,
  secure: true,           // true = 465, false = 587
  auth: {
    user: "stephenangeloirl@gmail.com",        // your email
    pass: "vgxagdqulwhqabss",          // Gmail App Password (not normal password!)
  },
});

// --- Routes ---
app.get("/", (_req, res) => {
  res.send("Email API is running ✅");
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
    from: `Avera Website <teamwork@averaconsultants.com>`, // always send from your account
    replyTo: email, // visitor email goes here
    to: TO_EMAIL,
    subject: `📩 New Contact Form: ${service} (from ${name})`, // easy to spot in inbox
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
        <h2 style="color: #d37650; margin-bottom: 10px;">📩 New Contact Form Submission</h2>
        
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

    // Return the exact error message so you can see it in Postman
    res.status(500).json({
      success: false,
      message: "Failed to send email.",
      error: err.message, // 👈 Add this
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
