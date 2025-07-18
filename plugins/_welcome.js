import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters?.[0]
  if (!who) return
  let userTag = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  let dev = '𝑺𝒐𝒇𝒊-𝑩𝒐𝒕'
  let videoDefault = 'https://files.catbox.moe/skcpb6.mp4'

  if (!chat?.welcome) return

  let img, useVideo = false
  try {
    let pp = await conn.profilePictureUrl(who, 'image')
    img = await (await fetch(pp)).buffer()
  } catch {
    useVideo = true
  }

  let welcomeText = chat.welcomeMessage || 'Bienvenido/a :'
  let byeText = chat.despMessage || 'Se fue 😹'

  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    let text = `┌─★ Buubot-𝐒𝐓\n│「 Bienvenido 」\n└┬★ 「 ${userTag} 」\n   │💛 ${welcomeText.replace('@user', userTag).replace('@group', groupMetadata.subject)}\n   └───────────────┈ ⳹\n> ${dev}`
    if (useVideo) {
      await conn.sendMessage(m.chat, {
        video: { url: videoDefault },
        caption: text,
        mentions: [who]
      }, { quoted: estilo })
    } else {
      await conn.sendMessage(m.chat, {
        image: img,
        caption: text,
        mentions: [who]
      }, { quoted: estilo })
    }
  }

  if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
    m.messageStubType === 32 // Expulsado por admin
  ) {
    let text = `┌─★ buubot-𝐒𝐓\n│「 ADIOS 👋 」\n└┬★ 「 ${userTag} 」\n   │💛 ${byeText.replace('@user', userTag).replace('@group', groupMetadata.subject)}\n   └───────────────┈ ⳹\n> ${dev}`
    if (useVideo) {
      await conn.sendMessage(m.chat, {
        video: { url: videoDefault },
        caption: text,
        mentions: [who]
      }, { quoted: estilo })
    } else {
      await conn.sendMessage(m.chat, {
        image: img,
        caption: text,
        mentions: [who]
      }, { quoted: estilo })
    }
  }

  return true
}