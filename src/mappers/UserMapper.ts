import UserDto from "../model/UserDto";
import User from "../model/User";

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

}