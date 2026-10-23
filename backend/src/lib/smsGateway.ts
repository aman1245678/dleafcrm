import dotenv from 'dotenv';
dotenv.config();

export interface SmsSendResult {
  success: boolean;
  message: string;
  responseRaw?: any;
}

export async function sendMobileOtpSms(mobileNumber: string, otp: string): Promise<SmsSendResult> {
  const cleanMobile = mobileNumber.replace(/[^0-9]/g, '').slice(-10); // Standard 10-digit Indian Mobile
  const apiUrl = process.env.SMS_API_URL || 'https://bulksms.dleaf.in/app/smsapi/index.php';
  const apiKey = process.env.SMS_API_KEY || '36A35420681DB6';
  const senderId = process.env.SMS_SENDER_ID || 'BSMDO';
  const campaignId = process.env.SMS_CAMPAIGN_ID || '15250';
  const routeId = process.env.SMS_ROUTE_ID || '7';
  const templateId = process.env.SMS_DLT_TEMPLATE_ID || '1107178186516514068';
  const entityId = process.env.SMS_DLT_ENTITY_ID || '1101471190000095592';

  // Standard DLT Template message: e.g. "Your OTP for login is {#var#}. Valid for 10 minutes. Dleaf"
  const messageText = `Your OTP for Dleaf CRM verification is ${otp}. Valid for 10 minutes.`;

  try {
    const params = new URLSearchParams({
      key: apiKey,
      campaign: campaignId,
      routeid: routeId,
      type: 'text',
      contacts: cleanMobile,
      senderid: senderId,
      msg: messageText,
      template_id: templateId,
      pe_id: entityId,
    });

    const fullUrl = `${apiUrl}?${params.toString()}`;
    const response = await fetch(fullUrl, {
      method: 'GET',
    });

    const text = await response.text();
    console.log(`📡 [BulkSMS API Response for ${cleanMobile}]:`, text);

    return {
      success: true,
      message: `OTP SMS dispatched to +91 ${cleanMobile}`,
      responseRaw: text,
    };
  } catch (err: any) {
    console.error('⚠️ [BulkSMS Error]:', err.message);
    return {
      success: false,
      message: err.message || 'Failed to dispatch SMS through gateway',
    };
  }
}
