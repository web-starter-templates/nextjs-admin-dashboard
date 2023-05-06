'use client';

import { Card } from '@mui/material';
import DriverHistoryTable from './DriverHistoryTable';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { AppointmentStatus, AppointmentView } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function DriverHistory() {
  const { appointments } = useAppointments();
  const { user } = useAuth()
  
  // Show only completed routes 
  // For this driver
  let filteredApts: AppointmentView[]
  filteredApts = appointments
                  .filter( appointment => user.id == appointment.driver)
                  .filter((item) => item.status == AppointmentStatus.COMPLETED);

  return (
    <Card>
      <DriverHistoryTable appointments={filteredApts} />
    </Card>
  );
}