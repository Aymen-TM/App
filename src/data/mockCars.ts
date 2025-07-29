export interface Vendor {
  id: string
  name: string
  rating: number
  reviewCount: number
  yearsActive: number
  image: string
  verified: boolean
  speciality: string
}

export interface Car {
  id: number
  marque: string
  modele: string
  annee: number
  prix: number
  location: string
  image: string
  type: string
  options: string[]
  disponible: boolean
  description: string
  puissance: string
  transmission: string
  carburant: string
  places: number
  portes: number
  vendorId: string
}

// Define some vendors
export const vendors: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'Auto Premium',
    rating: 4.9,
    reviewCount: 128,
    yearsActive: 8,
    image: '/images/bmw m5.avif',
    verified: true,
    speciality: 'Voitures de luxe et premium'
  },
  {
    id: 'vendor-2',
    name: 'Eco Location',
    rating: 4.8,
    reviewCount: 95,
    yearsActive: 5,
    image: '/images/bmw m5.avif',
    verified: true,
    speciality: 'Véhicules économiques et écologiques'
  },
  {
    id: 'vendor-3',
    name: 'Family Cars',
    rating: 4.7,
    reviewCount: 112,
    yearsActive: 6,
    image: '/images/bmw m5.avif',
    verified: true,
    speciality: 'Véhicules familiaux spacieux'
  }
]

