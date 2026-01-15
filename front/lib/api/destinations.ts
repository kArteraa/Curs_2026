import { api, ApiResponse } from "../api";
import { Destination, CreateDestinationDto, UpdateDestinationDto } from "../types";

export const destinationsApi = {
  getAll: async (): Promise<Destination[]> => {
    const response = await api.get<ApiResponse<Destination[]>>("/destinations");
    return response.data.data;
  },

  getById: async (id: number): Promise<Destination> => {
    const response = await api.get<ApiResponse<Destination>>(`/destinations/${id}`);
    return response.data.data;
  },

  create: async (data: CreateDestinationDto): Promise<Destination> => {
    const response = await api.post<ApiResponse<Destination>>("/destinations", data);
    return response.data.data;
  },

  update: async (id: number, data: UpdateDestinationDto): Promise<Destination> => {
    const response = await api.put<ApiResponse<Destination>>(`/destinations/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/destinations/${id}`);
  },
};
