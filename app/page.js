import { ChevronRight, Car, Calendar, Shield, Sparkles, Zap, Star, TrendingUp, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SignedOut } from "@clerk/nextjs";
import { getFeaturedCars } from "@/actions/home";
import { CarCard } from "@/components/car-card";
import { HomeSearch } from "@/components/home-search";
import Link from "next/link";
import Image from "next/image";
import { bodyTypes, carMakes, faqItems } from "@/lib/data";

export default async function Home() {
  const featuredCars = await getFeaturedCars();

  return (
    <div className="flex flex-col pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Hero Section with Proper Alignment */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-6">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Car Search
              </Badge>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
              Find your Dream Car
              <span className="block text-4xl sm:text-5xl lg:text-7xl mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                with Vehiql AI
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience the future of car shopping with our advanced AI technology. 
              <span className="block mt-2 text-base sm:text-lg text-gray-500">
                Search by image, get instant matches, and book test drives seamlessly.
              </span>
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 mb-10">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-blue-500 mr-1" />
                <span>50K+ Happy Customers</span>
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 text-purple-500 mr-1" />
                <span>Industry Leading</span>
              </div>
            </div>
          </div>

          {/* Search Component */}
          <div className="max-w-4xl mx-auto">
            <HomeSearch />
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
            <div className="text-center lg:text-left flex-1">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
                Featured Cars
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
                Handpicked premium vehicles curated by our AI system
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-end">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 group"
                asChild
              >
                <Link href="/cars">
                  View All Cars
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Make Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-purple-700 bg-clip-text text-transparent">
              Browse by Make
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore vehicles from your favorite manufacturers
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {carMakes.map((make) => (
              <Link
                key={make.name}
                href={`/cars?make=${make.name}`}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 lg:p-6 text-center border border-gray-200/50 hover:border-blue-300/50 group-hover:scale-105">
                  <div className="h-12 lg:h-16 w-auto mx-auto mb-3 lg:mb-4 relative">
                    <Image
                      src={make.imageUrl || `/make/${make.name.toLowerCase()}.webp`}
                      alt={make.name}
                      fill
                      className="object-contain transition-transform group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-semibold text-sm lg:text-base text-gray-800 group-hover:text-blue-600 transition-colors">
                    {make.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
              Why Choose Vehiql AI
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Revolutionary features that make car shopping effortless and enjoyable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-3xl w-20 h-20 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow">
                    <Car className="h-10 w-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-800">AI-Powered Search</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                Our advanced AI analyzes thousands of vehicles to find your perfect match based on your preferences and budget.
              </p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-3xl w-20 h-20 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow">
                    <Calendar className="h-10 w-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-400 to-red-500 rounded-full p-1">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-800">Instant Test Drive</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                Book test drives in seconds with our smart scheduling system. No waiting, no hassle, just pure convenience.
              </p>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-3xl w-20 h-20 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow">
                    <Shield className="h-10 w-10" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full p-1">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-800">Verified Quality</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                Every vehicle is thoroughly verified and inspected. Buy with confidence knowing you're getting quality guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Body Type Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-purple-700 bg-clip-text text-transparent">
              Browse by Body Type
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the perfect vehicle type for your lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {bodyTypes.map((type) => (
              <Link
                key={type.name}
                href={`/cars?bodyType=${type.name}`}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl h-40 lg:h-48 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <Image
                    src={type.imageUrl || `/body/${type.name.toLowerCase()}.webp`}
                    alt={type.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-lg lg:text-xl font-bold mb-1">{type.name}</h3>
                    <p className="text-gray-300 text-xs lg:text-sm">Explore {type.name.toLowerCase()} vehicles</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our platform
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 px-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6 text-lg font-semibold text-gray-800">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who found their perfect vehicle through our AI-powered platform.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">50K+</div>
              <div className="text-blue-200 text-sm sm:text-base">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">10K+</div>
              <div className="text-blue-200 text-sm sm:text-base">Cars Sold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">4.9★</div>
              <div className="text-blue-200 text-sm sm:text-base">Average Rating</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
              asChild
            >
              <Link href="/cars">
                <TrendingUp className="w-5 h-5 mr-2" />
                Browse All Cars
              </Link>
            </Button>
            <SignedOut>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                asChild
              >
                <Link href="/sign-up">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started Free
                </Link>
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>
    </div>
  );
}