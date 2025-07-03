"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, X, Sliders, SlidersHorizontal, Sparkles, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { CarFilterControls } from "./filter-controls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CarFilters = ({ filters }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current filter values from searchParams
  const currentMake = searchParams.get("make") || "";
  const currentBodyType = searchParams.get("bodyType") || "";
  const currentFuelType = searchParams.get("fuelType") || "";
  const currentTransmission = searchParams.get("transmission") || "";
  const currentMinPrice = searchParams.get("minPrice")
    ? parseInt(searchParams.get("minPrice"))
    : filters.priceRange.min;
  const currentMaxPrice = searchParams.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice"))
    : filters.priceRange.max;
  const currentSortBy = searchParams.get("sortBy") || "newest";

  // Local state for filters
  const [make, setMake] = useState(currentMake);
  const [bodyType, setBodyType] = useState(currentBodyType);
  const [fuelType, setFuelType] = useState(currentFuelType);
  const [transmission, setTransmission] = useState(currentTransmission);
  const [priceRange, setPriceRange] = useState([
    currentMinPrice,
    currentMaxPrice,
  ]);
  const [sortBy, setSortBy] = useState(currentSortBy);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Update local state when URL parameters change
  useEffect(() => {
    setMake(currentMake);
    setBodyType(currentBodyType);
    setFuelType(currentFuelType);
    setTransmission(currentTransmission);
    setPriceRange([currentMinPrice, currentMaxPrice]);
    setSortBy(currentSortBy);
  }, [
    currentMake,
    currentBodyType,
    currentFuelType,
    currentTransmission,
    currentMinPrice,
    currentMaxPrice,
    currentSortBy,
  ]);

  // Count active filters
  const activeFilterCount = [
    make,
    bodyType,
    fuelType,
    transmission,
    currentMinPrice > filters.priceRange.min ||
      currentMaxPrice < filters.priceRange.max,
  ].filter(Boolean).length;

  // Update URL when filters change
  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();

    if (make) params.set("make", make);
    if (bodyType) params.set("bodyType", bodyType);
    if (fuelType) params.set("fuelType", fuelType);
    if (transmission) params.set("transmission", transmission);
    if (priceRange[0] > filters.priceRange.min)
      params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < filters.priceRange.max)
      params.set("maxPrice", priceRange[1].toString());
    if (sortBy !== "newest") params.set("sortBy", sortBy);

    // Preserve search and page params if they exist
    const search = searchParams.get("search");
    const page = searchParams.get("page");
    if (search) params.set("search", search);
    if (page && page !== "1") params.set("page", page);

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);
    setIsSheetOpen(false);
  }, [
    make,
    bodyType,
    fuelType,
    transmission,
    priceRange,
    sortBy,
    pathname,
    searchParams,
    filters.priceRange.min,
    filters.priceRange.max,
  ]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    switch (filterName) {
      case "make":
        setMake(value);
        break;
      case "bodyType":
        setBodyType(value);
        break;
      case "fuelType":
        setFuelType(value);
        break;
      case "transmission":
        setTransmission(value);
        break;
      case "priceRange":
        setPriceRange(value);
        break;
    }
  };

  // Handle clearing specific filter
  const handleClearFilter = (filterName) => {
    handleFilterChange(filterName, "");
  };

  // Clear all filters
  const clearFilters = () => {
    setMake("");
    setBodyType("");
    setFuelType("");
    setTransmission("");
    setPriceRange([filters.priceRange.min, filters.priceRange.max]);
    setSortBy("newest");

    // Keep search term if exists
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.push(url);
    setIsSheetOpen(false);
  };

  // Current filters object for the controls component
  const currentFilters = {
    make,
    bodyType,
    fuelType,
    transmission,
    priceRange,
    priceRangeMin: filters.priceRange.min,
    priceRangeMax: filters.priceRange.max,
  };

  return (
    <div className="flex lg:flex-col justify-between gap-4">
      {/* Mobile Filters */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center justify-between gap-3">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full sm:max-w-md overflow-y-auto bg-gradient-to-br from-white to-gray-50/50 border-r-0 shadow-2xl"
            >
              <SheetHeader className="pb-6 border-b border-gray-200">
                <SheetTitle className="text-xl font-bold flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  Smart Filters
                </SheetTitle>
              </SheetHeader>

              <div className="py-6">
                <CarFilterControls
                  filters={filters}
                  currentFilters={currentFilters}
                  onFilterChange={handleFilterChange}
                  onClearFilter={handleClearFilter}
                />
              </div>

              <SheetFooter className="sm:justify-between flex-row pt-4 border-t border-gray-200 space-x-3 mt-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  className="flex-1 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all duration-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  type="button" 
                  onClick={applyFilters} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Enhanced Sort Dropdown */}
      <div className="relative">
        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value);
            // Apply filters immediately when sort changes
            setTimeout(() => applyFilters(), 0);
          }}
        >
          <SelectTrigger className="w-[200px] lg:w-full rounded-xl border-2 border-gray-200 hover:border-blue-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-blue-600" />
              <SelectValue placeholder="Sort by" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl">
            {[
              { value: "newest", label: "🆕 Newest First", icon: "🆕" },
              { value: "priceAsc", label: "💰 Price: Low to High", icon: "💰" },
              { value: "priceDesc", label: "💎 Price: High to Low", icon: "💎" },
              { value: "mileageAsc", label: "🏃 Lowest Mileage", icon: "🏃" },
              { value: "featured", label: "⭐ Featured Cars", icon: "⭐" },
            ].map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="cursor-pointer hover:bg-blue-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block sticky top-24">
        <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Sliders className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart Filters
                </span>
              </h3>
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs">
                    {activeFilterCount} active
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    onClick={clearFilters}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <CarFilterControls
              filters={filters}
              currentFilters={currentFilters}
              onFilterChange={handleFilterChange}
              onClearFilter={handleClearFilter}
            />
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
            <Button 
              onClick={applyFilters} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 py-3"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Active Filters
            </h4>
            <div className="flex flex-wrap gap-2">
              {make && (
                <Badge 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors duration-200"
                  onClick={() => handleClearFilter("make")}
                >
                  Make: {make}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {bodyType && (
                <Badge 
                  variant="secondary" 
                  className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer transition-colors duration-200"
                  onClick={() => handleClearFilter("bodyType")}
                >
                  Body: {bodyType}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {fuelType && (
                <Badge 
                  variant="secondary" 
                  className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer transition-colors duration-200"
                  onClick={() => handleClearFilter("fuelType")}
                >
                  Fuel: {fuelType}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {transmission && (
                <Badge 
                  variant="secondary" 
                  className="bg-orange-100 text-orange-800 hover:bg-orange-200 cursor-pointer transition-colors duration-200"
                  onClick={() => handleClearFilter("transmission")}
                >
                  Trans: {transmission}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {(currentMinPrice > filters.priceRange.min || currentMaxPrice < filters.priceRange.max) && (
                <Badge 
                  variant="secondary" 
                  className="bg-pink-100 text-pink-800 hover:bg-pink-200 cursor-pointer transition-colors duration-200"
                  onClick={() => handleFilterChange("priceRange", [filters.priceRange.min, filters.priceRange.max])}
                >
                  ${currentMinPrice.toLocaleString()} - ${currentMaxPrice.toLocaleString()}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};