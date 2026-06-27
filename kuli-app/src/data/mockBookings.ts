export type BookingStatus = 'completed' | 'upcoming' | 'cancelled';

export interface Booking {
  id: string;
  workerId: string;
  workerName: string;
  workerImage: string;
  service: string;
  date: string;           // ISO date string
  time: string;           // display string e.g. "10:00 AM"
  status: BookingStatus;
  amount: number;          // in ₹
  address: string;
  rating?: number;         // only for completed bookings
  review?: string;         // optional review text
}

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    workerId: 'w3',
    workerName: 'Suresh Sharma',
    workerImage: 'https://randomuser.me/api/portraits/men/68.jpg',
    service: 'Electrical – Full House Wiring',
    date: '2026-05-28',
    time: '9:00 AM',
    status: 'completed',
    amount: 8500,
    address: '302, Shilp Centrium, SG Highway, Ahmedabad 380054',
    rating: 5,
    review: 'Excellent work! Suresh rewired the entire flat in two days. Very neat wiring and explained everything about the MCB panel. Highly recommended.',
  },
  {
    id: 'b2',
    workerId: 'w1',
    workerName: 'Rajesh Kumar',
    workerImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    service: 'Painting – 2 BHK Interior',
    date: '2026-06-10',
    time: '8:30 AM',
    status: 'upcoming',
    amount: 12000,
    address: '15, Pramukh Residency, Satellite Road, Ahmedabad 380015',
  },
  {
    id: 'b3',
    workerId: 'w9',
    workerName: 'Lakshmi Bai',
    workerImage: 'https://randomuser.me/api/portraits/women/65.jpg',
    service: 'Deep Cleaning – 3 BHK Flat',
    date: '2026-05-20',
    time: '10:00 AM',
    status: 'completed',
    amount: 3500,
    address: '801, Swaminarayan City, Bopal, Ahmedabad 380058',
    rating: 4,
    review: 'Good cleaning overall. Bathrooms and kitchen were sparkling. Missed a few spots behind the sofa but came back and fixed it.',
  },
  {
    id: 'b4',
    workerId: 'w6',
    workerName: 'Vikram Singh',
    workerImage: 'https://randomuser.me/api/portraits/men/56.jpg',
    service: 'AC Service – Split AC Gas Refill',
    date: '2026-06-01',
    time: '2:00 PM',
    status: 'cancelled',
    amount: 2800,
    address: '12-B, Navrangpura Society, Navrangpura, Ahmedabad 380009',
  },
  {
    id: 'b5',
    workerId: 'w4',
    workerName: 'Dinesh Joshi',
    workerImage: 'https://randomuser.me/api/portraits/men/22.jpg',
    service: 'Carpentry – Modular Kitchen Installation',
    date: '2026-06-15',
    time: '9:00 AM',
    status: 'upcoming',
    amount: 45000,
    address: '205, Orchid Greens, Thaltej, Ahmedabad 380059',
  },
];
