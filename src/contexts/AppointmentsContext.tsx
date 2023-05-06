import { createContext, useContext, useEffect, useState } from 'react';

import { Appointment, AppointmentStatus, AppointmentView, RouteType } from '@/types';
import { useAuth } from './AuthContext';
import { addHoursToDate } from '@/helpers/date-utils';

type AppointmentsContextType = {
  appointments: AppointmentView[];
  updateAppointments
};

export const AppointmentsContext = createContext<AppointmentsContextType>(
  {} as AppointmentsContextType
);

export function AppointmentsContextProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const { user, token } = useAuth();

  const updateAppointments = (updatedAppointment: AppointmentView) => {
      const aptIndex = appointments.findIndex( (oldAppointment: AppointmentView) => updatedAppointment.appointmentId == oldAppointment.appointmentId && updatedAppointment.type == oldAppointment.type )
      const newAppointments = [...appointments]
      newAppointments[aptIndex] = updatedAppointment
      setAppointments(newAppointments)
  }

  // Fetch && Transform Appointments
  useEffect(() => {
    const fetchData = async () => {
      if (user && token) {
        const appointmentsRaw = await fetch(
          'http://localhost:8081/api/appointments',
          {
            headers: new Headers({
              Authorization: `Bearer ${token}`
            })
          }
        );

        if (!appointmentsRaw.ok) {
          throw new Error('Something went wrong');
        }

        let backendData: { rows: Appointment[] } = await appointmentsRaw.json();
        let frontendData: AppointmentView[] = [];

        // Transform from backend object to shared route object
        backendData.rows.forEach((appointment: Appointment) => {
          
          // Add two routes, pickup and dropoff, for each appointment
          // ADD PICKUP ROUTE
          frontendData.push({
            appointmentId: appointment.appointmentId,
            customer: appointment.customerName,
            address: appointment.completeAddress,
            customerPhoneNumber: appointment.customerPhone,
            distance: appointment.distance,
            basePay: appointment.basePay,
            status:
              appointment.status == AppointmentStatus.DROPOFF
                ? AppointmentStatus.COMPLETED
                : appointment.status,

            // Different for pickup&dropoff
            type: RouteType.PICKUP,
            date: appointment.serviceDate,
            driver: appointment.pickupDriver,
            cleaningAddress: appointment.cleaningAddress
          });

          // ADD DROPOFF ROUTE
          frontendData.push({
            appointmentId: appointment.appointmentId,
            customer: appointment.customerName,
            address: appointment.completeAddress,
            customerPhoneNumber: appointment.customerPhone,
            distance: appointment.distance,
            basePay: appointment.basePay,
            status:
              appointment.status == AppointmentStatus.COMPLETED
                ? AppointmentStatus.COMPLETED
                : appointment.status,

            // Different for pickup&dropoff
            type: RouteType.DROPOFF,
            date: addHoursToDate(appointment.serviceDate, 44),
            driver: appointment.dropoffDriver,
            cleaningAddress: appointment.cleaningAddress
          });
        });

        setAppointments(frontendData);
      }
    };
    fetchData();
  }, [user, token]);

  return (
    <AppointmentsContext.Provider value={{ appointments, updateAppointments }}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export const useAppointments = () => useContext(AppointmentsContext);
