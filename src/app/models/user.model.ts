export class UserModel {
    constructor(
        public name: string,
        public surname: string,
        public username: string,
        public password: string,
        public phone?: string,
        public email?: string,
        public role?: string,
        public image?: string,
        public observation?: string,
        public id?: string,
    ) {}
}