export const mockCars: Car[] = [
  {
    id: 1,
    marque: 'Renault',
    modele: 'Clio 5',
    annee: 2022,
    prix: 2500,
    location: 'Alger',
    image: '/images/bmw m5.avif',
    type: 'Berline',
    options: ['Climatisation', 'GPS', 'Bluetooth', 'Caméra de recul'],
    disponible: true,
    description: 'Renault Clio 5 en excellent état, tout équipée avec faible kilométrage.',
    puissance: '90ch',
    transmission: 'Manuelle',
    carburant: 'Diesel',
    places: 5,
    portes: 5,
    vendorId: 'vendor-1'
  },
  {
    id: 2,
    marque: 'Dacia',
    modele: 'Duster',
    annee: 2021,
    prix: 3500,
    location: 'Oran',
    image: '/images/bmw m5.avif',
    type: 'SUV',
    options: ['Climatisation', 'GPS', '4x4', 'Toit ouvrant'],
    disponible: true,
    description: 'Dacia Duster 4x4, idéal pour les routes difficiles.',
    puissance: '115ch',
    transmission: 'Manuelle',
    carburant: 'Diesel',
    places: 5,
    portes: 5,
    vendorId: 'vendor-1'
  },
  {
    id: 3,
    marque: 'Peugeot',
    modele: '208',
    annee: 2023,
    prix: 2800,
    location: 'Constantine',
    image: '/images/bmw m5.avif',
    type: 'Berline',
    options: ['Climatisation', 'Boite automatique', 'Bluetooth', 'Caméra de recul'],
    disponible: true,
    description: 'Peugeot 208 récente avec boîte automatique et équipements haut de gamme.',
    puissance: '100ch',
    transmission: 'Automatique',
    carburant: 'Essence',
    places: 5,
    portes: 3,
    vendorId: 'vendor-3'
  },
  {
    id: 4,
    marque: 'Hyundai',
    modele: 'Tucson',
    annee: 2022,
    prix: 4000,
    location: 'Tizi Ouzou',
    image: '/images/bmw m5.avif',
    type: 'SUV',
    options: ['Climatisation', 'GPS', 'Toit ouvrant', 'Cuir', 'Système audio premium'],
    disponible: true,
    description: 'Hyundai Tucson tout équipé avec intérieur cuir et toit panoramique.',
    puissance: '150ch',
    transmission: 'Automatique',
    carburant: 'Essence',
    places: 5,
    portes: 5,
    vendorId: 'vendor-2'
  },
  {
    id: 5,
    marque: 'Renault',
    modele: 'Kangoo',
    annee: 2021,
    prix: 3000,
    location: 'Annaba',
    image: '/images/bmw m5.avif',
    type: 'Utilitaire',
    options: ['Climatisation', 'GPS', 'Sièges bébé'],
    disponible: true,
    description: 'Renault Kangoo idéal pour les familles ou le transport de marchandises.',
    puissance: '90ch',
    transmission: 'Manuelle',
    carburant: 'Diesel',
    places: 5,
    portes: 5,
    vendorId: 'vendor-2'
  },
  {
    id: 6,
    marque: 'Mercedes',
    modele: 'Classe C',
    annee: 2023,
    prix: 6000,
    location: 'Alger',
    image: '/images/bmw m5.avif',
    type: 'Berline',
    options: ['Climatisation', 'GPS', 'Boite automatique', 'Cuir', 'Système audio premium', 'Toit ouvrant'],
    disponible: true,
    description: 'Mercedes Classe C avec intérieur cuir et équipements haut de gamme.',
    puissance: '200ch',
    transmission: 'Automatique',
    carburant: 'Essence',
    places: 5,
    portes: 4,
    vendorId: 'vendor-1'
  },
  {
    id: 7,
    marque: 'Toyota',
    modele: 'RAV4',
    annee: 2022,
    prix: 4500,
    location: 'Oran',
    image: '/images/bmw m5.avif',
    type: 'SUV',
    options: ['Climatisation', 'GPS', '4x4', 'Toit ouvrant', 'Caméra de recul'],
    disponible: true,
    description: 'Toyota RAV4 4x4, fiable et confortable pour tous vos déplacements.',
    puissance: '180ch',
    transmission: 'Automatique',
    carburant: 'Hybride',
    places: 5,
    portes: 5,
    vendorId: 'vendor-2'
  },
  {
    id: 8,
    marque: 'Fiat',
    modele: '500',
    annee: 2023,
    prix: 2200,
    location: 'Constantine',
    image: '/images/bmw m5.avif',
    type: 'Citadine',
    options: ['Climatisation', 'Toit ouvrant', 'Bluetooth'],
    disponible: true,
    description: 'Fiat 500, idéale pour la ville, économique et maniable.',
    puissance: '70ch',
    transmission: 'Manuelle',
    carburant: 'Essence',
    places: 4,
    portes: 3,
    vendorId: 'vendor-3'
  },
  {
    id: 9,
    marque: 'BMW',
    modele: 'Série 3',
    annee: 2022,
    prix: 5500,
    location: 'Alger',
    image: '/images/bmw m5.avif',
    type: 'Berline',
    options: ['Climatisation', 'GPS', 'Boite automatique', 'Cuir', 'Système audio premium'],
    disponible: true,
    description: 'BMW Série 3 avec intérieur cuir et équipements haut de gamme.',
    puissance: '190ch',
    transmission: 'Automatique',
    carburant: 'Diesel',
    places: 5,
    portes: 4,
    vendorId: 'vendor-1'
  },
  {
    id: 10,
    marque: 'Dacia',
    modele: 'Sandero',
    annee: 2023,
    prix: 2300,
    location: 'Tizi Ouzou',
    image: '/images/bmw m5.avif',
    type: 'Citadine',
    options: ['Climatisation', 'GPS', 'Bluetooth'],
    disponible: true,
    description: 'Dacia Sandero, économique et spacieuse pour son segment.',
    puissance: '75ch',
    transmission: 'Manuelle',
    carburant: 'Essence',
    places: 5,
    portes: 5,
    vendorId: 'vendor-2'
  },
  {
    id: 11,
    marque: 'Volkswagen',
    modele: 'Golf 8',
    annee: 2023,
    prix: 3800,
    location: 'Annaba',
    image: '/images/bmw m5.avif',
    type: 'Berline',
    options: ['Climatisation', 'GPS', 'Boite automatique', 'Caméra de recul', 'Toit ouvrant'],
    disponible: true,
    description: 'Volkswagen Golf 8, élégante et technologique.',
    puissance: '150ch',
    transmission: 'Automatique',
    carburant: 'Essence',
    places: 5,
    portes: 5,
    vendorId: 'vendor-2'
  },
  {
    id: 12,
    marque: 'Toyota',
    modele: 'Hilux',
    annee: 2022,
    prix: 5000,
    location: 'Oran',
    image: '/images/bmw m5.avif',
    type: 'Pick-up',
    options: ['Climatisation', 'GPS', '4x4', 'Toit ouvrant'],
    disponible: true,
    description: 'Toyota Hilux, robuste et fiable pour tous les terrains.',
    puissance: '200ch',
    transmission: 'Manuelle',
    carburant: 'Diesel',
    places: 5,
    portes: 4,
    vendorId: 'vendor-3'
  }
]
