export interface TransportConfig {
    host: string
    port: number
    auth: {
        user: string
        pass: string
    }
}

export interface IEmail {
    firstName: string
    lastName: string
    email: string
    token: string
}