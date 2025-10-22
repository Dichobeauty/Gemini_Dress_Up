
import React from 'react';

type IconProps = {
  className?: string;
};

export const UploadIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
  </svg>
);

export const PersonIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);

export const ShirtIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 01.203 12.519l-.203.203a9 9 0 01-12.728-12.728l.203-.203a9 9 0 0112.525 0zM9.5 9.5c.276 0 .5.224.5.5v4c0 .276-.224.5-.5.5s-.5-.224-.5-.5v-4c0-.276.224-.5.5-.5zm5 0c.276 0 .5.224.5.5v4c0 .276-.224.5-.5.5s-.5-.224-.5-.5v-4c0-.276.224-.5.5-.5z" clipRule="evenodd"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3.5V6m6-2.5V6" ></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.929 19.071c3.905-3.905 10.237-3.905 14.142 0"></path>
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className = "w-4 h-4 text-white" }) => (
  <svg className={className} stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3.5a1.5 1.5 0 013 0V1.5a1.5 1.5 0 01-3 0V3.5zM10 18.5a1.5 1.5 0 013 0v-2a1.5 1.5 0 01-3 0v2zM3.5 10a1.5 1.5 0 010 3H1.5a1.5 1.5 0 010-3H3.5zm15 0a1.5 1.5 0 010 3h2a1.5 1.5 0 010-3h-2zM6.025 6.025a1.5 1.5 0 012.122 0l1.414-1.414a1.5 1.5 0 010-2.122L6.025 6.025zm8.95 8.95a1.5 1.5 0 01-2.122 0l-1.414 1.414a1.5 1.5 0 010 2.122l3.536-3.536zM6.025 14.975a1.5 1.5 0 010-2.122L2.489 9.317a1.5 1.5 0 01-2.122 0l3.536 3.536 2.122 2.122zm8.95-8.95a1.5 1.5 0 010 2.122l3.536 3.536a1.5 1.5 0 012.122 0l-3.536-3.536-2.122-2.122z"></path>
    </svg>
);
