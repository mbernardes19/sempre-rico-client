import { RowDataPacket } from "mysql2";

export default interface UserDto extends RowDataPacket {
    id: number,
    nome_completo: string,
    telefone: string,
    email: string,
    forma_de_pagamento: string,
    status_assinatura: string,
    aviso_banimento: number
}

export interface UserIdDto extends RowDataPacket {
    id: number
}