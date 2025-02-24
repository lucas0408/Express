export interface IUser {
    id: string,
    name: string,
    age: number
}

export interface IError {
    message: string
}

export type ICreateUserDTO = Omit<IUser, "id">
