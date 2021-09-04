export class User {
    id : number;
    username: string;
    password: string;
    fullName: string;
    roles: string[];
    email: string;
    token: string;

    constructor(id: number, username: string, password: string, fullName: string, roles: string[], email: string, token: string) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.roles = roles;
        this.email = email;
        this.token = token;
    }
}
