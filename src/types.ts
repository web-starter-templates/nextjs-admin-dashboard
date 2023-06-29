export enum UserRoles {
    USER = "user",
    ADMIN = "admin"
}

export enum DatabaseUrls {
    USERS = `users`,
}

export type User = {
    id: string
    firstName: string
    lastName: string
    email: string
    roles: UserRoles[]
}