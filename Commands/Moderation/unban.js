const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const EditReply = require("../../Systems/EditReply");
const ms = require("ms");

module.exports = {
    name: "unban",
    description: "Sélectionnez l'utilisateur à débannir du serveur",
    UserPerms: ["BanMembers"],
    BotPerms: ["BanMembers"],
    category: "Moderation",
    options: [
        {
            name: "user-id",
            description: "Entrez l'ID de l'utilisateur",
            type: 3,
            required: true
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, user, guild } = interaction

        const id = options.getString("user-id")
        if (isNaN(id)) return EditReply(interaction, "❌", `Veuillez fournir un ID valide en chiffres !`)

        const bannedMembers = await guild.bans.fetch()
        if (!bannedMembers.find(x => x.user.id === id)) return EditReply(interaction, "❌", "L'utilisateur n'est pas banni !")

        const Embed = new EmbedBuilder()
            .setColor(client.color)

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("unban-yes")
                .setLabel("Oui"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("unban-no")
                .setLabel("Non")

        )

        const Page = await interaction.editReply({

            embeds: [
                Embed.setDescription(`**⚠️ | Voulez-vous vraiment débannir ce membre ?**`)
            ],
            components: [row]

        })

        const col = await Page.createMessageComponentCollector({
            componentType: ComponentType.Button,
            type: ms("15s")
        })

        col.on("collect", i => {

            if (i.user.id !== user.id) return

            switch (i.customId) {

                case "unban-yes": {

                    guild.members.unban(id)

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | L'utilisateur est maintenant débanni`)
                        ],
                        components: []
                    })

                }
                    break;

                case "unban-no": {

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | La demande de débannissement a été annulée`)
                        ],
                        components: []
                    })

                }
                    break;

            }

        })

        col.on("end", (collected) => {

            if (collected.size > 0) return

            interaction.editReply({
                embeds: [
                    Embed.setDescription(`❌ | Temps écoulé, aucune réponse valide fournie.`)
                ],
                components: []
            })

        })

    }
}