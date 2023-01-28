const { Client, ChatInputCommandInteraction } = require("discord.js");
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "ping",
    description: "Affiche la latence",
    category: "Information",

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        return Reply(interaction, "⌛", `La latence actuelle du Webscoket est : \`${client.ws.ping} ms\``, false)
    }
}