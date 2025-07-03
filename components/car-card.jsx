"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Car as CarIcon, Loader2, Eye, Calendar, Fuel, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { toggleSavedCar } from "@/actions/car-listing";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";

export const CarCard = ({ car }) => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(car.wishlisted);

  // Use the useFetch hook
  const {
    loading: isToggling,
    fn: toggleSavedCarFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  // Handle toggle result with useEffect
  useEffect(() => {
    if (toggleResult?.success && toggleResult.saved !== isSaved) {
      setIsSaved(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult, isSaved]);

  // Handle errors with useEffect
  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to update favorites");
    }
  }, [toggleError]);

  // Handle save/unsave car
  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      toast.error("Please sign in to save cars");
      router.push("/sign-in");
      return;
    }

    if (isToggling) return;

    // Call the toggleSavedCar function using our useFetch hook
    await toggleSavedCarFn(car.id);
  };

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 bg-white/70 backdrop-blur-sm">
      <div className="relative h-56 overflow-hidden">
        {car.images && car.images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={car.images[0]}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <CarIcon className="h-16 w-16 text-gray-400" />
          </div>
        )}

        {/* Featured Badge */}
        {car.featured && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
            Featured
          </Badge>
        )}

        {/* Heart Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
            isSaved
              ? "text-red-500 hover:text-red-600 bg-red-50"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={handleToggleSave}
          disabled={isToggling}
        >
          {isToggling ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart className={isSaved ? "fill-current" : ""} size={20} />
          )}
        </Button>

        {/* Quick View Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={() => router.push(`/cars/${car.id}`)}
        >
          <Eye className="h-5 w-5" />
        </Button>
      </div>

      <CardContent className="p-6">
        <div className="flex flex-col mb-4">
          <h3 className="text-xl font-bold line-clamp-1 mb-1">
            {car.make} {car.model}
          </h3>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${car.price.toLocaleString()}
          </span>
        </div>

        {/* Car Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Fuel className="h-4 w-4 mr-2 text-green-500" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Gauge className="h-4 w-4 mr-2 text-orange-500" />
            <span>{car.mileage.toLocaleString()} mi</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <CarIcon className="h-4 w-4 mr-2 text-purple-500" />
            <span>{car.transmission}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
            {car.bodyType}
          </Badge>
          <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-700">
            {car.color}
          </Badge>
        </div>

        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={() => {
            router.push(`/cars/${car.id}`);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};