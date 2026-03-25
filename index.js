const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// servidor web (Render não derrubar)
app.get("/", (req, res) => {
  res.send("Bot rodando 🚀");
});

app.listen(PORT, () => {
  console.log("Servidor web ativo");
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false
  });

  // 🔑 CONEXÃO + CÓDIGO DE PAREAMENTO
  sock.ev.on("connection.update", async (update) => {
    const { connection } = update;

    if (connection === "connecting") {
      try {
        const code = await sock.requestPairingCode("559681141316"); // 🔥 TROQUE PELO SEU NÚMERO
        console.log("🔑 Código de pareamento:", code);
      } catch (err) {
        console.log("Erro ao gerar código:", err);
      }
    }

    if (connection === "open") {
      console.log("✅ Bot conectado ao WhatsApp!");
    }

    if (connection === "close") {
      console.log("❌ Conexão fechada");
    }
  });

  // salva sessão
  sock.ev.on("creds.update", saveCreds);

  // responder mensagens
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
