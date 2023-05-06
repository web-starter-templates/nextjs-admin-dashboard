'use client';

import { Card } from '@mui/material';
import AvailableRoutesTable from './AvailableRoutesTable';
import { useAppointments } from '@/contexts/AppointmentsContext';
import { AppointmentStatus, AppointmentView } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function AvailableRoutes() {
  const { appointments } = useAppointments();
  const { user } = useAuth()
  if (!user) return <></>

  // Remove any claimed routes
  // Only non-successful
  let filteredApts: AppointmentView[]
  filteredApts = appointments
                  .filter( appointment => !appointment.driver)
                  .filter((item) => item.status != AppointmentStatus.COMPLETED);

  return (
    <Card>
      <AvailableRoutesTable appointments={filteredApts} />
    </Card>
  );
}