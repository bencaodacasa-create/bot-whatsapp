const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// servidor web (necessário pro Render não derrubar)
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
