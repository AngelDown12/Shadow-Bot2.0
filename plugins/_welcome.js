import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0

  let chat = global.db.data.chats[m.chat]
  if (!chat?.bienvenida) return

  let who = m.messageStubParameters?.[0]
  if (!who) return

  let user = `@${who.split('@')[0]}`
  let group = groupMetadata.subject
  let desc = groupMetadata.desc || 'sin descripción'
  const videoDefault = 'https://files.catbox.moe/skcpb6.mp4'

  let img, isVideo = false
  try {
    let pp = await conn.profilePictureUrl(who, 'image')
    img = await (await fetch(pp)).buffer()
  } catch {
    isVideo = true
  }

  // ========= ENTRADA =========
  if (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    let text = chat.sWelcome
      ? chat.sWelcome.replace(/@user/g, user).replace(/@group/g, group).replace(/@desc/g, desc)
      :     `┏─────────────────┐
「 ${taguser} 」
𝘽𝙄𝙀𝙉𝙑𝙀𝙉𝙄𝘿𝙓 😊
𝑫𝒊𝒔𝒇𝒓𝒖𝒕𝒂 𝒅𝒆 𝒕𝒖 𝒆𝒔𝒕𝒂𝒅𝒊𝒂 𝒓𝒆𝒄𝒖𝒆𝒓𝒅𝒂 𝒄𝒖𝒎𝒑𝒍𝒊𝒓 𝒍𝒂𝒔 𝒓𝒆𝒈𝒍𝒂𝒔 𝒚 𝒍𝒆𝒆𝒓 l𝒂 𝒅𝒆𝒔𝒄𝒓𝒊𝒑𝒄𝒊𝒐𝒏 ✨

└───── 𝙅𝙊𝙏𝘼 𝘽𝙊𝙏🐼─────┘`,
    `┏━━━━━━━━━━━━
┃──〘 *𝗕𝗜𝗘𝗡𝗩𝗘𝗡𝗜𝗗𝗫* 〙───
┃━━━━━━━━━━━━
┃ *_🐼 𝗘𝗡𝗧𝗥𝗢   ${taguser}_* 
┃ *_Un gusto tenerte aqui_*
┃ *_Disfruta tu estadía 😇_*
┗━━━𝙅𝙊𝙏𝘼 𝘽𝙊𝙏━━━━`

    if (isVideo) {
      await conn.sendMessage(m.chat, {
        video: { url: videoDefault },
        caption: text,
        mentions: [who]
      })
    } else {
      await conn.sendAi(m.chat, botname, textbot, text, img, img, canal)
    }
  }

  // ========= SALIDA O EXPULSADO =========
  if (
    m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE
  ) {
    let text = chat.sBye
      ? chat.sBye.replace(/@user/g, user).replace(/@group/g, group).replace(/@desc/g, desc)
      : `┌─★ BUU - 𝑩𝑶𝑻 \n│「 BAYY 👋 」\n└┬★ 「 ${user} 」\n   │✑  Lárgate\n   │✑  Jamás te quisimos aquí\n   └───────────────┈ ⳹`

    if (isVideo) {
      await conn.sendMessage(m.chat, {
        video: { url: videoDefault },
        caption: text,
        mentions: [who]
      })
    } else {
      await conn.sendAi(m.chat, botname, textbot, text, img, img, canal)
    }
  }
}