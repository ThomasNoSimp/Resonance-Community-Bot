"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
module.exports = {
    name: 'ai',
    description: 'Generates a response using OpenAI GPT-3.',
    execute(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            if (message.content) {
                yield message.channel.send('Not available.');
                return;
            }
            /**
             * ! Fix the openAI method.
             */
            const prompt = args.join(' ').trim();
            if (!prompt) {
                return message.reply('Please provide a prompt after the command.');
            }
            function generateAIResponse(prompt) {
                return __awaiter(this, void 0, void 0, function* () {
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
                        const req = https_1.default.request(openaiUrl, options, (res) => {
                            let data = '';
                            res.on('data', (chunk) => {
                                data += chunk;
                            });
                            res.on('end', () => {
                                if (res.statusCode !== 200) {
                                    reject(new Error(`Error generating AI response: ${data}`));
                                }
                                else {
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
                });
            }
            try {
                const aiResponse = yield generateAIResponse(prompt);
                message.reply(aiResponse);
            }
            catch (error) {
                message.reply('Sorry, I encountered an error while generating a response: ' + error.message);
            }
        });
    }
};
//
