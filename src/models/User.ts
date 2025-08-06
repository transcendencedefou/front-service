export class User {
    id: string
    username: string
    token: string

    public constructor(id: string, username: string, token: string) {
        this.username = username
        this.token = token
        this.id = id
    }
}