const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const { smtpTransporter } = require("../services/mailer");

// Test SMTP & Save Account
router.post("/test", async (req, res) => {
  try {
    const { label, host, port, secure, user, pass } = req.body;

    const t = await smtpTransporter({
      host,
      port,
      secure,
      user,
      pass
    });

    const id = uuidv4();
    db.prepare(
      `INSERT INTO smtp_accounts (id,label,host,port,secure,user,pass,created_at)
       VALUES (@id,@label,@host,@port,@secure,@user,@pass,@created_at)`
    ).run({
      id,
      label: label || "SMTP",
      host,
      port,
      secure: secure ? 1 : 0,
      user,
      pass,
      created_at: new Date().toISOString()
    });

    return res.json({ ok: true, id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
