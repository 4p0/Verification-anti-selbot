// -- Variable pour définir pour les modules utilisé.
var { Client } = require("discord.js"), client = new Client(), fs = require("fs"), db = JSON.parse(fs.readFileSync("./db.json", "utf8"));

// -- Variable basique (remplace par les ID des salons)
var obj_message = false,
 welcome = "734123033630998659",
 logs = "734123045748342784",
 role = "734127269433311272";

// -- Fonction pour générer un code random (cimer github)
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 
// -- Lorsque le bot est prêt
client.on("ready", () => {
console.clear()
console.log(client.user.tag, " est prêt")
// -- Lors d'un nouveau membre
}).on("guildMemberAdd", async (member) => {
// -- Salon de bienvenue 
var channel = member.guild.channels.cache.get(welcome) 
// -- Génére un code (variable car on dois l'utiliser plusieurs fois)
var code = makeid(8)

// -- Variable pour enregistrer l'embed (pour le supprimer)
obj_message = await channel.send(`${member}, Bienvenue sur **${member.guild.name}**`, {
    embed: {
        title: "Vérification anti-selfbot",
        description: `Afin d'accéder a la globalité du serveur veuillez écrire dans ce salon le code \`${code}\``,
        url: "https://1337.1337/",
        color: 655615,
        footer: {
            text: "Cette mesure a été mis en place afin d'éviter les raids."
        }
    }
});
// -- Ajout dans un JSON
db[member.user.id] = {
    code: code,
    message: obj_message
};
// -- Ecris dans le fichier db.json
fs.writeFile("./db.json", JSON.stringify(db), (x) => {
    if (x) console.error(x)
  });
// -- Delete le message après 5 minutes 
setTimeout(() => {
    if(db[member.user.id]) {
        var userInfo = db[member.user.id]
        userInfo.message.delete()
    }
}, 300000);

// -- Lorsqu'un message est posté
}).on("message", (message) => {
// -- Salon de logs
const channel = message.guild.channels.cache.get(logs)
// -- Si le message posté est dans le salon bienvenue
if(message.channel.id === welcome) {
// -- Vérifie si l'utilisateur est dans la DB
if(db[message.author.id]) {
    // -- Définis la variable userInfo via la db
    var userInfo = db[message.author.id]
    // -- Si le contenue du message correspond au code 
    if(message.content === userInfo.code) {
        // --  Suppression du message
       message.delete()
       userInfo.message.delete()
        // -- Ajout du role (catch = si une error, then = après)
        message.member.roles.add(role)
        .catch(e => console.log("J'ai pas les permissions, ou le rôle existe pas."))
        .then(r => channel.send(`**${message.author.tag}** (\`${message.author.id}\`) a passé la vérification.`))
    } else {
        message.delete()
    }
}
}
// -- Connexion au token
}).login(" Token ici ")
