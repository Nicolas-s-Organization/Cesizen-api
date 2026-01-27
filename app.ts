import express from "express";
import { prisma } from './lib/prisma'

async function main() {
    const app = express();
    const port = 3000;

    app.get('/', async (req, res) => {
        const user = await prisma.user.create({
            data: {
                firstname: "Alice",
                lastname: "Dupont",
                birthdate: new Date("1995-06-15"),
                description: "Test user",
                role: "USER",
            },
        });
        console.log('Created user:', user)

        res.send('user created')
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    })
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })