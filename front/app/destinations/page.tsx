"use client";

import { useState } from "react";
import { useDestinations, useDeleteDestination } from "@/lib/hooks/use-destinations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateDestination, useUpdateDestination } from "@/lib/hooks/use-destinations";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Destination, CreateDestinationDto, UpdateDestinationDto } from "@/lib/types";

export default function DestinationsPage() {
  const { data: destinations, isLoading, error } = useDestinations();
  const createMutation = useCreateDestination();
  const updateMutation = useUpdateDestination();
  const deleteMutation = useDeleteDestination();
  const { toast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [formData, setFormData] = useState<CreateDestinationDto>({ name: "", description: "" });

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(formData);
      toast({
        title: "Успешно",
        description: "Направление успешно создано",
      });
      setIsCreateOpen(false);
      setFormData({ name: "", description: "" });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать направление",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingDestination) return;
    try {
      await updateMutation.mutateAsync({
        id: editingDestination.id,
        data: formData as UpdateDestinationDto,
      });
      toast({
        title: "Успешно",
        description: "Направление успешно обновлено",
      });
      setEditingDestination(null);
      setFormData({ name: "", description: "" });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить направление",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить это направление?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Успешно",
        description: "Направление успешно удалено",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить направление",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (destination: Destination) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name,
      description: destination.description || "",
    });
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
            <p className="text-destructive">Ошибка загрузки направлений</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/">
            <Button variant="ghost" className="mb-2">← Назад</Button>
          </Link>
          <h1 className="text-3xl font-bold">Направления</h1>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Создать направление
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новое направление</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Название *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Например: Пляжный отдых"
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Описание направления"
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={!formData.name || createMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Создать
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingDestination} onOpenChange={(open) => !open && setEditingDestination(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать направление</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Название *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Пляжный отдых"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Описание</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание направления"
              />
            </div>
            <Button
              onClick={handleUpdate}
              disabled={!formData.name || updateMutation.isPending}
              className="w-full"
            >
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {destinations && destinations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Направления не найдены</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {destinations?.map((destination) => (
            <Card key={destination.id}>
              <CardHeader>
                <CardTitle>{destination.name}</CardTitle>
                {destination.description && (
                  <CardDescription>{destination.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(destination)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(destination.id)}
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
