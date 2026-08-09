export type BookingRequestModel = {
    id?: number;
    userFullName: string;
    startDate: string | Date;
    endDate: string | Date;
    city: string;
    municipality: string;
    venue: string;
    contactPhone?: string;
    eventDescription?: string;
    status?: string;
    createdAt?: string | Date;
}

export type BookingStatusDayModel = {
    status: string;
    date: string | Date;
}
