"use client";

import { useState, useEffect } from "react";
import { Search, Upload, Camera, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { processImageSearch } from "@/actions/home";
import useFetch from "@/hooks/use-fetch";

export function HomeSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchImage, setSearchImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);

  // Use the useFetch hook for image processing
  const {
    loading: isProcessing,
    fn: processImageFn,
    data: processResult,
    error: processError,
  } = useFetch(processImageSearch);

  // Handle process result and errors with useEffect
  useEffect(() => {
    if (processResult?.success) {
      const params = new URLSearchParams();

      // Add extracted params to the search
      if (processResult.data.make) params.set("make", processResult.data.make);
      if (processResult.data.bodyType)
        params.set("bodyType", processResult.data.bodyType);
      if (processResult.data.color)
        params.set("color", processResult.data.color);

      // Redirect to search results
      router.push(`/cars?${params.toString()}`);
    }
  }, [processResult, router]);

  useEffect(() => {
    if (processError) {
      toast.error(
        "Failed to analyze image: " + (processError.message || "Unknown error")
      );
    }
  }, [processError]);

  // Handle image upload with react-dropzone
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setIsUploading(true);
      setSearchImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setIsUploading(false);
        toast.success("Image uploaded successfully");
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to read the image");
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png"],
      },
      maxFiles: 1,
    });

  // Handle text search submissions
  const handleTextSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term");
      return;
    }

    router.push(`/cars?search=${encodeURIComponent(searchTerm)}`);
  };

  // Handle image search submissions
  const handleImageSearch = async (e) => {
    e.preventDefault();
    if (!searchImage) {
      toast.error("Please upload an image first");
      return;
    }

    // Use the processImageFn from useFetch hook
    await processImageFn(searchImage);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleTextSearch}>
        <div className="relative flex items-center group">
          <Search className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            type="text"
            placeholder="Enter make, model, or use our AI Image Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-32 py-6 w-full rounded-2xl border-2 border-gray-200 bg-white/90 backdrop-blur-sm shadow-lg focus:border-blue-400 focus:shadow-xl transition-all duration-300 text-lg"
          />

          {/* AI Image Search Button */}
          <div className="absolute right-20">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsImageSearchActive(!isImageSearchActive)}
              className={`rounded-xl p-2 transition-all duration-300 ${
                isImageSearchActive 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
            >
              <Camera size={20} />
            </Button>
          </div>

          <Button 
            type="submit" 
            className="absolute right-2 rounded-xl px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </form>

      {isImageSearchActive && (
        <div className="mt-6 animate-in slide-in-from-top-2 duration-300">
          <form onSubmit={handleImageSearch} className="space-y-6">
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className={`border-2 border-dashed ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} rounded-3xl p-8 text-center bg-white/50 backdrop-blur-sm transition-all duration-300 ${isDragReject ? 'border-red-400 bg-red-50' : ''}`}>
                {imagePreview ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Car preview"
                        className="h-48 w-auto object-contain rounded-lg shadow-lg"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => {
                        setSearchImage(null);
                        setImagePreview("");
                        toast.info("Image removed");
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div {...getRootProps()} className="cursor-pointer">
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <Upload className="h-16 w-16 text-gray-400" />
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-gray-700">
                          {isDragActive && !isDragReject
                            ? "Drop the image here to upload"
                            : "AI-Powered Image Search"}
                        </p>
                        <p className="text-gray-500">
                          Drag & drop a car image or click to select
                        </p>
                        {isDragReject && (
                          <p className="text-red-500 font-semibold">
                            Please select a valid image file
                          </p>
                        )}
                        <p className="text-sm text-gray-400">
                          Supports: JPG, PNG (max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {imagePreview && (
              <Button
                type="submit"
                className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                disabled={isUploading || isProcessing}
              >
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-5 w-5 animate-bounce" />
                    Uploading...
                  </>
                ) : isProcessing ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                    AI is analyzing your image...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Search with AI Image Recognition
                  </>
                )}
              </Button>
            )}
          </form>
        </div>
      )}
    </div>
  );
}