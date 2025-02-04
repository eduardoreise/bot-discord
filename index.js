const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ActivityType } = require('discord.js');


const canalID = '1267358318767116309';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});
require('dotenv').config();

client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);

    // Define o status do bot para "Jogando Minecraft: Hezzuz Server"
    client.user.setActivity('Minecraft: Hezzuz Server', { type: ActivityType.Playing });
});

// Função de boas-vindas com atribuição de cargos
client.on('guildMemberAdd', async (member) => {
    const channelName = '【🌍】chat-público';
    const regrasChannelId = '1267263247241973836';
    const cargoJogadorId = '1277002844440105111'; // Substitua pelo ID do cargo "👥 Jogador(a)"
    

    // Tentar adicionar os cargos
    try {
        await member.roles.add(cargoJogadorId);
        console.log(`Cargos atribuídos ao membro ${member.user.tag}`);
    } catch (error) {
        console.error(`Erro ao atribuir cargos para ${member.user.tag}:`, error);
    }

    const channel = member.guild.channels.cache.find((ch) => ch.name === channelName && ch.isTextBased());

    if (channel) {
        const embed = new EmbedBuilder()
            .setTitle('🎉 Bem-vindo(a) ao servidor!')
            .setDescription(
                `Olá ${member}, seja muito bem-vindo(a) ao **${member.guild.name}**! 🎊\n\n` +
                '💬 Confira os canais disponíveis e participe das conversas!\n' +
                `📜 Não se esqueça de dar uma olhada nas regras do servidor em <#${regrasChannelId}>.\n\n` +
                'Divirta-se! 😄'
            )
            .setColor(0xFFD700)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: 'Estamos felizes em tê-lo(a) conosco!' });

        await channel.send({ embeds: [embed] });
        console.log(`Mensagem de boas-vindas enviada para ${member.user.tag}`);
    } else {
        console.log(`Canal '${channelName}' não encontrado no servidor ${member.guild.name}.`);
    }
});

// Adicionando comandos personalizados
client.once('ready', async () => {
    console.log(`Bot conectado como ${client.user.tag}`);

    const commands = [
        new SlashCommandBuilder().setName('ping').setDescription('Responde com o ping do bot'),
        new SlashCommandBuilder().setName('userinfo').setDescription('Exibe informações sobre um usuário'),
        new SlashCommandBuilder().setName('server').setDescription('Mostra informações sobre o servidor'),
        new SlashCommandBuilder().setName('help').setDescription('Exibe a lista de comandos'),
    ];

        await client.application.commands.set(commands);
    });

// Comandos de interação
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        const ping = client.ws.ping;
        await interaction.reply(`Pong! 🏓 Latência: ${ping}ms`);
    } else if (commandName === 'userinfo') {
        const member = interaction.options.getMember('user') || interaction.member;
        const joinedAt = member.joinedAt.toLocaleDateString();
        const createdAt = member.user.createdAt.toLocaleDateString();

        const userEmbed = new EmbedBuilder()
            .setColor(0x0000FF)
            .setTitle(`🎉 Informações de ${member.user.tag}`)
            .setDescription(`Aqui estão as informações detalhadas de ${member.user.tag}:`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'ID do Usuário', value: member.user.id },
                { name: 'Entrou no servidor em', value: joinedAt },
                { name: 'Conta criada em', value: createdAt }
            )
            .setFooter({ text: `Solicitado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [userEmbed] });
    } else if (commandName === 'server') {
        const serverEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle(`Informações do servidor: ${interaction.guild.name}`)
            .addFields(
                { name: 'ID do Servidor', value: interaction.guild.id },
                {
                    name: 'Criado em',
                    value: interaction.guild.createdAt.toLocaleDateString('pt-BR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    })
                },
                { name: 'Número de Membros', value: interaction.guild.memberCount.toString() }
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setFooter({ text: 'Aproveite o servidor!' })
            .setTimestamp();

        await interaction.reply({ embeds: [serverEmbed] });
    } else if (commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Comandos Disponíveis')
            .setDescription('Aqui estão os comandos que você pode usar:')
            .addFields(
                { name: '/userinfo', value: 'Exibe informações de um usuário mencionado ou o usuário que executou o comando.' },
                { name: '/ping', value: 'Responde com "Pong!" para testar se o bot está funcionando.' },
                { name: '/server', value: 'Mostra informações sobre o servidor.' }
            )
            .setFooter({ text: 'Estamos aqui para ajudar! 😊' })
            .setTimestamp();

        await interaction.reply({ embeds: [helpEmbed] });
    }
});

// Função para enviar mensagens em canais específicos com cargo "Admin"
const cargoNecessario = 'Admin';
client.on('messageCreate', async (message) => {
    // Ignora mensagens do próprio bot
    if (message.author.bot) return;

    // Verifica se a mensagem foi enviada no canal correto
    if (message.channelId === canalID) {
        // Verifica se o usuário possui o cargo necessário
        if (message.member.roles.cache.some(role => role.name.toLowerCase() === cargoNecessario.toLowerCase())) {
            // Envia a mensagem como se fosse do bot
            await message.channel.send(message.content);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);