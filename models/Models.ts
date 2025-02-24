interface IUser {
    id: string,
    name: string,
    age: number
}

interface IError {
    message: string
}

type ICreateUserDTO = Omit<IUser, "id">
