// D:\adfinder\frontend\adfinder\app\home-2\user-waiting\services\api.ts
import { OrderDetails, OrderStep, OrderItem } from '../types/order';

// سرویس API برای سفارش‌ها
class OrderApiService {
  // دیتای موقتی برای توسعه
  private mockOrderData: OrderDetails = {
    orderNumber: `1234`,
    orderDate: new Date().toLocaleDateString('fa-IR'),
    estimatedTotalTime: 45,
    currentStep: 2,
    steps: [
      {
        id: 1,
        name: 'ثبت سفارش',
        description: 'سفارش شما ثبت شد',
        icon: 'Package',
        isCompleted: true,
        isCurrent: false,
        estimatedDuration: 5
      },
      {
        id: 2,
        name: 'آماده‌سازی',
        description: 'در حال آماده‌سازی',
        icon: 'Clock',
        isCompleted: true,
        isCurrent: true,
        estimatedDuration: 20
      },
      {
        id: 3,
        name: 'بسته‌بندی',
        description: 'بسته‌بندی شده',
        icon: 'Truck',
        isCompleted: false,
        isCurrent: false,
        estimatedDuration: 10
      },
      {
        id: 4,
        name: 'تحویل',
        description: 'تحویل نهایی',
        icon: 'CheckCircle',
        isCompleted: false,
        isCurrent: false,
        estimatedDuration: 10
      }
    ],
    items: [
      
    ]
  };

  // شبیه‌سازی تاخیر API
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // دریافت اطلاعات سفارش
  async getOrderDetails(orderId?: string): Promise<OrderDetails> {
    // شبیه‌سازی تاخیر شبکه
    await this.delay(300);
    
    // اگر orderId داشته باشیم، می‌توانیم از آن استفاده کنیم
    if (orderId) {
      this.mockOrderData.orderNumber = orderId;
    }
    
    return { ...this.mockOrderData };
  }

  // محاسبه زمان باقی‌مانده
  calculateRemainingTime(order: OrderDetails): number {
    const remainingSteps = order.steps.filter(step => !step.isCompleted && !step.isCurrent);
    return remainingSteps.reduce((total, step) => total + (step.estimatedDuration || 0), 0);
  }
}

// ایجاد یک نمونه از سرویس
export const orderApi = new OrderApiService();