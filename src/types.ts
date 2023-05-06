export enum UserRoles {
    DRIVER = "driver",
    CLEANER = "cleaner",
    ADMIN = "admin"
}

export interface AppointmentView {
    appointmentId: string,
    date: string;
    type?: RouteType;
    address: string;
    customer: string;
    distance: number;
    driver?: string;
    basePay: number;
    customerPhoneNumber: string;
    status: AppointmentStatus;
    cleaningAddress: string
  }

export type Appointment = {
    appointmentId: string
    serviceDate: string
    customerName: string
    completeAddress: string
    customerPhone: string
    distance: number
    basePay: number
    cleaner: string
    pickupDriver: string
    dropoffDriver: string
    status: AppointmentStatus
    cleaningAddress: string
}

export enum AppointmentStatus {
    PICKUP = "Pickup",
    DROPOFF = "Dropoff",
    COMPLETED = "Completed",
}

export enum DatabaseUrls {
    APPOINTMENTS = "appointments",
    USERS = `users`,
}

export type CronJobItem = {
    status: CronjobStatus,
    userId: string
    amount: number
}

export enum CronjobType {
    EXECUTE_ORDERS = "execute_orders",
    SCHEDULE_DEPOSITS = "schedule_deposits",
    EXECUTE_DEPOSITS = "execute_deposits"
}

export enum CronjobStatus {
    ACCEPTED = "ACCEPTED",
    FINISHED = "FINISHED",
    FAILED = "FAILED",
}


export type User = {
    id: string
    firstName: string
    lastName: string
    email: string
    roles: UserRoles[]
}

  
export enum RouteType {
    PICKUP = "Pickup",
    DROPOFF = "Dropoff"
  }