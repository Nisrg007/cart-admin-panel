import { format, formatDistanceToNow, isValid } from 'date-fns';

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Never';
  
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return 'Invalid Date';
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch {
    return 'Invalid Date';
  }
};

export const formatRelativeTime = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Never';
  
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return 'Invalid Date';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Invalid Date';
  }
};

export const generateQRCodeData = (assignmentToken: string, renterPhone: string): string => {
  return `hocco://assign?token=${assignmentToken}&phone=${encodeURIComponent(renterPhone)}`;
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    case 'retired': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

// Safe date parsing for API responses
export const safeParseDate = (dateString: any): Date | null => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
};