const { Client, ChatInputCommandInteraction, ButtonBuilder, ActionRowBuilder, ButtonStyle, Embed, EmbedBuilder } = require("discord.js");
const DB = require("../../Structures/Schemas/Verification");
const EditReply = require("../../Systems/EditReply");

module.exports = {
    name: "verify",
    description: "Inbuild Verification System",
    UserPerms: ["ManageGuild"],
    category: "Moderation",
    options: [
        {
            name: "role",
            description: "Sélectionnez le rôle des membres vérifiés.",
            type: 8,
            required: true
        },
        {
            name: "channel",
            description: "Sélectionnez le salon où le système de vérification sera envoyé.",
            type: 7,
            required: false
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, guild, channel } = interaction

        const role = options.getRole("role")
        const Channel = options.getChannel("channel") || channel

        let Data = await DB.findOne({ Guild: guild.id }).catch(err => { })

        if (!Data) {

            Data = new DB({
                Guild: guild.id,
                Role: role.id
            })

            await Data.save()

        } else {

            Data.Role = role.id
            await Data.save()

        }

        Channel.send({

            embeds: [
                new EmbedBuilder()
                .setColor(client.color)
                .setTitle("✅ | Vérification")
                .setDescription("Cliquer sur le bouton pour vérifier")
                .setTimestamp()
            ],
            components: [
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                    .setCustomId("verify")
                    .setLabel("Vérifier")
                    .setStyle(ButtonStyle.Secondary)

                )
            ]
        })

        return EditReply(interaction, "✅", `Panneau de vérification envoyé avec succès dans ${Channel}`)
    }
}