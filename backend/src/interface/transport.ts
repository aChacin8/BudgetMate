export interface TransportConfig {
    host: string
    port: number
    auth: {
        user: string
        pass: string
    }
}