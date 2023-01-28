const { Client, CommandInteraction, InteractionType } = require("discord.js");
const { ApplicationCommand } = InteractionType
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "interactionCreate",

    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { user, guild, commandName, member, type } = interaction

        if(!guild || user.bot) return
        if(type !== ApplicationCommand) return

        const command = client.commands.get(commandName)

        if (!command) return Reply(interaction, "❌", `Une erreur est survenue lors de l'exécution de la commande`, true) && client.commands.delete(commandName)

        if (command.UserPerms && command.UserPerms.length !== 0) if (!member.permissions.has(command.UserPerms)) return Reply(interaction, "❌", `Vous avez besoin de la/des permission(s) \`${command.UserPerms.join(", ")}\` pour exécuter cette commande !`, true)
        if (command.BotPerms && command.BotPerms.length !== 0) if (!guild.members.me.permissions.has(command.BotPerms)) return Reply(interaction, "❌", `J'ai besoin de la/des permission(s) \`${command.UserPerms.join(", ")}\` pour exécuter cette commande !`, true)

        command.execute(interaction, client)

    }

}