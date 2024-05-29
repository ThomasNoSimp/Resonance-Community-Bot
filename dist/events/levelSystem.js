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
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../firebase");
const firestore_1 = require("firebase/firestore");
const XP_PER_MESSAGE = 10;
const getUserData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userDoc = (0, firestore_1.doc)(firebase_1.db, 'users', userId);
    const docSnap = yield (0, firestore_1.getDoc)(userDoc);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    else {
        return { xp: 0, level: 1 };
    }
});
const saveUserData = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const userDoc = (0, firestore_1.doc)(firebase_1.db, 'users', userId);
    yield (0, firestore_1.setDoc)(userDoc, data);
});
const calculateLevel = (xp) => {
    let level = 1;
    let xpForNextLevel = 100;
    while (xp >= xpForNextLevel) {
        xp -= xpForNextLevel;
        level++;
        xpForNextLevel *= 2;
    }
    return level;
};
const updateLevelSystem = (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot)
        return;
    const userId = message.author.id;
    const userData = yield getUserData(userId);
    userData.xp += XP_PER_MESSAGE;
    const newLevel = calculateLevel(userData.xp);
    if (newLevel > userData.level) {
        userData.level = newLevel;
        message.reply(`Congratulations, you leveled up to level ${newLevel}!`);
    }
    yield saveUserData(userId, userData);
});
module.exports = (client) => {
    client.on('messageCreate', updateLevelSystem);
};
