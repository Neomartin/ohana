export class Branch {
    constructor(
        public name: String,
        public phone: String,
        public adress: String,
        public adress_number: Number,
        public active: Boolean,
        public location?: String,
        public email?: String,
        public obs?: String,
        public _id?: String
    ) {}
}
