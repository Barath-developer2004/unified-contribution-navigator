'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const clearAllBrowserData = () => {
    try {
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing browser data:', error);
      toast({
        title: "Error",
        description: "Failed to clear browser data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewLogin = async () => {
    try {
      setIsLoading(true);
      clearAllBrowserData();
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/login?force_login=true`;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "Failed to initiate login. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleExistingLogin = async () => {
    try {
      setIsLoading(true);
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/login`;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "Failed to initiate login. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl text-violet-400">Sign in with GitHub</DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose how you want to sign in to Contribution Navigator
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            onClick={handleExistingLogin}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 relative"
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-violet-500"></div>
              </div>
            ) : (
              <>
                <Github className="w-5 h-5" />
                Continue with existing account
              </>
            )}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-500">Or</span>
            </div>
          </div>
          <Button
            onClick={handleNewLogin}
            disabled={isLoading}
            variant="outline"
            className="flex items-center justify-center gap-2 border-violet-500/20 hover:bg-violet-500/10 hover:border-violet-500/30 text-violet-300 transition-all duration-200 relative"
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-violet-500"></div>
              </div>
            ) : (
              <>
                <Github className="w-5 h-5" />
                Sign in with different account
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
