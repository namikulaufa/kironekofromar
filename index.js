"use strict";
const fs = require("fs")
const qrcode = require("qrcode")
const Baileys = "@adiwajshing/baileys";
const { WAConnection: _WAConnection } = require("@adiwajshing/baileys");
const WAConnection = require('./Lib/simple').WAConnection(_WAConnection);
const { Functions } = require('./Lib/Functions');
const { start } = require('./Lib/banner');
const { JsonDB } = require("node-json-db")
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')

global['write'] = {};
global['write']['words'] = JSON.parse(fs.readFileSync('./temp/debug.json'));

global.antidelete = false
global.welcome = true
global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
global.Ft = new Functions();// Menghubungkan dari Function.js
global.mediaType = require(Baileys).MessageType //Biar keren hehe
global.conn = new WAConnection(); //Wa Connect dari baileys
global.botuser = require('./config')//Menghubungkan Ke Connection string
global.Events = {}
global.baileys = Baileys //Hehe
global.db = new JsonDB(new Config("database", true, false, '/'));
global.Public = false
global.scrap = require("./Lib/scrape");

//msgTyp
global.text = mediaType.text
global.image = mediaType.image
global.video = mediaType.video
global.audio = mediaType.audio
global.location = mediaType.location
global.document = mediaType.document

conn.version = [ 2, 2140, 12 ]
conn.logger.level = "warn"
conn.browserDescription = ['Rixle Type 3', 'SAFARI', '8.1']

if (fs.existsSync(global.write.words.qrcode)) conn.loadAuthInfo(global.write.words.qrcode)
conn.on('qr', qr => {
qrcode.generate(qr, { small: true })
conn.logger.warn("[!] Scan Kode QR Diatas, Expired dalam 30 detik")
})
conn.on('credentials-updated', () => {})
conn.on('connecting', () => {})
conn.on("open", () => {
conn.on("ws-close", async() => {})
conn.on("close", async() => {}) 

const authInfo = conn.base64EncodedAuthInfo() 
fs.writeFileSync(global.write.words.qrcode, JSON.stringify(authInfo, null, '\t'))

console.clear()
conn.logger.warn('Berhasil Perbarui Jaringan\n')
start('\n',
    conn.logger.warn('\n')
  )
})

setInterval(() => {
 conn.setStatus(`${Ft.count(process.uptime())} | ${Ft.os.hostname()} 𝐑𝐨𝐚𝐝 𝐓𝐨 𝟑𝟎 𝐉𝐮𝐳 🍂 | 𝐏𝐞𝐣𝐮𝐚𝐧𝐠 𝐒𝐡𝐨𝐥𝐚𝐰𝐚𝐭`).catch((_) => _)
},1000)
 require('./src/loader');

 async function run() {// Function biar bisa run bot
 let message = require('./action/chats');
 let action = require('./action/action');
 await conn.connect();
 conn.message = message.msg
 conn.on('chat-update', conn.message);
 conn.on('group-participants-update', action.groupUpdate);
 }
 Ft.action()
 run();// Menjalankan Bot
