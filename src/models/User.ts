export class User {
     username: string
     token: string

    public constructor(username: string, token: string) {
        this.username = username
        this.token = token
    }
}