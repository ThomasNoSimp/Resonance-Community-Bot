import { Message, MessagePayload, MessageReplyOptions } from 'discord.js';
import https from 'https';

module.exports = {
    name: 'ai',
    description: 'Generates a response using OpenAI GPT-3.',
    async execute(message: Message, args: string[]) {
        if (message.author.bot) return;

        if (message.content) {
            await message.channel.send('Not available.');
            return;
        }

        /**
         * ! Fix the openAI method.
         */
        const prompt = args.join(' ').trim();
        if (!prompt) {
            return message.reply('Please provide a prompt after the command.');
        }

        async function generateAIResponse(prompt: string): Promise<string> {
            const openaiUrl = 'https://api.openai.com/v1/completions';
            const apiKey = process.env.OPENAI_API_KEY;

            const requestData = JSON.stringify({
                model: 'babbage-002',
                prompt: prompt,
                max_tokens: 50,
                temperature: 0.7,
            });

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            };

            return new Promise((resolve, reject) => {
                const req = https.request(openaiUrl, options, (res) => {
                    let data = '';

                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    res.on('end', () => {
                        if (res.statusCode !== 200) {
                            reject(new Error(`Error generating AI response: ${data}`));
                        } else {
                            const responseData = JSON.parse(data);
                            resolve(responseData.choices[0].text.trim());
                        }
                    });
                });

                req.on('error', (error) => {
                    reject(new Error(`Error generating AI response: ${error.message}`));
                });

                req.write(requestData);
                req.end();
            });
        }

        try {
            const aiResponse: string = await generateAIResponse(prompt);
            message.reply(aiResponse);
        } catch (error: any) {
            message.reply('Sorry, I encountered an error while generating a response: ' + error.message);
        }
    }
};

//