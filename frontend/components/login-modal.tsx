'use client';

import { useState } from 'react';
import { config } from '../config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const clearAllBrowserData = () => {
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
  };

  const handleNewLogin = () => {
    clearAllBrowserData();
    // Redirect to backend with force_login=true
    window.location.href = `${config.BACKEND_URL}/login?force_login=true`;
  };

  const handleExistingLogin = () => {
    // Try to use existing session if available
    window.location.href = `${config.BACKEND_URL}/login`;
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
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
          >
            <Github className="w-5 h-5" />
            Continue with existing account
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
            variant="outline"
            className="flex items-center justify-center gap-2 border-violet-500/20 hover:bg-violet-500/10 hover:border-violet-500/30 text-violet-300 transition-all duration-200"
          >
            <Github className="w-5 h-5" />
            Sign in with different account
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-400 group-hover:w-full transition-all duration-200"></span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
