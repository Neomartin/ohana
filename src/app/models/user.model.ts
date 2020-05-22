export class UserModel {
    constructor(
        public name: string,
        public surname: string,
        public username: string,
        public password: string,
        public branch?: string,
        public email?: string,
        public phone?: string,
        public role?: string,
        public image?: string,
        public observation?: string,
        public id?: string,
        public _id?: string,
    ) {}
}