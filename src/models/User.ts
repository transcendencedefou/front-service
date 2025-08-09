export class User {
    id: string
    username: string
    token: string
    twoFactorEnabled?: boolean

    public constructor(
        id: string,
        username: string,
        token: string,
        twoFactorEnabled?: boolean
    ) {
        this.username = username
        this.token = token
        this.id = id
        this.twoFactorEnabled = twoFactorEnabled
    }
}
