// D:\adfinder\frontend\adfinder\app\home-2\login-register\dashboard-login\monitor\services\api.ts

// داده‌های تستی برای سفارشات رستوران
export type OrderStatus = "pending" | "preparing" | "ready" | "served" | "cancelled";

export type OrderType = {
  id: number;
  status: OrderStatus;
  orderTime: string;
  estimatedTime?: string;
};

// تابع دریافت سفارشات
export async function getOrders(): Promise<OrderType[]> {
  // شبیه‌سازی تاخیر شبکه
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return [
    {
      id: 101,
      status: "ready",
      orderTime: "۱۲:۴۵",
      estimatedTime: "۵ دقیقه",
    },
    {
      id: 102,
      status: "preparing",
      orderTime: "۱۲:۵۰",
      estimatedTime: "۱۵ دقیقه",
    },
    {
      id: 103,
      status: "pending",
      orderTime: "۱۲:۵۵",
      estimatedTime: "۲۵ دقیقه",
    },
    {
      id: 104,
      status: "served",
      orderTime: "۱۲:۳۰",
    }
  ];
}

// تابع تغییر وضعیت سفارش
export async function updateOrderStatus(orderId: number, status: OrderStatus): Promise<boolean> {
  console.log(`تغییر وضعیت سفارش ${orderId} به ${status}`);
  await new Promise(resolve => setTimeout(resolve, 200));
  return true;
}