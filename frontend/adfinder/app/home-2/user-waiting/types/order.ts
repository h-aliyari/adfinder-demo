// D:\adfinder\frontend\adfinder\app\home-2\user-waiting\types\order.ts
export interface OrderStep {
  id: number;
  name: string;
  description: string;
  icon: string; // نام آیکون از lucide-react
  isCompleted: boolean;
  isCurrent: boolean;
  estimatedDuration?: number; // زمان تخمینی برای این مرحله (دقیقه)
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface OrderDetails {
  orderNumber: string;
  orderDate: string;
  estimatedTotalTime: number; // کل زمان تخمینی (دقیقه)
  currentStep: number;
  steps: OrderStep[];
  items: OrderItem[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}