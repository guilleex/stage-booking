export type UserBookingModel = {
    startDate: string | Date;
    endDate: string | Date;
    city: string;
    status: string;
    municipality?: string;
    venue: string;
    companyName?: string;
    contactAddress?: string;
    contactPhone?: string;
    eventDescription: string;
};
