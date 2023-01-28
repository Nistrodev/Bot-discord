const { Events } = require("../Validation/EventNames")

module.exports = async (client, PG, Ascii) => {

    const Table = new Ascii("Evénements chargés")

    const EventFiles = await PG(`${process.cwd()}/Events/*/*.js`)

    EventFiles.map(async file => {

        const event = require(file)

        if(!Events.includes(event.name) || !event.name) {

            const L = file.split("/")

            await Table.addRow(`${event.name || "MANQUANT" }`, `Le nom de l'événement est soit invalide soit manquant: ${L[6] + `/` + L[7]}`)
            return

        }

        if (event.once) client.once(event.name, (...args) => event.execute(...args, client))
        else client.on(event.name, (...args) => event.execute(...args, client))

        await Table.addRow(event.name, "SUCCÉS")

    })

    console.log(Table.toString())
}