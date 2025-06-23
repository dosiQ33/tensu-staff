import {
  Shield,
  User,
  AlertCircle,
  Pause
} from 'lucide-react';
import type { Staff } from '@/types/types';

export const getRoleIcon = (role: Staff['role']) => {
  switch (role) {
    case 'admin': return <Shield size={16} className="text-purple-600" />;
    case 'coach': return <User size={16} className="text-blue-600" />;
    default: return <User size={16} className="text-gray-600" />;
  }
};

export const getRoleLabel = (role: Staff['role']) => {
  switch (role) {
    case 'admin': return 'Administrator';
    case 'coach': return 'Coach';
    default: return role;
  }
};

export const getStatusColor = (status: Staff['status']) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'blocked': return 'bg-red-100 text-red-800';
    case 'vacation': return 'bg-orange-100 text-orange-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusIcon = (status: Staff['status']) => {
  switch (status) {
    case 'blocked': return <AlertCircle size={14} />;
    case 'vacation': return <Pause size={14} />;
    default: return null;
  }
};