'use client';

import { Card } from '@mui/material';
import RecentOrdersTable from './DriversInProgressTable';
import {
  AppointmentStatus,
  AppointmentView
} from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentsContext';

export default function RecentOrders() {
  const { appointments } = useAppointments();
  const { user } = useAuth()
  
  // Show only claimed routes for this user
  // Don't show completed routes
  let filteredApts: AppointmentView[]
  filteredApts = appointments
                    .filter( appointment => user.id == appointment.driver)
                    .filter( appointment => appointment.status != AppointmentStatus.COMPLETED)

  return (
    <Card>
      <RecentOrdersTable appointments={filteredApts} />
    </Card>
  );
}
