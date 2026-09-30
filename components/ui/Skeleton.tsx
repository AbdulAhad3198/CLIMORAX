'use client';

import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-slate-800/60 rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-7 w-32" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
      <Skeleton className="h-6 w-1/4" />
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="h-96 w-full bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-center p-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>
    </div>
  );
}
