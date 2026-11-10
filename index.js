const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const SERVER_ID = "1544444034792161342";

const CHANNEL_IDS = [
  "1544444035970633811",
  "1544464287412518985",
  "1544466011896549448"
];

let lastVisibility = null;

async function updateChannels(guild) {
  const isStreaming = guild.voiceStates.cache.some(
    voiceState => voiceState.streaming
  );

  if (lastVisibility === isStreaming) return;

  for (const channelId of CHANNEL_IDS) {
    try {
      const channel = await guild.channels.fetch(channelId);

      if (!channel) continue;

      await channel.permissionOverwrites.edit(
        guild.roles.everyone,
        { ViewChannel: isStreaming }
      );

      console.log(
        `${channel.name}: ${isStreaming ? "Visible" : "Oculto"}`
      );
    } catch (error) {
      console.error("Error en canal:", channelId, error);
    }
  }

  lastVisibility = isStreaming;
}

client.once("ready", async () => {
  console.log(`Bot conectado como ${client.user.tag}`);

  const guild = await client.guilds.fetch(SERVER_ID);

  await updateChannels(guild);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  const guild = newState.guild;

  await updateChannels(guild);
});

client.login(process.env.DISCORD_TOKEN);
