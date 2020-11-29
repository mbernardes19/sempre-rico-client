export default class FreeUser {
    private id: number;
    private fullName: string;
    private cpf: string;
    private phoneNumber: string;
    private email: string;
    private subscriptionDate: Date;
    private usageDaysLeft: number;
    private isKicked: boolean;

    setId(id: number): void {
        this.id = id
    }
    setFullName(fullName: string): void {
        this.fullName = fullName
    }
    setPhoneNumber(phoneNumber: string): void {
        this.phoneNumber = phoneNumber
    }
    setEmail(email: string): void {
        this.email = email
    }
    setCpf(cpf: string): void {
        this.cpf = cpf;
    }
    setUsageDaysLeft(usageDaysLeft: number): void {
        this.usageDaysLeft = usageDaysLeft
    }
    setSubscriptionDate(subscriptionDate: Date): void {
        this.subscriptionDate = subscriptionDate;
    }
    setisKicked(isKicked: boolean): void {
        this.isKicked = isKicked
    }
}