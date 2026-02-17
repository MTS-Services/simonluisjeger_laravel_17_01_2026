import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

export default function CustomToast({ message, type = 'success', duration = 4000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />
    };

    const styles = {
        success: "border-emerald-100 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900",
        error: "border-red-100 bg-red-50 dark:bg-red-950/30 dark:border-red-900",
        info: "border-blue-100 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900"
    };

    return (
        <div className={cn(
            "fixed top-6 right-6 z-[100] flex items-center gap-3 w-full max-w-sm p-4 rounded-xl border shadow-2xl transition-all duration-300",
            isVisible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95",
            styles[type]
        )}>
            <div className="flex-shrink-0">{icons[type]}</div>
            <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100 line-clamp-2">
                {message}
            </p>
            <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors"
            >
                <X className="h-4 w-4 text-slate-400" />
            </button>
        </div>
    );
}