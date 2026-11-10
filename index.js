
const {
  Client,
  GatewayIntentBits,
  PermissionsBitField
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const SERVER_ID = "1544444034792161342";

const CHANNEL_IDS = [
  "1544444035970633811",
  "1544464287412518985",
  "1544466011896549448"
];

async function setChannelsVisibility(guild, visible) {
  for (const channelId of CHANNEL_IDS) {
    const channel = await guild.channels.fetch(channelId);

    if (!channel) continue;

    await channel.permissionOverwrites.edit(
      guild.roles.everyone,
      { ViewChannel: visible }
    );
  }
}

client.once("ready", () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.guildId !== SERVER_ID) return;

  const command = message.content.trim().toLowerCase();

  if (!command.startsWith("$stream")) return;

  if (!message.member.permissions.has(
    PermissionsBitField.Flags.ManageChannels
  )) {
    return message.reply("No tienes permiso para usar este comando.");
  }

  try {
    if (command === "$stream activar") {
      await setChannelsVisibility(message.guild, true);
      return message.reply("✅ Los canales de voz ahora son públicos.");
    }

    if (command === "$stream desactivar") {
      await setChannelsVisibility(message.guild, false);
      return message.reply("🔒 Los canales de voz ahora son privados.");
    }

    return message.reply(
      "Usa `$stream activar` o `$stream desactivar`."
    );

  } catch (error) {
    console.error(error);
    return message.reply("❌ No pude cambiar los permisos de los canales.");
  }
});

client.login(process.env.DISCORD_TOKEN);
