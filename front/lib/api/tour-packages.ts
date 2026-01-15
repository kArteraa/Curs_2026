import { api, ApiResponse } from "../api";
import {
  TourPackage,
  CreateTourPackageDto,
  UpdateTourPackageDto,
  AveragePriceResponse,
} from "../types";

export const tourPackagesApi = {
  getAll: async (): Promise<TourPackage[]> => {
    const response = await api.get<ApiResponse<TourPackage[]>>("/tour-packages");
    return response.data.data;
  },

  getById: async (id: number): Promise<TourPackage> => {
    const response = await api.get<ApiResponse<TourPackage>>(`/tour-packages/${id}`);
    return response.data.data;
  },

  getByDestinationType: async (destinationTypeId: number): Promise<TourPackage[]> => {
    const response = await api.get<ApiResponse<TourPackage[]>>(
      `/tour-packages/destination-type/${destinationTypeId}`
    );
    return response.data.data;
  },

  getAveragePrice: async (destinationTypeId: number): Promise<AveragePriceResponse> => {
    const response = await api.get<ApiResponse<AveragePriceResponse>>(
      `/tour-packages/destination-type/${destinationTypeId}/average-price`
    );
    return response.data.data;
  },

  create: async (data: CreateTourPackageDto): Promise<TourPackage> => {
    const response = await api.post<ApiResponse<TourPackage>>("/tour-packages", data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateTourPackageDto): Promise<TourPackage> => {
    const response = await api.put<ApiResponse<TourPackage>>(`/tour-packages/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tour-packages/${id}`);
  },
};
