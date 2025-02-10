import { ShieldAlert, SignalHigh, SignalLow, SignalMedium } from "lucide-react";

export const priority = [
    {
        value: 'MEDIUM',
        icon: SignalMedium,
        color: '#3b82f6' // blue-500
    },
    {
        value: 'LOW',
        icon: SignalLow,
        color: '#059669' // emerald-600
    },
    {
        value: 'HIGH',
        icon: SignalHigh,
        color: '#f59e0b' // amber-500
    },
    { 
        value: 'CRITICAL',
        icon: ShieldAlert,
        color: '#ef4444' // red-500
    }
];