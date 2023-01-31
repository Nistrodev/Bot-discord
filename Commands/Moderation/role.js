const { Client, ChatInputCommandInteraction } = require("discord.js");
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "role",
    description: "Donner ou retirer un rôle à un membre ou à tout le monde",
    UserPerms: ["ManageRoles"],
    BotPerms: ["ManageRoles"],
    category: "Moderation",
    options: [
        {
            name: "options",
            description: "Sélectionnez l'option",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Donner",
                    value: "give"
                },
                {
                    name: "Retirer",
                    value: "remove"
                },
                {
                    name: "Donner à tout le monde",
                    value: "give-all"
                },
                {
                    name: "Retirer à tout le monde",
                    value: "remove-all"
                }
            ]
        },
        {
            name: "role",
            description: "Sélectionnez le rôle à gérer",
            type: 8,
            required: true
        },
        {
            name: "user",
            description: "Sélectionnez l'utilisateur pour gérer les rôles",
            type: 6,
            required: false
        }
    ],

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, guild, member } = interaction

        const Options = options.getString("options")
        const Role = options.getRole("role")
        const Target = options.getMember("user") || member
        if(Options === "give-all" || Options === "remove-all") Target = null;

        if (guild.members.me.roles.highest.position <= Role.position) return EditReply(interaction, "❌", `Le rôle que vous essayez de gérer pour un membre est supérieur au mien !`)

        switch (Options) {

            case "give": {

                if (guild.members.me.roles.highest.position <= Target.roles.highest.position) return EditReply(interaction, "❌", `Le membre que vous essayez de gérer a un rôle supérieur au mien !`)

                if (Target.roles.cache.find(r => r.id === Role.id)) return EditReply(interaction, "❌", `${Target} a déjà le rôle, **${Role.name}** !`)

                await Target.roles.add(Role)

                EditReply(interaction, "✅", `${Target} a maintenant le rôle **${Role.name}** !`)
            }

                break;

            case "remove": {

                if (guild.members.me.roles.highest.position <= Target.roles.highest.position) return EditReply(interaction, "❌", `Le membre que vous essayez de gérer a un rôle supérieur au mien !`)

                if (Target.roles.cache.find(r => r.id === Role.id)) return EditReply(interaction, "❌", `${Target} n'a pas le rôle, **${Role.name}** !`)

                await Target.roles.remove(Role)

                EditReply(interaction, "✅", `${Target} n'a maintenant plus le rôle **${Role.name}** !`)
            }

                break;

            case "give-all": {

                const Members = guild.members.cache.filter(m => !m.user.bot)

                EditReply(interaction, "✅", `Le rôle **${Role.name}** a bien été donné à tout le monde !`)

                await Members.forEach(m => m.roles.add(Role))

            }

                break;

            case "remove-all": {

                const Members = guild.members.cache.filter(m => !m.user.bot)

                EditReply(interaction, "✅", `Le rôle **${Role.name}** a bien été supprimé à tout le monde !`)

                await Members.forEach(m => m.roles.remove(Role))

            }

                break;
        }
    }
}