import type { Trip, Driver, User } from './adminTypes'

export const TRIPS: Trip[] = [
  { id: 1001, from: 'JFK International Airport',    to: 'Manhattan Midtown',          date: 'Apr 30, 14:30', pax: 2, price: 58,  status: 'confirmed',   driver: 'Marcus V.',   passenger: 'Alice R.',   type: 'airport'   },
  { id: 1002, from: 'Newark Liberty Airport (EWR)', to: 'Brooklyn Heights',           date: 'Apr 30, 17:00', pax: 1, price: 44,  status: 'pending',     driver: '—',           passenger: 'Tom H.',     type: 'airport'   },
  { id: 1003, from: 'Penn Station',                 to: 'LaGuardia Airport (LGA)',    date: 'May 1, 09:00',  pax: 4, price: 72,  status: 'confirmed',   driver: 'Sofia L.',    passenger: 'James K.',   type: 'airport'   },
  { id: 1004, from: 'Grand Central Terminal',       to: 'JFK International Airport',  date: 'May 1, 11:30',  pax: 2, price: 61,  status: 'in_progress', driver: 'Yusuf A.',    passenger: 'Priya N.',   type: 'airport'   },
  { id: 1005, from: 'Manhattan Midtown',            to: 'The Hamptons',               date: 'May 1, 13:00',  pax: 3, price: 195, status: 'confirmed',   driver: 'Elena V.',    passenger: 'Carlos M.',  type: 'intercity' },
  { id: 1006, from: 'Brooklyn Heights',             to: 'Manhattan Financial Dist.',  date: 'Apr 29, 08:00', pax: 1, price: 28,  status: 'completed',   driver: 'Marcus V.',   passenger: 'Sara B.',    type: 'hourly'    },
  { id: 1007, from: 'Upper East Side',              to: 'JFK International Airport',  date: 'Apr 29, 06:30', pax: 2, price: 55,  status: 'completed',   driver: 'Raj P.',      passenger: 'Mike D.',    type: 'airport'   },
  { id: 1008, from: 'JFK International Airport',   to: 'White Plains',               date: 'Apr 28, 20:15', pax: 1, price: 88,  status: 'cancelled',   driver: '—',           passenger: 'Fiona C.',   type: 'intercity' },
  { id: 1009, from: 'Times Square',                to: 'Newark Liberty Airport',     date: 'Apr 28, 05:00', pax: 3, price: 52,  status: 'completed',   driver: 'Sofia L.',    passenger: 'David W.',   type: 'airport'   },
  { id: 1010, from: 'Tribeca',                     to: 'Montauk',                    date: 'Apr 27, 10:00', pax: 4, price: 240, status: 'completed',   driver: 'Elena V.',    passenger: 'Nina S.',    type: 'vip'       },
]

export const DRIVERS: Driver[] = [
  { id: 1, name: 'Marcus V.',  initials: 'MV', email: 'marcus@example.com',  car: 'Mercedes E-Class', year: 2023, rating: 4.9, rides: 1240, earnings: 68200, status: 'active',         joined: 'Jan 2022', city: 'New York'     },
  { id: 2, name: 'Sofia L.',   initials: 'SL', email: 'sofia@example.com',   car: 'BMW 5 Series',     year: 2022, rating: 4.8, rides: 874,  earnings: 47800, status: 'active',         joined: 'Mar 2022', city: 'New York'     },
  { id: 3, name: 'Yusuf A.',   initials: 'YA', email: 'yusuf@example.com',   car: 'Audi A6',          year: 2023, rating: 4.7, rides: 612,  earnings: 33500, status: 'active',         joined: 'Jul 2022', city: 'New York'     },
  { id: 4, name: 'Elena V.',   initials: 'EV', email: 'elena@example.com',   car: 'Tesla Model S',    year: 2023, rating: 4.9, rides: 1580, earnings: 92100, status: 'active',         joined: 'Oct 2021', city: 'New York'     },
  { id: 5, name: 'Raj P.',     initials: 'RP', email: 'raj@example.com',     car: 'Lexus ES',         year: 2022, rating: 4.6, rides: 430,  earnings: 23600, status: 'inactive',       joined: 'Feb 2023', city: 'New Jersey'   },
  { id: 6, name: 'Chen W.',    initials: 'CW', email: 'chen@example.com',    car: 'Mercedes S-Class', year: 2024, rating: 5.0, rides: 88,   earnings: 9800,  status: 'pending_review', joined: 'Apr 2024', city: 'New York'     },
  { id: 7, name: 'Amara O.',   initials: 'AO', email: 'amara@example.com',   car: 'Cadillac CT5',     year: 2022, rating: 4.5, rides: 215,  earnings: 11800, status: 'suspended',      joined: 'Jun 2023', city: 'Queens'       },
  { id: 8, name: 'Natalie K.', initials: 'NK', email: 'nat@example.com',     car: 'Volvo S90',        year: 2023, rating: 4.8, rides: 560,  earnings: 30700, status: 'active',         joined: 'Nov 2022', city: 'Brooklyn'     },
]

export const USERS: User[] = [
  { id: 101, name: 'Alice R.',   initials: 'AR', email: 'alice@example.com',   role: 'passenger', trips: 14, joined: 'Feb 2023', status: 'active',    country: 'USA'     },
  { id: 102, name: 'Tom H.',     initials: 'TH', email: 'tom@example.com',     role: 'passenger', trips: 3,  joined: 'Jan 2024', status: 'active',    country: 'UK'      },
  { id: 103, name: 'James K.',   initials: 'JK', email: 'james@example.com',   role: 'passenger', trips: 27, joined: 'Aug 2022', status: 'active',    country: 'USA'     },
  { id: 104, name: 'Priya N.',   initials: 'PN', email: 'priya@example.com',   role: 'passenger', trips: 8,  joined: 'Mar 2023', status: 'active',    country: 'India'   },
  { id: 105, name: 'Carlos M.',  initials: 'CM', email: 'carlos@example.com',  role: 'passenger', trips: 41, joined: 'May 2022', status: 'active',    country: 'Brazil'  },
  { id: 106, name: 'Sara B.',    initials: 'SB', email: 'sara@example.com',    role: 'passenger', trips: 6,  joined: 'Oct 2023', status: 'suspended', country: 'Germany' },
  { id: 107, name: 'Mike D.',    initials: 'MD', email: 'mike@example.com',    role: 'passenger', trips: 19, joined: 'Dec 2022', status: 'active',    country: 'USA'     },
  { id: 108, name: 'Fiona C.',   initials: 'FC', email: 'fiona@example.com',   role: 'passenger', trips: 2,  joined: 'Apr 2024', status: 'active',    country: 'Ireland' },
  { id: 109, name: 'Nina S.',    initials: 'NS', email: 'nina@example.com',    role: 'passenger', trips: 33, joined: 'Jun 2022', status: 'active',    country: 'France'  },
  { id: 110, name: 'David W.',   initials: 'DW', email: 'david@example.com',   role: 'driver',    trips: 0,  joined: 'Jul 2022', status: 'active',    country: 'USA'     },
]
