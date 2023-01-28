const { Client, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "messageCreate",

    /**
     * @param {Messsage} message 
     * @param {Client} client 
     */
    async execute(message, client) {

        const { author, guild, content } = message;
        const { user } = client;

        if (!guild || author.bot) return;
        if (content.includes("@here") || content.includes("@everyone")) return;
        if (!content.includes(user.id)) return;

        return message.reply({

            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                    .setDescription(`Salut, tu m'as appelé ? Enchanté de te rencontrer. Tape `/` & clique sur mon logo pour voir toutes mes commandes!\n\n*Ce message sera supprimé dans \`10 secondes\`!*`)
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({ text: "Introduction to Drago" })
                    .setTimestamp()
            ],

            components: [
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://github.com/Nistrodev")
                        .setLabel("Github"),

                )
            ]
        }).then(msg => {

            setTimeout(() => {

                msg.delete().catch(err => {

                    if (err.code !== 10008) return console.log(err)

                })

            }, ms("10s"))

        })

    }
}