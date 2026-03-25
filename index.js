const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

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

    // INÍCIO
    if (texto.toLowerCase() === "oi") {
      await sock.sendMessage(jid, {
        text: "Olá 👋 Bem-vindo!\n\nQual a data do seu evento?"
      });
    }

    // DATA
    else if (texto.includes("/")) {
      await sock.sendMessage(jid, {
        text: "Perfeito 🎉\n\nQual o local do evento?"
      });
    }

    // LOCAL
    else if (texto.length > 3) {
      await sock.sendMessage(jid, {
        text: "Temos disponível:\n\n🎈 Pula-pula R$150\n🚚 Carretinha R$300\n\nQual você deseja?"
      });
    }

    // ESCOLHA
    if (texto.toLowerCase().includes("pula")) {
      await sock.sendMessage(jid, {
        text: "Perfeito 😍\n\nPara reservar, pague o sinal de R$50:\nhttps://link.mercadopago.com.br/seulink"
      });
    }

    if (texto.toLowerCase().includes("carretinha")) {
      await sock.sendMessage(jid, {
        text: "Perfeito 😍\n\nPara reservar, pague o sinal de R$50:\nhttps://link.mercadopago.com.br/seulink"
      });
    }
  });
}

startBot();
