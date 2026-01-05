export declare class CreateBookingDto {
    serviceId: string;
    serviceName: string;
    address: string;
    scheduledTime: string;
    totalAmount: number;
    addOns?: Array<{
        id: number;
        name: string;
        price: number;
    }>;
}
