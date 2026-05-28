// D:\adfinder\frontend\adfinder\app\business\[businessId]\components\CustomTab.tsx
import { Globe, Phone, Mail, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { CustomPageData } from '../types';

interface CustomTabProps {
  customPageData: CustomPageData;
}

export default function CustomTab({ customPageData }: CustomTabProps) {
  // آیکون‌های پلتفرم‌ها
  const platformIcons: Record<string, React.ReactNode> = {
    'instagram': <Globe className="w-5 h-5" />,
    'telegram': <Globe className="w-5 h-5" />,
    'whatsapp': <Phone className="w-5 h-5" />,
    'website': <Globe className="w-5 h-5" />,
    'email': <Mail className="w-5 h-5" />,
  };

  return (
    <div className="space-y-6">
      {/* لینک‌های اجتماعی */}
      {customPageData.socialLinks && customPageData.socialLinks.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">لینک‌های ارتباطی</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {customPageData.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
              >
                <div className="text-gray-600">
                  {platformIcons[link.platform] || <LinkIcon className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {link.platform === 'website' ? 'وبسایت' :
                      link.platform === 'instagram' ? 'اینستاگرام' :
                        link.platform === 'telegram' ? 'تلگرام' :
                          link.platform === 'whatsapp' ? 'واتساپ' :
                            link.platform}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{link.url}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* پیشنهادات ویژه */}
      {customPageData.specialOffers && customPageData.specialOffers.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">پیشنهادات ویژه</h3>
          <div className="space-y-3">
            {customPageData.specialOffers.map((offer, index) => (
              <div key={index} className="bg-linear-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <div className="text-lg">🎁</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{offer.title}</h4>
                    <p className="text-gray-600">{offer.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* بخش برای اطلاعات بیشتر */}
      <div>
        <div className="text-center py-8 border-t">
          <p className="text-gray-500 mb-2">این صفحه توسط صاحب کسب‌وکار مدیریت می‌شود</p>
          <p className="text-sm text-gray-400">
            آخرین بروزرسانی: {new Date().toLocaleDateString('fa-IR')}
          </p>
        </div>
      </div>
    </div>
  );
}