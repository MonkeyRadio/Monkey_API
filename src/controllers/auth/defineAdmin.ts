import { default as userM, User } from '../../controllers/auth/models/user.js';

export default async (): Promise<void> => {
    let admin = await userM.findOne({ uid: 'admin' });
    if (!admin) {
        let password = "";
        for (let i = 0; i < 3; i++) {
            password += (Math.random() + 1).toString(36).substring(2);
        }
        await userM.create({
            uid: 'admin',
            name: 'admin',
            icon: 'admin',
            email: 'admin@admin.com',
            password: password,
            permissions: ['admin']
        });
        console.log(`New Admin Created with password : ${password}`);
    }
}