import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Package } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Туристические путевки</h1>
        <p className="text-muted-foreground">Система управления туристическими путевками и направлениями</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              <CardTitle>Направления</CardTitle>
            </div>
            <CardDescription>
              Управление типами направлений (пляжный отдых, экскурсии, горнолыжный отдых и т.д.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/destinations">
              <Button className="w-full">Перейти к направлениям</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              <CardTitle>Туристические путевки</CardTitle>
            </div>
            <CardDescription>
              Управление туристическими путевками: создание, редактирование, фильтрация по типам направлений
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/tour-packages">
              <Button className="w-full">Перейти к путевкам</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
