import React from "react";
import { Button } from "./ui/button";
import { Heart, CarFront, Layout, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";

const Header = async ({ isAdminPage = false }) => {
  const user = await checkUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-lg z-50 border-b border-gray-200/50 shadow-sm">
      <nav className="mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
        <Link href={isAdminPage ? "/admin" : "/"} className="flex items-center gap-2">
          <div className="relative">
            <Image
              src={"/logo.png"}
              alt="Vehiql Logo"
              width={180}
              height={50}
              className="h-10 w-auto object-contain"
            />
            {isAdminPage && (
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                Admin
              </Badge>
            )}
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {isAdminPage ? (
            <>
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2 rounded-full px-4 py-2 border-gray-300 hover:bg-gray-50">
                  <ArrowLeft size={16} />
                  <span>Back to App</span>
                </Button>
              </Link>
            </>
          ) : (
            <SignedIn>
              {!isAdmin && (
                <Link href="/reservations">
                  <Button variant="outline" className="flex items-center gap-2 rounded-full px-4 py-2 border-gray-300 hover:bg-gray-50">
                    <CarFront size={16} />
                    <span className="hidden md:inline">Reservations</span>
                  </Button>
                </Link>
              )}
              <Link href="/saved-cars">
                <Button className="flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg">
                  <Heart size={16} />
                  <span className="hidden md:inline">Saved Cars</span>
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" className="flex items-center gap-2 rounded-full px-4 py-2 border-purple-300 text-purple-700 hover:bg-purple-50">
                    <Layout size={16} />
                    <span className="hidden md:inline">Admin Portal</span>
                  </Button>
                </Link>
              )}
            </SignedIn>
          )}

          <SignedOut>
            {!isAdminPage && (
              <SignInButton forceRedirectUrl="/">
                <Button className="rounded-full px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </SignedOut>

          <SignedIn>
            <div className="relative">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full border-2 border-gray-200 hover:border-blue-400 transition-colors",
                  },
                }}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;