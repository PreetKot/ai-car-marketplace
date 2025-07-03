"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { 
  AlertCircle, 
  Calendar, 
  Car, 
  Fuel, 
  Gauge, 
  LocateFixed, 
  Share2, 
  Heart, 
  MessageSquare, 
  Currency,
  Sparkles,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Eye,
  Users,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toggleSavedCar } from "@/actions/car-listing";
import useFetch from "@/hooks/use-fetch";
import { formatCurrency } from "@/lib/helpers";
import { format } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import EmiCalculator from "./emi-calculator";

export function CarDetails({ car, testDriveInfo }) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(car.wishlisted);

  const {
    loading: savingCar,
    fn: toggleSavedCarFn,
    data: toggleResult,
    error: toggleError,
  } = useFetch(toggleSavedCar);

  // Handle toggle result with useEffect
  useEffect(() => {
    if (toggleResult?.success) {
      setIsWishlisted(toggleResult.saved);
      toast.success(toggleResult.message);
    }
  }, [toggleResult]);

  // Handle errors with useEffect
  useEffect(() => {
    if (toggleError) {
      toast.error("Failed to update favorites");
    }
  }, [toggleError]);

  // Handle save car
  const handleSaveCar = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to save cars");
      router.push("/sign-in");
      return;
    }

    if (savingCar) return;

    await toggleSavedCarFn(car.id);
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${car.year} ${car.make} ${car.model}`,
          text: `Check out this ${car.year} ${car.make} ${car.model} on Vehiql!`,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("Error sharing", error);
          copyToClipboard();
        });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  // Handle book test drive
  const handleBookTestDrive = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to book a test drive");
      router.push("/sign-in");
      return;
    }
    router.push(`/test-drive/${car.id}`);
  };

  // Navigation handlers for image gallery
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === car.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? car.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Enhanced Image Gallery */}
        <div className="lg:col-span-7">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
            {car.images && car.images.length > 0 ? (
              <>
                <Image
                  src={car.images[currentImageIndex]}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Navigation Arrows */}
                {car.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all duration-200"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-800" />
                    </button>
                  </>
                )}
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                  {currentImageIndex + 1} / {car.images.length}
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <Car className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Enhanced Thumbnails */}
          {car.images && car.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 mt-4 scrollbar-hide">
              {car.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer rounded-xl h-20 w-28 flex-shrink-0 transition-all duration-200 ${
                    index === currentImageIndex
                      ? "ring-2 ring-blue-500 shadow-lg scale-105"
                      : "opacity-70 hover:opacity-100 hover:scale-105"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${car.year} ${car.make} ${car.model} - view ${index + 1}`}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Car Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1">
                {car.bodyType}
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full ${isWishlisted ? "text-red-500 border-red-200" : ""}`}
                  onClick={handleSaveCar}
                  disabled={savingCar}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500" : ""}`} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
              {car.year} {car.make} {car.model}
            </h1>

            <div className="text-3xl font-bold text-blue-600 mb-4">
              {formatCurrency(car.price)}
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="text-blue-500 h-4 w-4" />
                  <span className="text-xs text-gray-500">Mileage</span>
                </div>
                <span className="font-semibold">{car.mileage.toLocaleString()} miles</span>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Fuel className="text-green-500 h-4 w-4" />
                  <span className="text-xs text-gray-500">Fuel</span>
                </div>
                <span className="font-semibold">{car.fuelType}</span>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Settings className="text-purple-500 h-4 w-4" />
                  <span className="text-xs text-gray-500">Transmission</span>
                </div>
                <span className="font-semibold">{car.transmission}</span>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="text-orange-500 h-4 w-4" />
                  <span className="text-xs text-gray-500">Seats</span>
                </div>
                <span className="font-semibold">{car.seats || 5}</span>
              </div>
            </div>
          </div>

          {/* Enhanced EMI Calculator */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 border-blue-200 hover:border-blue-300">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                      <Currency className="h-5 w-5 text-white" />
                    </div>
                    EMI Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Monthly Payment:</span>
                      <span className="font-bold text-lg text-green-600">
                        {formatCurrency(car.price / 60)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      *60 months, $0 down, 4.5% APR
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Vehiql Car Loan Calculator
                </DialogTitle>
              </DialogHeader>
              <EmiCalculator price={car.price} />
            </DialogContent>
          </Dialog>

          {/* Enhanced Contact Card */}
          <Card className="border-2 border-purple-200 hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                Have Questions?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Our AI-powered representatives are available 24/7 to answer all your queries about this vehicle.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 rounded-xl">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl" asChild>
                  <a href="mailto:help@vehiql.in">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Alert */}
          {(car.status === "SOLD" || car.status === "UNAVAILABLE") && (
            <Alert variant="destructive" className="border-2 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="capitalize">
                This car is {car.status.toLowerCase()}
              </AlertTitle>
              <AlertDescription>Please check our other available vehicles.</AlertDescription>
            </Alert>
          )}

          {/* Enhanced Book Test Drive Button */}
          {car.status !== "SOLD" && car.status !== "UNAVAILABLE" && (
            <Button
              className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              onClick={handleBookTestDrive}
              disabled={testDriveInfo.userTestDrive}
            >
              <Calendar className="mr-2 h-5 w-5" />
              {testDriveInfo.userTestDrive
                ? `Booked for ${format(
                    new Date(testDriveInfo.userTestDrive.bookingDate),
                    "EEEE, MMMM d, yyyy"
                  )}`
                : "Book Test Drive"}
            </Button>
          )}
        </div>
      </div>

      {/* Enhanced Details & Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Eye className="h-5 w-5 text-white" />
              </div>
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">
              {car.description}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <span>{car.transmission} Transmission</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                <span>{car.fuelType} Engine</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <span>{car.bodyType} Body Style</span>
              </div>
              {car.seats && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  <span>{car.seats} Seats</span>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
                <span>{car.color} Exterior</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Specifications Section */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <Settings className="h-5 w-5 text-white" />
            </div>
            Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Make", value: car.make },
              { label: "Model", value: car.model },
              { label: "Year", value: car.year },
              { label: "Body Type", value: car.bodyType },
              { label: "Fuel Type", value: car.fuelType },
              { label: "Transmission", value: car.transmission },
              { label: "Mileage", value: `${car.mileage.toLocaleString()} miles` },
              { label: "Color", value: car.color },
              ...(car.seats ? [{ label: "Seats", value: car.seats }] : []),
            ].map((spec, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">{spec.label}</span>
                <span className="font-semibold text-gray-900">{spec.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Dealership Location Section */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            Dealership Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dealership Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <LocateFixed className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg text-blue-900">Vehiql Motors</h4>
                  <p className="text-gray-600 mt-1">
                    {testDriveInfo.dealership?.address || "123 Main Street, City, State 12345"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <span className="font-medium text-green-900">Phone</span>
                  <p className="text-gray-600">{testDriveInfo.dealership?.phone || "+1 (555) 123-4567"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                <Mail className="h-5 w-5 text-purple-600 flex-shrink-0" />
                <div>
                  <span className="font-medium text-purple-900">Email</span>
                  <p className="text-gray-600">{testDriveInfo.dealership?.email || "contact@vehiql.com"}</p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-gray-600" />
                <h4 className="font-semibold text-lg text-gray-900">Working Hours</h4>
              </div>
              <div className="space-y-2">
                {testDriveInfo.dealership?.workingHours
                  ? testDriveInfo.dealership.workingHours
                      .sort((a, b) => {
                        const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
                        return days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek);
                      })
                      .map((day) => (
                        <div key={day.dayOfWeek} className="flex justify-between items-center p-2 bg-white rounded-lg">
                          <span className="text-gray-600 font-medium">
                            {day.dayOfWeek.charAt(0) + day.dayOfWeek.slice(1).toLowerCase()}
                          </span>
                          <span className={`font-semibold ${day.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                            {day.isOpen ? `${day.openTime} - ${day.closeTime}` : "Closed"}
                          </span>
                        </div>
                      ))
                  : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
                      <div key={day} className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <span className="text-gray-600 font-medium">{day}</span>
                        <span className={`font-semibold ${index < 6 ? 'text-green-600' : 'text-red-600'}`}>
                          {index < 5 ? "9:00 AM - 6:00 PM" : index === 5 ? "10:00 AM - 4:00 PM" : "Closed"}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}