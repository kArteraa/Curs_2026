"use client";

import { useState } from "react";
import {
  useTourPackages,
  useDeleteTourPackage,
  useTourPackagesByDestinationType,
  useAveragePriceByDestinationType,
} from "@/lib/hooks/use-tour-packages";
import { useDestinations } from "@/lib/hooks/use-destinations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTourPackage, useUpdateTourPackage } from "@/lib/hooks/use-tour-packages";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Loader2, Filter, X } from "lucide-react";
import Link from "next/link";
import type {
  TourPackage,
  CreateTourPackageDto,
  UpdateTourPackageDto,
} from "@/lib/types";

export default function TourPackagesPage() {
  const { data: tourPackages, isLoading, error } = useTourPackages();
  const { data: destinations } = useDestinations();
  const createMutation = useCreateTourPackage();
  const updateMutation = useUpdateTourPackage();
  const deleteMutation = useDeleteTourPackage();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [filterDestinationTypeId, setFilterDestinationTypeId] = useState<number | null>(null);
  const [showAveragePrice, setShowAveragePrice] = useState<number | null>(null);

  const { data: filteredPackages } = useTourPackagesByDestinationType(
    filterDestinationTypeId || 0
  );
  const { data: averagePrice } = useAveragePriceByDestinationType(
    showAveragePrice || 0
  );

  const [formData, setFormData] = useState<CreateTourPackageDto>({
    destination: "",
    startDate: "",
    duration: 0,
    price: 0,
    transport: "",
    accommodation: "",
    destinationTypeId: 0,
  });

  const displayPackages = filterDestinationTypeId
    ? filteredPackages || []
    : tourPackages || [];

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(formData);
      toast({
        title: "Успешно",
        description: "Путевка успешно создана",
      });
      setIsCreateOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать путевку",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingPackage) return;
    try {
      await updateMutation.mutateAsync({
        id: editingPackage.id,
        data: formData as UpdateTourPackageDto,
      });
      toast({
        title: "Успешно",
        description: "Путевка успешно обновлена",
      });
      setEditingPackage(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить путевку",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту путевку?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Успешно",
        description: "Путевка успешно удалена",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить путевку",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (tourPackage: TourPackage) => {
    setEditingPackage(tourPackage);
    setFormData({
      destination: tourPackage.destination,
      startDate: tourPackage.startDate,
      duration: tourPackage.duration,
      price: tourPackage.price,
      transport: tourPackage.transport,
      accommodation: tourPackage.accommodation,
      destinationTypeId: tourPackage.destinationTypeId,
    });
  };

  const resetForm = () => {
    setFormData({
      destination: "",
      startDate: "",
      duration: 0,
      price: 0,
      transport: "",
      accommodation: "",
      destinationTypeId: 0,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Ошибка загрузки путевок</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-2">← Назад</Button>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Туристические путевки</h1>
          <Dialog 
            open={isCreateOpen} 
            onOpenChange={(open) => {
              setIsCreateOpen(open);
              if (!open) {
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Создать путевку
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Создать новую путевку</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="destination">Направление *</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) =>
                      setFormData({ ...formData, destination: e.target.value })
                    }
                    placeholder="Например: Сочи"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Дата начала *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Длительность (дней) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Цена (₽) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="transport">Транспорт</Label>
                  <Input
                    id="transport"
                    value={formData.transport}
                    onChange={(e) =>
                      setFormData({ ...formData, transport: e.target.value })
                    }
                    placeholder="Например: Самолет"
                  />
                </div>
                <div>
                  <Label htmlFor="accommodation">Проживание</Label>
                  <Input
                    id="accommodation"
                    value={formData.accommodation}
                    onChange={(e) =>
                      setFormData({ ...formData, accommodation: e.target.value })
                    }
                    placeholder="Например: Отель 4*"
                  />
                </div>
                <div>
                  <Label htmlFor="destinationTypeId">Тип направления *</Label>
                  {destinations && destinations.length > 0 ? (
                    <Select
                      value={formData.destinationTypeId > 0 ? formData.destinationTypeId.toString() : undefined}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          destinationTypeId: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип направления" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((dest) => (
                          <SelectItem key={dest.id} value={dest.id.toString()}>
                            {dest.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                      Нет доступных направлений
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={
                    !formData.destination ||
                    !formData.startDate ||
                    !formData.duration ||
                    !formData.price ||
                    !formData.destinationTypeId ||
                    createMutation.isPending
                  }
                  className="w-full"
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Создать
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Фильтры */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Фильтры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="filter-destination-type">Фильтр по типу направления</Label>
              <Select
                value={filterDestinationTypeId?.toString() || "all"}
                onValueChange={(value) =>
                  setFilterDestinationTypeId(value === "all" ? null : parseInt(value))
                }
              >
                <SelectTrigger id="filter-destination-type">
                  <SelectValue placeholder="Все направления" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все направления</SelectItem>
                  {destinations && destinations.length > 0 && destinations.map((dest) => (
                    <SelectItem key={dest.id} value={dest.id.toString()}>
                      {dest.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {filterDestinationTypeId && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAveragePrice(filterDestinationTypeId);
                  }}
                >
                  Средняя цена
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFilterDestinationTypeId(null);
                    setShowAveragePrice(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          {averagePrice && showAveragePrice && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <p className="font-semibold">
                Средняя цена для выбранного типа направления:{" "}
                {formatPrice(averagePrice.averagePrice)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Диалог редактирования */}
      <Dialog
        open={!!editingPackage}
        onOpenChange={(open) => !open && setEditingPackage(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать путевку</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-destination">Направление *</Label>
              <Input
                id="edit-destination"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder="Например: Сочи"
              />
            </div>
            <div>
              <Label htmlFor="edit-startDate">Дата начала *</Label>
              <Input
                id="edit-startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-duration">Длительность (дней) *</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Цена (₽) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-transport">Транспорт</Label>
              <Input
                id="edit-transport"
                value={formData.transport}
                onChange={(e) =>
                  setFormData({ ...formData, transport: e.target.value })
                }
                placeholder="Например: Самолет"
              />
            </div>
            <div>
              <Label htmlFor="edit-accommodation">Проживание</Label>
              <Input
                id="edit-accommodation"
                value={formData.accommodation}
                onChange={(e) =>
                  setFormData({ ...formData, accommodation: e.target.value })
                }
                placeholder="Например: Отель 4*"
              />
            </div>
            <div>
              <Label htmlFor="edit-destinationTypeId">Тип направления *</Label>
              {destinations && destinations.length > 0 ? (
                <Select
                  value={formData.destinationTypeId > 0 ? formData.destinationTypeId.toString() : undefined}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      destinationTypeId: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger id="edit-destinationTypeId">
                    <SelectValue placeholder="Выберите тип направления" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => (
                      <SelectItem key={dest.id} value={dest.id.toString()}>
                        {dest.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                  Нет доступных направлений
                </div>
              )}
            </div>
            <Button
              onClick={handleUpdate}
              disabled={
                !formData.destination ||
                !formData.startDate ||
                !formData.duration ||
                !formData.price ||
                !formData.destinationTypeId ||
                updateMutation.isPending
              }
              className="w-full"
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Список путевок */}
      {displayPackages.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Путевки не найдены</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayPackages.map((tourPackage) => (
            <Card key={tourPackage.id}>
              <CardHeader>
                <CardTitle>{tourPackage.destination}</CardTitle>
                <CardDescription>
                  {formatDate(tourPackage.startDate)} • {tourPackage.duration} дней
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Цена:</span>
                    <span className="font-semibold">{formatPrice(tourPackage.price)}</span>
                  </div>
                  {tourPackage.transport && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Транспорт:</span>
                      <span className="text-sm">{tourPackage.transport}</span>
                    </div>
                  )}
                  {tourPackage.accommodation && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Проживание:</span>
                      <span className="text-sm">{tourPackage.accommodation}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(tourPackage)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(tourPackage.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
