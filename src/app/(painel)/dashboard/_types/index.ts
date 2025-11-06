// Tipos compartilhados para o dashboard

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  status: boolean;
}

export interface ServiceWithRelations extends Service {
  userId: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AppointmentService {
  id: string;
  name: string;
  price: number;
  duration: number;
  status?: boolean;
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone?: string;
  appointmentDate: string; // ISO string para compatibilidade com serialização
  time: string;
  serviceId: string;
  userId?: string;
  service: AppointmentService | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Reminder {
  id: string;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface DashboardAppointment {
  id: string;
  name: string;
  email: string;
  phone?: string;
  appointmentDate: string; // ISO string
  time: string;
  serviceId: string;
  userId: string;
  service: AppointmentService | null;
}

