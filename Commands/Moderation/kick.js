const { Client, ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const EditReply = require("../../Systems/EditReply");
const ms = require("ms");

module.exports = {
    name: "kick",
    description: "Expulse un membre du serveur",
    UserPerms: ["KickMembers"],
    BotPerms: ["KickMembers"],
    category: "Moderation",
    options: [
        {
            name: "user",
            description: "Sélectionnez l'utilisateur",
            type: 6,
            required: true
        },
        {
            name: "reason",
            description: "Fournissez une raison",
            type: 3,
            required: false
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, user, guild } = interaction

        const member = options.getMember("user")
        const reason = options.getString("reason") || "Aucune raison fournie"

        if (member.id === user.id) return EditReply(interaction, "❌", `Vous ne pouvez pas vous expulser !`)
        if (guild.ownerId === member.id) return EditReply(interaction, "❌", `Vous ne pouvez pas expulser le propriétaire du serveur !`)
        if (guild.members.me.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "❌", `Vous ne pouvez pas expulser un membre de votre même niveau ou supérieur !`)
        if (interaction.member.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "❌", `Je ne peux pas expulser un membre de mon même niveau ou supérieur !`)

        const Embed = new EmbedBuilder()
            .setColor(client.color)

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId("kick-yes")
                .setLabel("Oui"),

            new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("kick-no")
                .setLabel("Non")

        )

        const Page = await interaction.editReply({

            embeds: [
                Embed.setDescription(`**⚠️ | Voulez-vous vraiment expulser ce membre ?**`)
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

                case "kick-yes": {

                    member.kick({ reason })

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | ${member} a été expulsé pour : **${reason}**`)
                        ],
                        components: []
                    })

                    member.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color)
                                .setDescription(`Vous avez été expulsé de ** ${guild.name}**`)
                        ]
                    }).catch(err => {

                        if (err.code !== 50007) return console.log(err)

                    })

                }
                    break;

                case "kick-no": {

                    interaction.editReply({
                        embeds: [
                            Embed.setDescription(`✅ | La demande d'expulsion a été annulée.`)
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