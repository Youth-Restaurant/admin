'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';

interface ReservationData {
  guestName: string;
  reservationDate: string;
  numberOfGuests: number;
  tableNumbers: number[];
  menuOption: string;
  drinks: string[];
  specialRequests?: string;
}

export async function createReservation(data: ReservationData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const reservation = await prisma.reservation.create({
    data: {
      guest: {
        create: {
          name: data.guestName,
          lastBookingDate: new Date(data.reservationDate),
        },
      },
      reservationDate: new Date(data.reservationDate),
      numberOfGuests: data.numberOfGuests,
      tables: {
        create: data.tableNumbers.map((tableNumber) => ({
          table: {
            connect: {
              tableNumber,
            },
          },
          seatsUsed: 1,
        })),
      },
      createdBy: {
        connect: {
          id: session.user.id as string,
        },
      },
    },
  });

  return reservation;
}
