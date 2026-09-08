export type Page = 'home' | 'destinations' | 'stays' | 'experiences' | 'offers' | 'journey';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'LKR' | 'SGD' | 'AUD' | 'JPY';

export interface BookingState {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  selectedRoom: string;
  experiences: string[];
  selectedOffer: string;
  step: number;
  confirmed: boolean;
  confirmationNumber: string;
  totalPrice: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: 'asia' | 'europe' | 'middle-east' | 'africa' | 'americas';
  filterTypes: Array<'beach' | 'city' | 'mountain' | 'island' | 'cultural' | 'wellness'>;
  /** @deprecated use filterTypes */
  type: 'beach' | 'city' | 'mountain' | 'island' | 'cultural' | 'wellness';
  image: string;
  stayCount: number;
  signature: string;
  description: string;
  climate: string;
  bestTime: string;
  lat: number;
  lng: number;
  /** Legacy coord string kept for drawer display */
  coords: string;
  propertyName: string;
  priceFromUSD: number;
}

export interface Property {
  id: string;
  name: string;
  destination: string;
  destinationId?: string;
  image: string;
  rating: number;
  priceFrom: number;
  signature: string;
  description: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  name: string;
  category: string;
  size: number;
  guests: number;
  view: string;
  bed: string;
  pricePerNight: number;
  image: string;
  description: string;
  amenities: string[];
  hasPool: boolean;
  hasButler: boolean;
  hasBreakfast: boolean;
  matchScore?: number;
}

export interface Experience {
  id: string;
  name: string;
  category: 'dine' | 'rest' | 'move' | 'explore' | 'celebrate';
  duration: string;
  price: number;
  location: string;
  image: string;
  description: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  inclusions: string[];
  terms: string;
  image: string;
  nights: number;
  savings: string;
}
