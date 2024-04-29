

export interface IAuthLogin  {
    login : string,
    password: string
}


export interface IAuthRegistration  {
    email : string,
    login : string,
    password: string
}

export interface IcreateServerChat {
    uuid_server : string,
    title: string
}