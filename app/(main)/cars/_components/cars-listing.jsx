"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Info, Car, SearchX, Sparkles, TrendingUp, Grid3X3, List, Eye } from "lucide-react";
import { CarCard } from "@/components/car-card";
import useFetch from "@/hooks/use-fetch";
import { getCars } from "@/actions/car-listing";
import CarListingsLoading from "./car-listing-loading";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function CarListings() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const limit = 6;

  // Extract filter values from searchParams
  const search = searchParams.get("search") || "";
  const make = searchParams.get("make") || "";
  const bodyType = searchParams.get("bodyType") || "";
  const fuelType = searchParams.get("fuelType") || "";
  const transmission = searchParams.get("transmission") || "";
  const minPrice = searchParams.get("minPrice") || 0;
  const maxPrice = searchParams.get("maxPrice") || Number.MAX_SAFE_INTEGER;
  const sortBy = searchParams.get("sortBy") || "newest";
  const page = parseInt(searchParams.get("page") || "1");

  // Use the useFetch hook
  const { loading, fn: fetchCars, data: result, error } = useFetch(getCars);

  // Fetch cars when filters change
  useEffect(() => {
    fetchCars({
      search,
      make,
      bodyType,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      sortBy,
      page,
      limit,
    });
  }, [
    search,
    make,
    bodyType,
    fuelType,
    transmission,
    minPrice,
    maxPrice,
    sortBy,
    page,
  ]);

  // Update URL when page changes
  useEffect(() => {
    if (currentPage !== page) {
      const params = new URLSearchParams(searchParams);
      params.set("page", currentPage.toString());
      router.push(`?${params.toString()}`);
    }
  }, [currentPage, router, searchParams, page]);

  // Handle pagination clicks
  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // Generate pagination URL
  const getPaginationUrl = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNum.toString());
    return `?${params.toString()}`;
  };

  // Show loading state
  if (loading && !result) {
    return <CarListingsLoading />;
  }

  // Handle error
  if (error || (result && !result.success)) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-8">
        <Alert variant="destructive" className="max-w-md border-red-200 bg-red-50/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Info className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <AlertTitle className="text-red-800 font-semibold">Oops! Something went wrong</AlertTitle>
              <AlertDescription className="text-red-700">
                Failed to load cars. Please try again later.
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>
    );
  }

  // If no results yet, return empty placeholder
  if (!result || !result.data) {
    return null;
  }

  const { data: cars, pagination } = result;

  // No results
  if (cars.length === 0) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8">
        <div className="relative mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-3xl shadow-lg">
            <SearchX className="h-16 w-16 text-gray-400 mx-auto" />
          </div>
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
          No cars found
        </h3>
        <p className="text-gray-500 mb-8 max-w-md leading-relaxed">
          We couldn't find any cars matching your search criteria. Try adjusting
          your filters or search term to discover more options.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="rounded-full px-6 py-3 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
            asChild
          >
            <Link href="/cars">
              <TrendingUp className="h-4 w-4 mr-2" />
              Clear all filters
            </Link>
          </Button>
          <Button 
            className="rounded-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <Link href="/">
              <Car className="h-4 w-4 mr-2" />
              Browse all cars
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Generate pagination items
  const paginationItems = [];

  // Calculate which page numbers to show (first, last, and around current page)
  const visiblePageNumbers = [];

  // Always show page 1
  visiblePageNumbers.push(1);

  // Show pages around current page
  for (
    let i = Math.max(2, page - 1);
    i <= Math.min(pagination.pages - 1, page + 1);
    i++
  ) {
    visiblePageNumbers.push(i);
  }

  // Always show last page if there's more than 1 page
  if (pagination.pages > 1) {
    visiblePageNumbers.push(pagination.pages);
  }

  // Sort and deduplicate
  const uniquePageNumbers = [...new Set(visiblePageNumbers)].sort(
    (a, b) => a - b
  );

  // Create pagination items with ellipses
  let lastPageNumber = 0;
  uniquePageNumbers.forEach((pageNumber) => {
    if (pageNumber - lastPageNumber > 1) {
      // Add ellipsis
      paginationItems.push(
        <PaginationItem key={`ellipsis-${pageNumber}`}>
          <PaginationEllipsis className="text-gray-400" />
        </PaginationItem>
      );
    }

    paginationItems.push(
      <PaginationItem key={pageNumber}>
        <PaginationLink
          href={getPaginationUrl(pageNumber)}
          isActive={pageNumber === page}
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(pageNumber);
          }}
          className={`rounded-xl border-2 transition-all duration-300 ${
            pageNumber === page
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600 shadow-lg"
              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
          }`}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    );

    lastPageNumber = pageNumber;
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
                Search Results
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span>Showing</span>
              <Badge className="bg-blue-100 text-blue-800 font-semibold">
                {(page - 1) * limit + 1}-{Math.min(page * limit, pagination.total)}
              </Badge>
              <span>of</span>
              <Badge className="bg-purple-100 text-purple-800 font-semibold">
                {pagination.total}
              </Badge>
              <span>premium cars</span>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">View:</span>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white shadow-md text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white shadow-md text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Car Grid */}
      <div className={`grid gap-6 ${
        viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      }`}>
        {cars.map((car, index) => (
          <div
            key={car.id}
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <CarCard car={car} />
          </div>
        ))}
      </div>

      {/* Enhanced Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>Page {page} of {pagination.pages}</span>
            </div>
            <div className="text-sm text-gray-600">
              {pagination.total} cars found
            </div>
          </div>
          
          <Pagination className="justify-center">
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href={getPaginationUrl(page - 1)}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) {
                      handlePageChange(page - 1);
                    }
                  }}
                  className={`rounded-xl border-2 transition-all duration-300 ${
                    page <= 1 
                      ? "pointer-events-none opacity-50 border-gray-200" 
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                />
              </PaginationItem>

              {paginationItems}

              <PaginationItem>
                <PaginationNext
                  href={getPaginationUrl(page + 1)}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < pagination.pages) {
                      handlePageChange(page + 1);
                    }
                  }}
                  className={`rounded-xl border-2 transition-all duration-300 ${
                    page >= pagination.pages
                      ? "pointer-events-none opacity-50 border-gray-200"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}