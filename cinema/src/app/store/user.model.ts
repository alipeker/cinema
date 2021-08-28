export class User {
    id : number = 0;
    username: string = "";
    password: string = "";
    fullName: string = "";
    role: string = "";

    constructor(id: number, username: string, password: string, fullName: string, role: string) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
    }
}
