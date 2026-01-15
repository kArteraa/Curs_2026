import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tourPackagesApi } from "../api/tour-packages";
import { CreateTourPackageDto, UpdateTourPackageDto } from "../types";

export const useTourPackages = () => {
  return useQuery({
    queryKey: ["tour-packages"],
    queryFn: tourPackagesApi.getAll,
  });
};

export const useTourPackage = (id: number) => {
  return useQuery({
    queryKey: ["tour-packages", id],
    queryFn: () => tourPackagesApi.getById(id),
    enabled: !!id,
  });
};

export const useTourPackagesByDestinationType = (destinationTypeId: number) => {
  return useQuery({
    queryKey: ["tour-packages", "destination-type", destinationTypeId],
    queryFn: () => tourPackagesApi.getByDestinationType(destinationTypeId),
    enabled: !!destinationTypeId,
  });
};

export const useAveragePriceByDestinationType = (destinationTypeId: number) => {
  return useQuery({
    queryKey: ["tour-packages", "average-price", destinationTypeId],
    queryFn: () => tourPackagesApi.getAveragePrice(destinationTypeId),
    enabled: !!destinationTypeId,
  });
};

export const useCreateTourPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTourPackageDto) => tourPackagesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tour-packages"] });
    },
  });
};

export const useUpdateTourPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTourPackageDto }) =>
      tourPackagesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tour-packages"] });
      queryClient.invalidateQueries({ queryKey: ["tour-packages", variables.id] });
    },
  });
};

export const useDeleteTourPackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tourPackagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tour-packages"] });
    },
  });
};
