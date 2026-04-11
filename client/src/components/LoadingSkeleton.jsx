import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm animate-pulse">
    <div className="w-16 h-16 bg-gray-200 rounded-3xl mb-6"></div>
    <div className="h-6 bg-gray-200 rounded-full w-2/3 mb-4"></div>
    <div className="h-4 bg-gray-100 rounded-full w-full mb-2"></div>
    <div className="h-4 bg-gray-100 rounded-full w-1/2"></div>
  </div>
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-3 animate-pulse w-full">
    {[...Array(lines)].map((_, i) => (
      <div key={i} className={`h-4 bg-gray-100 rounded-full ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}></div>
    ))}
  </div>
);

export const SkeletonAvatar = () => (
  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
);

export const ResultPageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-12 px-4 animate-pulse">
    <div className="max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="bg-white p-8 rounded-[40px] border border-gray-100 mb-12">
        <div className="h-4 bg-gray-200 rounded-full w-32 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded-full w-2/3 mb-6"></div>
        <div className="flex space-x-3">
          <div className="h-6 bg-gray-100 rounded-full w-20"></div>
          <div className="h-6 bg-gray-100 rounded-full w-20"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <SkeletonCard />
           <div className="flex space-x-6 overflow-hidden">
              <SkeletonCard />
              <SkeletonCard />
           </div>
        </div>
        <div className="space-y-6">
           <div className="h-[400px] bg-gray-900 rounded-[40px]"></div>
           <div className="h-[200px] bg-white rounded-[40px] border border-gray-100"></div>
        </div>
      </div>
    </div>
  </div>
);
