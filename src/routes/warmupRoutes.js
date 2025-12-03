const express = require("express");
const db = require("../config/db");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { smtpTransporter, sendMail } = require("../services/mailer");

const jobs = {};

router.post("/start", async (req, res) => {
  const { email, smtp_account_id, total = 10, intervalSeconds = 20 } = req.body;

  const smtp = db.prepare("SELECT * FROM smtp_accounts WHERE id=?").get(smtp_account_id);
  if (!smtp) return res.status(404).json({ error: "SMTP account not found" });

  const campaignId = uuidv4();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO campaigns (id,email,smtp_account_id,total,sent,status,created_at)
     VALUES (@id,@email,@smtp_id,@total,@sent,@status,@created_at)`
  ).run({
    id: campaignId,
    email,
    smtp_id: smtp_account_id,
    total,
    sent: 0,
    status: "running",
    created_at: now
  });

  const transporter = await smtpTransporter(smtp);
  let count = 0;

  const toList = Array.from({ length: total }).map(
    (_, i) => `${email.split("@")[0]}+warmup${i + 1}@${email.split("@")[1]}`
  );

  const job = setInterval(async () => {
    if (count >= total) {
      clearInterval(job);
      db.prepare("UPDATE campaigns SET status='completed' WHERE id=?").run(campaignId);
      delete jobs[campaignId];
      return;
    }

    const to = toList[count];
    try {
      await sendMail(transporter, {
        from: smtp.user,
        to,
        subject: `Warmup email #${count + 1}`,
        text: "This is warmup."
      });

      db.prepare(
        `INSERT INTO sends (id,campaign_id,to_email,status,created_at)
         VALUES (@id,@camp,@to,'sent',@created)`
      ).run({
        id: uuidv4(),
        camp: campaignId,
        to,
        created: new Date().toISOString()
      });
    } catch (e) {}

    count++;
    db.prepare("UPDATE campaigns SET sent=? WHERE id=?").run(count, campaignId);
  }, intervalSeconds * 1000);

  jobs[campaignId] = job;

  return res.json({ ok: true, campaignId });
});

router.get("/status/:id", (req, res) => {
  const campaign = db.prepare("SELECT * FROM campaigns WHERE id=?").get(req.params.id);
  if (!campaign) return res.status(404).json({ error: "Campaign not found" });

  const sends = db.prepare("SELECT * FROM sends WHERE campaign_id=?").all(req.params.id);
  res.json({ campaign, sends });
});

module.exports = router;
