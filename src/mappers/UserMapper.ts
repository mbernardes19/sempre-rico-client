import UserDto from "../model/UserDto";
import User from "../model/User";
import FreeUserDto from "../model/FreeUserDto";
import FreeUser from "../model/FreeUser";

export default class UserMapper {
    static toUser(userDto: UserDto): User {
        const user = new User()
        user.setBanNotices(userDto.aviso_banimento)
        user.setEmail(userDto.email)
        user.setFullName(userDto.nome_completo)
        user.setId(userDto.id)
        user.setPaymentMethod(userDto.forma_de_pagamento)
        user.setPhoneNumber(userDto.telefone)
        user.setSubscriptionStatus(userDto.status_assinatura)
        return user;
    }

    static toFreeUser(freeUserDto: FreeUserDto): FreeUser {
        const freeUser = new FreeUser();
        freeUser.setCpf(freeUserDto.cpf)
        freeUser.setEmail(freeUserDto.email)
        freeUser.setFullName(freeUserDto.nome_completo)
        freeUser.setId(freeUserDto.id)
        freeUser.setPhoneNumber(freeUserDto.telefone)
        freeUser.setSubscriptionDate(this.toDate(freeUserDto.data_de_assinatura))
        freeUser.setUsageDaysLeft(freeUserDto.dias_de_uso)
        freeUser.setisKicked(freeUserDto.kickado === 'S' ? true : false )
        return freeUser;
    }

    private static toDate(dateString: string) {
        const ano = parseInt(dateString.substring(0,4), 10)
        const mes = parseInt(dateString.substring(5,7),10)
        const dia = parseInt(dateString.substring(8,10),10)
        return new Date(ano, mes-1, dia)
    }
}