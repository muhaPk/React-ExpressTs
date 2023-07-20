import express, {Express, Request, Response} from 'express';

const PORT = process.env.POST || 3001
const app: Express = express()

app.use(express.json())

app.listen(PORT, () => {
    console.log('server started', PORT)
})


const data = require('./data.json')

interface User {
    email: string;
    number: number;
}

let currentRequest: any = null;

app.post('/search', (req: Request, res: Response) => {

    const {email, number} = req.body

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

})




function createDelayedRequest(res: Response, email: string, number: number) {
    let canceled = false;

    return {
        send: () => {
            if (!canceled) {

                const searchResult = data.filter((user: User) => {
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


