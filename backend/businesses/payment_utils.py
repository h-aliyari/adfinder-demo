# D:\adfinder\backend\businesses\payment_utils.py
import json
import urllib.request
import urllib.error
from django.conf import settings

class ZarinpalPayment:
    """
    کلاس مدیریت پرداخت زرین‌پال (بدون نیاز به requests)
    """
    
    # آدرس‌های API زرین‌پال
    SANDBOX = True  # در حالت تست True باشد
    MERCHANT_ID = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"  # مرچنت کد خود را قرار دهید
    
    def __init__(self, merchant_id=None, sandbox=None):
        self.merchant_id = merchant_id or self.MERCHANT_ID
        self.sandbox = sandbox if sandbox is not None else self.SANDBOX
        
        if self.sandbox:
            self.base_url = "https://sandbox.zarinpal.com/pg/rest/WebGate/"
        else:
            self.base_url = "https://www.zarinpal.com/pg/rest/WebGate/"
    
    def _make_request(self, endpoint, data):
        """ایجاد درخواست HTTP با urllib"""
        url = self.base_url + endpoint
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        try:
            # تبدیل دیکشنری به JSON
            json_data = json.dumps(data).encode('utf-8')
            
            # ایجاد درخواست
            req = urllib.request.Request(
                url,
                data=json_data,
                headers=headers,
                method='POST'
            )
            
            # ارسال درخواست
            with urllib.request.urlopen(req) as response:
                response_data = response.read().decode('utf-8')
                return json.loads(response_data)
                
        except urllib.error.URLError as e:
            return {'error': f'خطا در ارتباط با سرور: {str(e)}'}
        except Exception as e:
            return {'error': f'خطای ناشناخته: {str(e)}'}
    
    def create_payment_request(self, amount, description, callback_url, mobile=None, email=None):
        """
        ایجاد درخواست پرداخت
        """
        # تبدیل ریال به تومان (زرین‌پال تومان می‌گیرد)
        amount_in_toman = amount // 10
        
        payload = {
            "MerchantID": self.merchant_id,
            "Amount": amount_in_toman,
            "Description": description,
            "CallbackURL": callback_url,
        }
        
        if mobile:
            payload["Mobile"] = mobile
        if email:
            payload["Email"] = email
        
        result = self._make_request("PaymentRequest.json", payload)
        
        if 'error' in result:
            return {
                'success': False,
                'error': result['error']
            }
        
        if result.get('Status') == 100:
            # موفق
            if self.sandbox:
                payment_url = f"https://sandbox.zarinpal.com/pg/StartPay/{result['Authority']}"
            else:
                payment_url = f"https://www.zarinpal.com/pg/StartPay/{result['Authority']}"
            
            return {
                'success': True,
                'authority': result['Authority'],
                'payment_url': payment_url,
                'message': 'درخواست پرداخت ایجاد شد'
            }
        else:
            # خطا
            error_codes = {
                -1: 'اطلاعات ارسال شده ناقص است',
                -2: 'IP یا مرچنت کد پذیرنده صحیح نیست',
                -3: 'با توجه به محدودیت‌های شاپرک امکان پرداخت با رقم درخواست شده میسر نیست',
                -4: 'سطح تایید پذیرنده پایین‌تر از سطح نقره‌ای است',
                -11: 'درخواست مورد نظر یافت نشد',
                -12: 'امکان ویرایش درخواست میسر نیست',
                -21: 'هیچ نوع عملیات مالی برای این تراکنش یافت نشد',
                -22: 'تراکنش ناموفق می‌باشد',
                -33: 'رقم تراکنش با رقم پرداخت شده مطابقت ندارد',
                -34: 'سقف تقسیم تراکنش از لحاظ تعداد یا رقم عبور نموده است',
                -40: 'اجازه دسترسی به متد مربوطه وجود ندارد',
                -41: 'اطلاعات ارسال شده مربوط به AdditionalData غیرمعتبر می‌باشد',
                -42: 'مدت زمان معتبر طول عمر شناسه پرداخت باید بین ۳۰ دقیقه تا ۴۵ روز باشد',
                -54: 'درخواست مورد نظر آرشیو شده است'
            }
            
            error_message = error_codes.get(result.get('Status'), f'خطای ناشناخته: {result.get("Status")}')
            return {
                'success': False,
                'error': error_message,
                'status_code': result.get('Status')
            }
    
    def verify_payment(self, authority, amount):
        """
        تایید پرداخت
        """
        # تبدیل ریال به تومان
        amount_in_toman = amount // 10
        
        payload = {
            "MerchantID": self.merchant_id,
            "Amount": amount_in_toman,
            "Authority": authority
        }
        
        result = self._make_request("PaymentVerification.json", payload)
        
        if 'error' in result:
            return {
                'success': False,
                'error': result['error']
            }
        
        if result.get('Status') == 100:
            # پرداخت موفق
            return {
                'success': True,
                'ref_id': result.get('RefID'),
                'message': 'پرداخت با موفقیت انجام شد'
            }
        elif result.get('Status') == 101:
            # قبلاً تایید شده
            return {
                'success': True,
                'ref_id': result.get('RefID'),
                'message': 'این پرداخت قبلاً تایید شده است'
            }
        else:
            # خطا در تایید
            error_codes = {
                -1: 'اطلاعات ارسال شده ناقص است',
                -2: 'IP یا مرچنت کد پذیرنده صحیح نیست',
                -3: 'با توجه به محدودیت‌های شاپرک امکان پرداخت با رقم درخواست شده میسر نیست',
                -4: 'سطح تایید پذیرنده پایین‌تر از سطح نقره‌ای است',
                -11: 'درخواست مورد نظر یافت نشد',
                -12: 'امکان ویرایش درخواست میسر نیست',
                -21: 'هیچ نوع عملیات مالی برای این تراکنش یافت نشد',
                -22: 'تراکنش ناموفق می‌باشد',
                -33: 'رقم تراکنش با رقم پرداخت شده مطابقت ندارد',
                -34: 'سقف تقسیم تراکنش از لحاظ تعداد یا رقم عبور نموده است',
                -40: 'اجازه دسترسی به متد مربوطه وجود ندارد',
                -41: 'اطلاعات ارسال شده مربوط به AdditionalData غیرمعتبر می‌باشد',
                -42: 'مدت زمان معتبر طول عمر شناسه پرداخت باید بین ۳۰ دقیقه تا ۴۵ روز باشد',
                -54: 'درخواست مورد نظر آرشیو شده است',
                -51: 'تراکنش ناموفق',
                -52: 'خطای غیرمنتظره',
                -53: 'اتصال به درگاه برقرار نشد',
            }
            
            error_message = error_codes.get(result.get('Status'), f'خطای ناشناخته: {result.get("Status")}')
            return {
                'success': False,
                'error': error_message,
                'status_code': result.get('Status')
            }


# تابع اصلی برای استفاده در views
def create_zarinpal_payment(amount, description, callback_url, mobile=None, email=None):
    """
    ایجاد درخواست پرداخت زرین‌پال
    """
    zarinpal = ZarinpalPayment()
    return zarinpal.create_payment_request(
        amount=amount,
        description=description,
        callback_url=callback_url,
        mobile=mobile,
        email=email
    )

def verify_zarinpal_payment(authority, amount):
    """
    تایید پرداخت زرین‌پال
    """
    zarinpal = ZarinpalPayment()
    return zarinpal.verify_payment(authority, amount)