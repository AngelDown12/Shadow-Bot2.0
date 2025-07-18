import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  let who = m.messageStubParameters?.[0]
  if (!who) return

  let chat = global.db.data.chats[m.chat]
  if (!chat?.welcome) return

  const userTag = `@${who.split('@')[0]}`
  const dev = '𝑺𝒐𝒇𝒊-𝑩𝒐𝒕'
  const defaultVideo = 'https://files.catbox.moe/skcpb6.mp4'
  const welcomeText = chat.welcomeMessage || 'Bienvenido/a :'
  const byeText = chat.despMessage || 'Se fue 😹'

  let media, useVideo = false
  try {
    let profilePic = await conn.profilePictureUrl(who, 'image')
    media = await (await fetch(profilePic)).buffer()
  } catch {
    useVideo = true
  }

  const textWelcome = `┌─★ buu-𝐒𝐓\n│「 Bienvenido 」\n└┬★ 「 ${userTag} 」\n   │💛 ${welcomeText
    .replace(/@user/g, userTag)
    .replace(/@group/g, groupMetadata.subject)}\n   └───────────────┈ ⳹\n> ${dev}`

  const textBye = `┌─★ buu-𝐒𝐓\n│「 ADIOS 👋 」\n└┬★ 「 ${userTag} 」\n   │💛 ${byeText
    .replace(/@user/g, userTag)
    .replace(/@group/g, groupMetadata.subject)}\n   └───────────────┈ ⳹\n> ${dev}`

  const send = async (type, text) => {
    let msg
    if (useVideo) {
      msg = {
        video: { url: defaultVideo },
        caption: text,
        mentions: [who],
      }
    } else {
      msg = {
        image: media,
        caption: text,
        mentions: [who],
      }
    }
    await conn.sendMessage(m.chat, msg)
  }

  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    await send('welcome', textWelcome)
  }

  if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
    m.messageStubType === 32 // expulsión
  ) {
    await send('bye', textBye)
  }

  return true
}