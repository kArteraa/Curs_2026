// Типы для Destination
export interface Destination {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDestinationDto {
  name: string;
  description?: string;
}

export interface UpdateDestinationDto {
  name?: string;
  description?: string;
}

// Типы для TourPackage
export interface TourPackage {
  id: number;
  destination: string;
  startDate: string;
  duration: number;
  price: number;
  transport: string;
  accommodation: string;
  destinationTypeId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTourPackageDto {
  destination: string;
  startDate: string;
  duration: number;
  price: number;
  transport?: string;
  accommodation?: string;
  destinationTypeId: number;
}

export interface UpdateTourPackageDto {
  destination?: string;
  startDate?: string;
  duration?: number;
  price?: number;
  transport?: string;
  accommodation?: string;
  destinationTypeId?: number;
}

export interface AveragePriceResponse {
  destinationTypeId: number;
  averagePrice: number;
}
