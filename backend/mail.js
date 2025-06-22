const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com",
    pass: "yourapppassword", 
  },
});

const sendMedicationAlert = async (to, name, adherenceRate, streak) => {
  const mailOptions = {
    from: '"MediAlert" <yourgmail@gmail.com>',
    to,
    subject: `Medication Alert - ${name}`,
    text: `Hello,

This is a reminder that ${name} has not taken her medication today.

Please check with her to ensure she takes her prescribed medication.

Current adherence rate: ${adherenceRate}% (${streak}-day streak)`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMedicationAlert;
