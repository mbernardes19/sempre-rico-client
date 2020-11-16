export default class User {
    private id: number;
    private fullName: string;
    private phoneNumber: string;
    private email: string;
    private paymentMethod: string;
    private subscriptionStatus: string;
    private banNotices: number;

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
    setPaymentMethod(paymentMethod: string): void {
        this.paymentMethod = paymentMethod
    }
    setSubscriptionStatus(subscriptionStatus: string): void {
        this.subscriptionStatus = subscriptionStatus
    }
    setBanNotices(banNotices: number): void {
        this.banNotices = banNotices
    }
}