export class User {
    id: string
    username: string
    token: string
    twoFactorEnabled?: boolean
    avatar?: string | null
    banner?: string | null

    public constructor(
        id: string,
        username: string,
        token: string,
        twoFactorEnabled?: boolean,
        avatar?: string | null,
        banner?: string | null
    ) {
        this.username = username
        this.token = token
        this.id = id
        this.twoFactorEnabled = twoFactorEnabled
        this.avatar = avatar ?? null
        this.banner = banner ?? null
    }
}