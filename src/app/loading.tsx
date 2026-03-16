"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white via-cyan-50 to-purple-50">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: `radial-gradient(circle, ${i % 2 === 0 ? '#06b6d4' : '#a855f7'} 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main loading container */}
      <div className="relative flex flex-col items-center">
        {/* 3D Rotating Logo Container */}
        <div 
          className="relative w-32 h-32 mb-8"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Outer spinning ring */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #06b6d4, #a855f7, #ec4899, #06b6d4)',
              animation: 'spin 3s linear infinite',
            }}
          />
          
          {/* Inner glowing ring */}
          <div 
            className="absolute inset-2 rounded-full bg-white"
            style={{
              boxShadow: '0 0 40px rgba(6, 182, 212, 0.5), 0 0 80px rgba(168, 85, 247, 0.3), inset 0 0 30px rgba(6, 182, 212, 0.2)',
            }}
          />
          
          {/* 3D Logo */}
          <div 
            className="absolute inset-4 flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              animation: 'rotate3d 4s ease-in-out infinite',
            }}
          >
            {/* Logo letter with 3D effect */}
            <div 
              className="relative"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Main letter */}
              <span 
                className="text-5xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.8))',
                  textShadow: '0 0 30px rgba(6, 182, 212, 0.6)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              >
                S
              </span>
              
              {/* 3D shadow layers */}
              <span 
                className="absolute top-0 left-0 text-5xl font-black opacity-20"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transform: 'translateZ(-10px) translateY(2px)',
                }}
              >
                S
              </span>
              <span 
                className="absolute top-0 left-0 text-5xl font-black opacity-10"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  transform: 'translateZ(-20px) translateY(4px)',
                }}
              >
                S
              </span>
            </div>
          </div>

          {/* Orbiting dots */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: i === 0 ? '#06b6d4' : i === 1 ? '#a855f7' : '#ec4899',
                boxShadow: `0 0 10px ${i === 0 ? '#06b6d4' : i === 1 ? '#a855f7' : '#ec4899'}`,
                animation: `orbit ${2 + i * 0.5}s linear infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Company Name with Blinking Effect */}
        <div className="flex flex-col items-center gap-2">
          <h1 
            className="text-4xl md:text-5xl font-black tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #06b6d4 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 2s ease-in-out infinite, blink 1s ease-in-out infinite',
              textShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
            }}
          >
            SMFC
          </h1>
          <h2 
            className="text-xl md:text-2xl font-bold text-gray-600"
            style={{
              animation: 'blink 1.5s ease-in-out infinite',
              animationDelay: '0.3s',
            }}
          >
            Finance
          </h2>
        </div>

        {/* Loading indicator */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {/* Progress bar */}
          <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #06b6d4, #a855f7, #06b6d4)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s linear infinite, progress 2s ease-in-out infinite',
              }}
            />
          </div>
          
          {/* Loading text with dots animation */}
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <span>Loading</span>
            <span className="flex gap-0.5">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes rotate3d {
          0%, 100% { 
            transform: rotateY(0deg) rotateX(0deg); 
          }
          25% { 
            transform: rotateY(15deg) rotateX(5deg); 
          }
          50% { 
            transform: rotateY(0deg) rotateX(0deg); 
          }
          75% { 
            transform: rotateY(-15deg) rotateX(-5deg); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.8));
          }
          50% { 
            transform: scale(1.05);
            filter: drop-shadow(0 0 30px rgba(6, 182, 212, 1));
          }
        }
        
        @keyframes orbit {
          from { 
            transform: rotate(0deg) translateX(58px) rotate(0deg); 
          }
          to { 
            transform: rotate(360deg) translateX(58px) rotate(-360deg); 
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) scale(1);
            opacity: 0.2;
          }
          50% { 
            transform: translateY(-20px) scale(1.1);
            opacity: 0.4;
          }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
