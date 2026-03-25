const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot rodando 🚀");
});

app.listen(PORT, () => {
  console.log("Servidor web ativo");
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state
  });

  // 🔥 ADICIONA ISSO
  sock.ev.on("connection.update", (update) => {
    const { connection, qr } = update;

    if (qr) {
      console.log("QR Code:", qr);
    }

    if (connection === "open") {
      console.log("✅ Bot conectado ao WhatsApp!");
    }

    if (connection === "close") {
      console.log("❌ Conexão fechada");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const jid = msg.key.remoteJid;
    const texto = msg.message.conversation || "";

    if (texto.toLowerCase() === "oi") {
      await sock.sendMessage(jid, {
        text: "Olá 👋 Qual a data do seu evento?"
      });
    }
  });
}

startBot();
