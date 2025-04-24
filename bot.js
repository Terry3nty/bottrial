const { Client, LocalAuth, MessageMedia} = require ('whatsapp-web.js');
const qrcode = require ('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr',(qr) => {
    qrcode.generator(qr, {small: true });
});

client.on('ready',() => {
    console.log('Bot is ready !');
} );

client.on ('message', async msg => {
    const chat = await msg.getChat();

    // Tag Everyone
    if (msg.body === '!tagall' && chat.isGroup) {
        let text = '';
        let mention = [];

        for (let participant of chat.participants) {
            const contact = await client.getContactById(participant.is_serialized);
            mentions.push(contact);
            text += `@${contact.number}`;
        }
        chat.sendMessage (text, {mention});
    }

    // Add person Admin shit
    if (msg.body.startsWith('!add') && chat.isGroup){
        if(chat.isGroup && msg.author === chat.owner._serialized) {
            const number = msg.body.split('')[1];
            await chat.addParticipants([`${number}@c.us`]);
        }
    }

    // Remove Person Admin shit
    if (msg.body.startsWith('!remove') && chat.isGroup){
        if(chat.isGroup && msg.author === chat.owner._serialized) {
            const number = msg.body.split('')[1];
            await chat.removeParticipants([`${number}@c.us`]);
        }
    }

    // simple game ex
    if (msg.body === '!gmae') {
        msg.reply("Guess the answer: What has keys but can't open locks ?\n1. A piano\n2. A car\n3. A map\nReply with 1, 2, or 3.");
    }

    if (['1', '2', '3'].includes(msg.body)) {
        if (msg.body === '1') msg.reply('Correct! A piano!');
        else msg.reply('Oops! Try again next time.');
    }
});

client.initialize();