import { RowDataPacket } from "mysql2";

export default interface FreeUserDto extends RowDataPacket {
    id: number,
    nome_completo: string,
    cpf: string,
    telefone: string,
    email: string,
    data_de_assinatura: string,
    dias_de_uso: number,
    kickado: string
}

export interface FreeUserIdDto extends RowDataPacket {
    id: number
}