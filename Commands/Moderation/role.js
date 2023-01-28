const { Client, ChatInputCommandInteraction } = require("discord.js");
const EditReply = require("../../Systems/EditReply")

module.expotrs = {
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

        const { options, guild, user } = interaction

        const Options = options.getString("options")
        const Role = options.getRole("role")
        const Target = options.getMember("user")

        if (guild.members.me.roles.highest.position <= Role.position) return EditReply(interaction, "❌", `Le rôle que vous essayez de gérer pour un membre est supérieur au mien !`)

        switch (Topic) {

            case "give": {

                if (guild.members.me.roles.highest.position <= Target.roles.highest.position) return EditReply(interaction, "❌", `Le membre que vous essayez de gérer a un rôle supérieur au mien !`)

                if (Target.roles.cache.find(r => r.id === Role.id)) return EditReply(interaction, "❌", `${Target} a déjà le rôle, **${Role.name}** !`)

                await Target.roles.add(Role)

                EditReply(interaction, "✅", `${Target} a maintenant le rôle **${Role.name}}** !`)
            }

                break;
        }
    }
}