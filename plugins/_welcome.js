import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  const userId = m.messageStubParameters?.[0]
  if (!userId) return

  let pp = await conn.profilePictureUrl(userId, 'image').catch(_ => 'https://qu.ax/jYQH.jpg')
  let img = await fetch(pp).then(res => res.buffer())
  let chat = global.db.data.chats[m.chat]

  // Personalización
  const botname = '🐼 Buu Bot'
  const textbot = '🤖 Bienvenido a la experiencia Buu Bot.\nUsa *.menu* para comenzar 🍷'
  const estilo = '🍷 Disfruta tu estancia 🍷'
  const canal = '' // ¡IMPORTANTE! ← Evita que salga preview de enlace

  // Bienvenida automática
  if (chat.bienvenida && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    let user = `@${userId.split`@`[0]}`
    if (chat.sWelcome) {
      let welcome = chat.sWelcome
        .replace('@user', user)
        .replace('@group', groupMetadata.subject)
        .replace('@desc', groupMetadata.desc || 'sin descripción')
      await conn.sendAi(m.chat, botname, textbot, welcome, img, img, canal, estilo)
    } else {
      let bienvenida = `┏━━━━━━━━━━━━
┃──〘 *𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗫* 〙───
┃━━━━━━━━━━━━
┃ *_🐼 𝗘𝗡𝗧𝗥𝗢   ${user}_* 
┃ *_Un gusto tenerte aqui_*
┃ *_Disfruta tu estadía 😇_*
┗━━━𝗕𝘂𝘂 𝗕𝗼𝘁━━━━`
      await conn.sendAi(m.chat, botname, textbot, bienvenida, img, img, canal, estilo)
    }
  }

  // Salida voluntaria
  if (chat.bienvenida && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE) {
    let user = `@${userId.split`@`[0]}`
    if (chat.sBye) {
      let bye = chat.sBye
        .replace('@user', user)
        .replace('@group', groupMetadata.subject)
        .replace('@desc', groupMetadata.desc || 'sin descripción')
      await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal, estilo)
    } else {
      let bye = `┌─★ 𝗕𝘂𝘂 𝗕𝗼𝘁 🐼 
│「 ADIOS 👋 」
└┬★ 「 ${user} 」
   │☠️ *Acabas de ser escupido por puta planta*
   │💫 *Ni modo, hasta luego...*
   └────────┈ ⳹`
      await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal, estilo)
    }
  }

  // Kick (expulsión manual)
  if (chat.bienvenida && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
    const user = `@${userId.split`@`[0]}`
    if (chat.sBye) {
      let bye = chat.sBye
        .replace('@user', user)
        .replace('@group', groupMetadata.subject)
        .replace('@desc', groupMetadata.desc || 'sin descripción')
      await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal, estilo)
    } else {
      let kick = `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*
*┊* *${user}*
*┊𝗔𝗟𝗚𝗨𝗜𝗘𝗡 𝗠𝗘𝗡𝗢𝗦, 𝗤𝗨𝗜𝗘𝗡 𝗧𝗘 𝗥𝗘𝗖𝗨𝗘𝗥𝗗𝗘* 
*┊𝗦𝗘𝗥𝗔 𝗣𝗢𝗥 𝗟𝗔𝗦𝗧𝗜𝗠𝗔, 𝗔𝗗𝗜𝗢𝗦!!* 👿
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`
      await conn.sendAi(m.chat, botname, textbot, kick, img, img, canal, estilo)
    }
  }
}