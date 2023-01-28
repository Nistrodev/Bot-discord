const { Perms } = require("../Validation/Permissions");
const { Client } = require("discord.js")
const ms = require("ms")

/**
 * @param { Client } client
 */
module.exports = async (client, PG, Ascii) => {

    const Table = new Ascii("Commandes chargées")

    let CommandsArray = []

    const CommandFiles = await PG(`${process.cwd()}/Commands/*/*.js`)

    CommandFiles.map(async (file) => {

        const command = require(file)

        if (!command.name) return Table.addRow(file.split("/")[7], "ÉCHOUÉ", "Nom manquant")
        if (!command.context && !command.description) return Table.addRow(command.name, "ÉCHOUÉ", "Description manquante")
        if (command.UserPerms)
            if (command.UserPerms.every(perms => Perms.includes(perms))) command.default_member_permissions = false
            else return Table.addRow(command.name, "ÉCHOUÉ", "Permission invalide")

        client.commands.set(command.name, command)
        CommandsArray.push(command)

        await Table.addRow(command.name, "SUCCÉS")

    })

    console.log(Table.toString())

    client.on("ready", () => {

        setInterval(() => {

            client.guilds.cache.forEach(guild => {

                guild.commands.set(CommandsArray)

            })

        }, ms("5s"))
    })
}