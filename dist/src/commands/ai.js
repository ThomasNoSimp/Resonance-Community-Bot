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
const axios_1 = __importDefault(require("axios"));
module.exports = {
    execute(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            if (message.content.toLowerCase() === '!ai') {
                try {
                    const response = yield generateAIResponse(); // Function to generate AI response
                    message.channel.send(response);
                }
                catch (error) {
                    console.error('Error generating AI response:', error);
                    message.channel.send('Sorry, I encountered an error while generating the AI response.');
                }
            }
        });
    }
};
function generateAIResponse() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const prompt = 'Ask something here...';
        const openaiUrl = 'https://api.openai.com/v1/completions';
        try {
            const response = yield axios_1.default.post(openaiUrl, {
                model: 'text-davinci-002', // Choose the appropriate model
                prompt: prompt,
                max_tokens: 50, // Adjust as needed
                temperature: 0.7, // Adjust as needed
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            return response.data.choices[0].text.trim();
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response) {
                throw new Error('Error generating AI response: ' + ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data.error.message));
            }
            else {
                throw new Error('Error generating AI response: ' + error.toString());
            }
        }
    });
}
