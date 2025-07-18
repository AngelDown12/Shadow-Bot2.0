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
      : `┌─★ 𝑺𝑶𝑭𝑰 - 𝑩𝑶𝑻 \n│「 Bienvenido 」\n└┬★ 「 ${user} 」\n   │✑  Bienvenido a\n   │✑  ${group}\n   │✑  Descripción:\n${desc}\n   └───────────────┈ ⳹`

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
      : `┌─★ 𝑺𝑶𝑭𝑰 - 𝑩𝑶𝑻 \n│「 BAYY 👋 」\n└┬★ 「 ${user} 」\n   │✑  Lárgate\n   │✑  Jamás te quisimos aquí\n   └───────────────┈ ⳹`

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