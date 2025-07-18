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
      :     `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*
*┊* *${taguser}*
*┊𝗧𝗨 𝗔𝗨𝗦𝗘𝗡𝗖𝗜𝗔 𝗙𝗨𝗘 𝗖𝗢𝗠𝗢 𝗨𝗡 𝗤𝗟𝗢,* 
*┊𝗖𝗢𝗡 𝗢𝗟𝗢𝗥 𝗔 𝗠𝗥𝗗!!* 👿
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`,
    `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*
*┊* *${taguser}*
*┊𝗔𝗟𝗚𝗨𝗜𝗘𝗡 𝗠𝗘𝗡𝗢𝗦, 𝗤𝗨𝗜𝗘𝗡 𝗧𝗘 𝗥𝗘𝗖𝗨𝗘𝗥𝗗𝗘* 
*┊𝗦𝗘𝗥𝗔 𝗣𝗢𝗥 𝗟𝗔𝗦𝗧𝗜𝗠𝗔, 𝗔𝗗𝗜𝗢𝗦!!* 👿
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`,
    `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*
*┊* *${taguser}*
*┊𝗧𝗨 𝗗𝗘𝗦𝗣𝗘𝗗𝗜𝗗𝗔 𝗡𝗢𝗦 𝗛𝗔𝗥𝗔 𝗟𝗟𝗢𝗥𝗔𝗥,* 
*┊𝗗𝗘 𝗟𝗔 𝗩𝗘𝗥𝗚𝗨𝗘𝗡𝗭𝗔 𝗤𝗨𝗘 𝗗𝗔𝗕𝗔𝗦!!* 👿
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`,
    `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈≫*
*┊* *${taguser}*
*┊𝗗𝗘𝗝𝗢 𝗗𝗘 𝗢𝗟𝗘𝗥 𝗔 𝗠𝗥𝗗,* 
*┊𝗛𝗔𝗦𝗧𝗔 𝗤𝗨𝗘 𝗧𝗘 𝗟𝗔𝗥𝗚𝗔𝗦𝗧𝗘!!* 👿
*╰┈┈┈┈┈┈┈┈┈┈┈┈┈≫*`

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