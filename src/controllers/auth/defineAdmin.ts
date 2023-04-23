import { default as userM, User } from '../../controllers/auth/models/user.js';
import { promises } from 'fs';

export default async (): Promise<void> => {
    if (!process.env.JWT) {
        let tok = "";
        for (let i = 0; i < 15; i++) {
            tok += (Math.random() + 1).toString(36).substring(2);
        }
        console.log(`Generating new JWT sign token\nAdding it to .env file`);
        await promises.appendFile('.env', `JWT=${tok}\n`);
        process.env.JWT = tok;
    }
    let admin = await userM.findOne({ slug: 'admin' });
    if (!admin) {
        let password = "";
        for (let i = 0; i < 3; i++) {
            password += (Math.random() + 1).toString(36).substring(2);
        }
        await userM.create({
            slug: 'admin',
            name: 'admin',
            icon: 'admin',
            email: 'admin@admin.com',
            password: password,
            permissions: ['admin']
        });
        console.log(`New Admin Created with password : ${password}`);
    }
}
