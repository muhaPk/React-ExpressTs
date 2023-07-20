"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PORT = process.env.POST || 3001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log('server started', PORT);
});
const data = require('./data.json');
let currentRequest = null;
app.post('/search', (req, res) => {
    const { email, number } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    if (typeof !number === 'number') {
        return res.status(400).json({ error: 'Value is NOT a number' });
    }
    // Отменяем предыдущий запрос, если он существует
    if (currentRequest) {
        currentRequest.cancel();
    }
    const newRequest = createDelayedRequest(res, email, number);
    currentRequest = newRequest;
    setTimeout(() => {
        // Если новый запрос не отменен, отправляем результат
        if (newRequest === currentRequest) {
            newRequest.send();
            currentRequest = null;
        }
    }, 5000);
});
function createDelayedRequest(res, email, number) {
    let canceled = false;
    return {
        send: () => {
            if (!canceled) {
                const searchResult = data.filter((user) => {
                    return user.email === email && (!number || user.number === number);
                });
                res.json(searchResult);
            }
        },
        cancel: () => {
            canceled = true;
        },
    };
}
