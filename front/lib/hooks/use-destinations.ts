import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { destinationsApi } from "../api/destinations";
import { CreateDestinationDto, UpdateDestinationDto } from "../types";

export const useDestinations = () => {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: destinationsApi.getAll,
  });
};

export const useDestination = (id: number) => {
  return useQuery({
    queryKey: ["destinations", id],
    queryFn: () => destinationsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDestinationDto) => destinationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
    },
  });
};

export const useUpdateDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDestinationDto }) =>
      destinationsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      queryClient.invalidateQueries({ queryKey: ["destinations", variables.id] });
    },
  });
};

export const useDeleteDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => destinationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
    },
  });
};
