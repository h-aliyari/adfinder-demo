// D:\adfinder\frontend\adfinder\app\business\[businessId]\components\InfoTab.tsx
import { MapPin, Navigation } from 'lucide-react';
import { Business } from '../../services/types';
import { CustomPageData } from '../types';

interface InfoTabProps {
  business: Business;
  customPageData: CustomPageData | null;
  onOpenMap: () => void;
}

export default function InfoTab({ business, customPageData, onOpenMap }: InfoTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(customPageData?.address || business.address) && (
            <button
              onClick={onOpenMap}
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition text-right"
            >
              <MapPin className="w-5 h-5 text-purple-600 shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">مشاهده روی نقشه</div>
                <div className="text-sm text-gray-500 truncate">
                  {customPageData?.address || business.address}
                </div>
              </div>
            </button>
          )}

          <button
            onClick={onOpenMap}
            className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl hover:bg-amber-100 transition text-right"
          >
            <Navigation className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <div className="font-medium text-gray-900">لینک های ارتباطی</div>
              <div className="text-sm text-gray-500">لیست لینک ها : </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}