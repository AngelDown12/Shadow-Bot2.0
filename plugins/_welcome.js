import { WAStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType || !m.isGroup) return true

    const videoUrl = 'https://files.catbox.moe/blvtbw.mp4'
    let chat = global.db.data.chats[m.chat]
    let user = `@${m.messageStubParameters[0].split('@')[0]}`
    let groupName = groupMetadata.subject
    let groupDesc = groupMetadata.desc || 'sin descripción'

    // BIENVENIDA
    if (chat.bienvenida && m.messageStubType == 27) {
        const msgsWelcome = [
            `┌─────────⊷
「${user}」
*BIENVENIDX 😊*
Disfruta de tu estadía recuerda cumplir las reglas y leer la descripción ✨
└─────────⊷ SHADOW BOT 🍷`,
            `┌── [*BIENVENIDX* ] ──
│
│ 🍷 ENTRO ${user} 🍷
│ _Un gusto tenerte aquí_
│ _Disfruta tu estadía 😇_
└──────────⊷ SHADOW BOT 🍷`
        ]
        let welcome = chat.sWelcome
            ? chat.sWelcome
                  .replace(/@user/g, user)
                  .replace(/@group/g, groupName)
                  .replace(/@desc/g, groupDesc)
            : msgsWelcome[Math.floor(Math.random() * msgsWelcome.length)]
        await conn.sendMessage(m.chat, { text: welcome, mentions: [m.sender] }, { quoted: m })
    }

    // DESPEDIDA
    if (chat.bienvenida && (m.messageStubType == 28 || m.messageStubType == 32)) {
        const msgsBye = [
            `*(──────────────────➤)*\n*${user}*\n*TU AUSENCIA FUE COMO UN QLO, CON OLOR A MRD!!* 😈\n*(──────────────────➤)*`,
            `*(──────────────────➤)*\n*${user}*\n*ALGUIEN MENOS, QUIEN TE RECUERDE*\n*SERA POR LASTIMA, ADIOS!!* 😈\n*(──────────────────➤)*`,
            `*(──────────────────➤)*\n*${user}*\n*TU DESPEDIDA NOS HARÁ LLORAR, DE LA VERGUENZA QUE DABAS!!* 😈\n*(──────────────────➤)*`,
            `*(──────────────────➤)*\n*${user}*\n*DEJO DE OLER A MRD,*\n*HASTA QUE TE LARGASTE!!* 😈\n*(──────────────────➤)*`
        ]

        let bye = chat.sBye
            ? chat.sBye
                  .replace(/@user/g, user)
                  .replace(/@group/g, groupName)
                  .replace(/@desc/g, groupDesc)
            : msgsBye[Math.floor(Math.random() * msgsBye.length)]

        await conn.sendMessage(m.chat, { text: bye, mentions: [m.sender] }, { quoted: m })
    }
}