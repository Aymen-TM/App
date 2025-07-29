export interface Vendor {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  yearsActive: number;
  image: string;
  verified: boolean;
  speciality: string;
}

export interface Cars {
  id: number;
  marque: string;
  modele: string;
  annee: number;
  prix: number;
  location: string;
  image: string;
  type: string;
  options: string[];
  disponible: boolean;
  description: string;
  puissance: string;
  transmission: string;
  carburant: string;
  places: number;
  portes: number;
  vendorId: string;
} 