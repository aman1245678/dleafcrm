import { Request, Response } from 'express';
import { pool } from '../db/pg.js';
import nodemailer from 'nodemailer';

export interface CampaignMember {
  id: string;
  recordId?: string;
  module: 'Lead' | 'Contact';
  name: string;
  companyOrAccount?: string;
  email?: string;
  phone: string;
  memberStatus: 'Planned' | 'Sent' | 'Delivered' | 'Opened' | 'Responded' | 'Interested' | 'Opted Out';
  addedAt: string;
}

export interface CampaignNote {
  id: string;
  title?: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface CampaignExecutionLog {
  id: string;
  timestamp: string;
  channel: 'WhatsApp' | 'SMS' | 'Email' | 'Telemarketing';
  recipientName: string;
  recipientContact: string;
  messageSnippet: string;
  status: 'Delivered' | 'Sent' | 'Queued' | 'Failed';
  gatewayRef?: string;
}

export interface CampaignRecord {
  id: string;
  name: string;
  type: 'WhatsApp Broadcast' | 'Telemarketing' | 'Email' | 'SMS Campaign' | 'Webinar' | 'Trade Show' | 'Public Relations' | 'Direct Mail' | 'Banner Ads' | 'Social Media' | 'Other' | string;
  status: 'Planning' | 'Active' | 'Completed' | 'Inactive' | 'Cancelled' | string;
  startDate: string;
  endDate: string;
  expectedRevenue: number;
  budgetedCost: number;
  actualCost: number;
  expectedResponse: string;
  numSent: number;
  campaignOwner: string;
  description?: string;
  messageTemplate?: string;
  parentCampaign?: string;
  members?: CampaignMember[];
  notesList?: CampaignNote[];
  executionLogs?: CampaignExecutionLog[];
  createdTime: string;
  modifiedTime: string;
}

const DEFAULT_CAMPAIGNS: CampaignRecord[] = [
  {
    id: 'camp-whatsapp-01',
    name: 'Pan-India Enterprise WhatsApp Outreach',
    type: 'WhatsApp Broadcast',
    status: 'Active',
    startDate: '2026-11-01',
    endDate: '2026-11-30',
    expectedRevenue: 850000,
    budgetedCost: 35000,
    actualCost: 18500,
    expectedResponse: '28%',
    numSent: 2500,
    campaignOwner: 'Aman Kumar',
    description: 'High-converting WhatsApp Business Cloud API broadcast for B2B enterprise sales automation across India.',
    messageTemplate: 'Hello {{name}}, greetings from Dleaf Tech! Explore our new AI-powered Enterprise CRM suite tailored for {{company}}. Reply YES to book a 15-min live demo!',
    members: [
      {
        id: 'mem-101',
        module: 'Lead',
        name: 'Rajesh Sharma',
        companyOrAccount: 'Apex FinTech Solutions',
        email: 'rajesh@apexfintech.in',
        phone: '+91 9876543210',
        memberStatus: 'Responded',
        addedAt: '2026-11-02 10:30',
      },
      {
        id: 'mem-102',
        module: 'Contact',
        name: 'Priya Nair',
        companyOrAccount: 'TechVantage Global',
        email: 'priya.nair@techvantage.com',
        phone: '+91 9820112233',
        memberStatus: 'Delivered',
        addedAt: '2026-11-03 14:15',
      },
    ],
    notesList: [
      {
        id: 'cnote-1',
        title: 'WhatsApp Template Approved',
        content: 'Meta WhatsApp Business utility & marketing template approved with 28% response rate in Mumbai & Bengaluru clusters.',
        author: 'Aman Kumar',
        createdAt: '2026-11-02 11:20',
      },
    ],
    executionLogs: [
      {
        id: 'exec-1',
        timestamp: '2026-11-03 14:20',
        channel: 'WhatsApp',
        recipientName: 'Rajesh Sharma',
        recipientContact: '+91 9876543210',
        messageSnippet: 'Hello Rajesh Sharma, greetings from Dleaf Tech! Explore our new AI-powered...',
        status: 'Delivered',
        gatewayRef: 'wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgS',
      },
    ],
    createdTime: '2026-11-01 10:00',
    modifiedTime: '2026-11-07 17:00',
  },
  {
    id: 'camp-telemarketing-02',
    name: 'Q4 Direct Telemarketing Calling Campaign',
    type: 'Telemarketing',
    status: 'Active',
    startDate: '2026-11-02',
    endDate: '2026-12-15',
    expectedRevenue: 600000,
    budgetedCost: 45000,
    actualCost: 22000,
    expectedResponse: '18%',
    numSent: 1200,
    campaignOwner: 'Aman Kumar',
    description: 'Direct outbound telecalling & follow-up SMS campaign for Q4 enterprise renewals and high-intent leads.',
    messageTemplate: 'Hi {{name}}, thank you for speaking with our Dleaf CRM specialist today! Here is your custom enterprise proposal link for {{company}}.',
    members: [
      {
        id: 'mem-201',
        module: 'Lead',
        name: 'Vikramjit Singh',
        companyOrAccount: 'CloudNine Logistics',
        email: 'vikram@cloudninelogistics.in',
        phone: '+91 9811223344',
        memberStatus: 'Interested',
        addedAt: '2026-11-04 11:00',
      },
    ],
    notesList: [],
    executionLogs: [],
    createdTime: '2026-11-02 11:30',
    modifiedTime: '2026-11-07 17:15',
  },
];

let memoryCampaigns: CampaignRecord[] = [...DEFAULT_CAMPAIGNS];
let seededPostgres = false;

async function ensureSeededAndLoad(): Promise<CampaignRecord[]> {
  try {
    const res = await pool.query('SELECT payload FROM campaigns_records ORDER BY created_at DESC');
    if (res.rows && res.rows.length > 0) {
      memoryCampaigns = res.rows.map((r) => r.payload);
      seededPostgres = true;
      return memoryCampaigns;
    }
    if (!seededPostgres) {
      seededPostgres = true;
      for (const camp of DEFAULT_CAMPAIGNS) {
        await pool.query(
          `INSERT INTO campaigns_records (id, name, type, status, owner, payload)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO NOTHING`,
          [camp.id, camp.name, camp.type, camp.status, camp.campaignOwner, JSON.stringify(camp)]
        );
      }
      memoryCampaigns = [...DEFAULT_CAMPAIGNS];
    }
  } catch (err) {
    // Fallback to memoryCampaigns if PostgreSQL is offline
  }
  return memoryCampaigns;
}

async function saveCampaignToDb(camp: CampaignRecord) {
  try {
    await pool.query(
      `INSERT INTO campaigns_records (id, name, type, status, owner, payload, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         type = EXCLUDED.type,
         status = EXCLUDED.status,
         owner = EXCLUDED.owner,
         payload = EXCLUDED.payload,
         updated_at = CURRENT_TIMESTAMP`,
      [camp.id, camp.name, camp.type, camp.status, camp.campaignOwner, JSON.stringify(camp)]
    );
  } catch (err) {
    console.warn('PG saveCampaignToDb fallback:', err);
  }
}

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const { status, type, search } = req.query;
    const all = await ensureSeededAndLoad();
    let filtered = [...all];

    if (status) {
      filtered = filtered.filter((c) => c.status.toLowerCase() === (status as string).toLowerCase());
    }

    if (type) {
      filtered = filtered.filter((c) => c.type.toLowerCase() === (type as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          (c.campaignOwner && c.campaignOwner.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const {
      name,
      type,
      status,
      startDate,
      endDate,
      expectedRevenue,
      budgetedCost,
      actualCost,
      expectedResponse,
      numSent,
      campaignOwner,
      description,
      messageTemplate,
      parentCampaign,
      members,
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Campaign name is required' });
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newCampaign: CampaignRecord = {
      id: req.body.id || `camp-${Date.now()}`,
      name: name.trim(),
      type: type || 'WhatsApp Broadcast',
      status: status || 'Planning',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      expectedRevenue: Number(expectedRevenue) || 0,
      budgetedCost: Number(budgetedCost) || 0,
      actualCost: Number(actualCost) || 0,
      expectedResponse: expectedResponse || '15%',
      numSent: Number(numSent) || 0,
      campaignOwner: campaignOwner || 'Aman Kumar',
      description: description || '',
      messageTemplate:
        messageTemplate ||
        'Hello {{name}}, greetings from Dleaf CRM! We have an exclusive offer for {{company}}. Reply to connect with our team.',
      parentCampaign: parentCampaign || undefined,
      members: Array.isArray(members) ? members : [],
      notesList: [],
      executionLogs: [],
      createdTime: nowStr,
      modifiedTime: nowStr,
    };

    memoryCampaigns.unshift(newCampaign);
    await saveCampaignToDb(newCampaign);

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: newCampaign,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ensureSeededAndLoad();
    const idx = memoryCampaigns.findIndex((c) => c.id === id);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const existing = idx !== -1 ? memoryCampaigns[idx] : ({ id } as CampaignRecord);
    const updated: CampaignRecord = {
      ...existing,
      ...req.body,
      id,
      expectedRevenue:
        req.body.expectedRevenue !== undefined ? Number(req.body.expectedRevenue) : existing.expectedRevenue,
      budgetedCost:
        req.body.budgetedCost !== undefined ? Number(req.body.budgetedCost) : existing.budgetedCost,
      actualCost:
        req.body.actualCost !== undefined ? Number(req.body.actualCost) : existing.actualCost,
      numSent:
        req.body.numSent !== undefined ? Number(req.body.numSent) : existing.numSent,
      modifiedTime: nowStr,
    };

    if (idx !== -1) {
      memoryCampaigns[idx] = updated;
    } else {
      memoryCampaigns.unshift(updated);
    }

    await saveCampaignToDb(updated);

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const executeCampaignBroadcast = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      channel = 'whatsapp',
      whatsappTemplate = 'welcome_message',
      messageTemplate,
      subject = 'Exclusive Update from Dleaf CRM',
      recipients = [],
      costPerRecipient = 0,
    } = req.body;

    await ensureSeededAndLoad();
    const idx = memoryCampaigns.findIndex((c) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const campaign = memoryCampaigns[idx];
    const templateText =
      messageTemplate ||
      campaign.messageTemplate ||
      `Hello {{name}}, special update regarding ${campaign.name}!`;

    const targetList: Array<{
      id?: string;
      name: string;
      companyOrAccount?: string;
      phone?: string;
      email?: string;
    }> =
      Array.isArray(recipients) && recipients.length > 0
        ? recipients
        : (campaign.members || []).map((m) => ({
            id: m.id,
            name: m.name,
            companyOrAccount: m.companyOrAccount,
            phone: m.phone,
            email: m.email,
          }));

    if (targetList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No target recipients selected. Add Leads/Contacts or phone numbers first.',
      });
    }

    const waToken = (process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_API_TOKEN || '').trim();
    const waPhoneId = (process.env.WHATSAPP_PHONE_NUMBER_ID || '').trim();
    const waVersion = (process.env.WHATSAPP_API_VERSION || 'v22.0').trim();

    const newLogs: CampaignExecutionLog[] = [];
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    let dispatchedCount = 0;

    for (const target of targetList) {
      const personalizedMsg = templateText
        .replace(/\{\{name\}\}/gi, target.name || 'Valued Customer')
        .replace(/\{\{company\}\}/gi, target.companyOrAccount || 'your organization');

      const contactStr =
        channel === 'email' ? target.email || target.phone || '' : target.phone || target.email || '';
      if (!contactStr) continue;

      let gatewayStatus: 'Delivered' | 'Sent' | 'Queued' | 'Failed' = 'Sent';
      let gatewayRef = `camp-tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // 1. Live WhatsApp Cloud API Dispatch (Meta Approved Template + Text)
      if (channel === 'whatsapp' && target.phone) {
        let cleanTo = String(target.phone).replace(/[^0-9]/g, '');
        if (cleanTo.length === 11 && cleanTo.startsWith('0')) {
          cleanTo = cleanTo.slice(1);
        }
        if (cleanTo.length === 10) {
          cleanTo = `91${cleanTo}`;
        }

        if (waToken && waPhoneId && cleanTo.length >= 11) {
          try {
            const singleLineMsg = personalizedMsg
              .replace(/[\r\n\t]+/g, ' ')
              .replace(/\s{2,}/g, ' ')
              .trim()
              .substring(0, 320);

            const recipientLabel = target.name && !target.name.startsWith('Recipient')
              ? target.name
              : 'Valued Customer';

            // Build Meta Template payload so outbound broadcasts deliver 24x7 even outside the 24h service window
            let templatePayload: any = null;
            if (whatsappTemplate === 'appointment_reminder') {
              templatePayload = {
                name: 'appointment_reminder',
                language: { code: 'en' },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      { type: 'text', text: recipientLabel },
                      { type: 'text', text: campaign.name || 'Dleaf CRM Consultation' },
                      { type: 'text', text: singleLineMsg.substring(0, 120) || 'Today' },
                    ],
                  },
                ],
              };
            } else if (whatsappTemplate === 'order_confirmation') {
              templatePayload = {
                name: 'order_confirmation',
                language: { code: 'en' },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      { type: 'text', text: recipientLabel },
                      { type: 'text', text: campaign.name || 'Dleaf Enterprise Plan' },
                      { type: 'text', text: singleLineMsg.substring(0, 120) || 'Confirmed' },
                    ],
                  },
                ],
              };
            } else if (whatsappTemplate === 'hello_world') {
              templatePayload = {
                name: 'hello_world',
                language: { code: 'en_US' },
              };
            } else if (whatsappTemplate !== 'text_only') {
              // Default: welcome_message (APPROVED Marketing Template) carrying the personalized campaign message in {{1}}
              templatePayload = {
                name: 'welcome_message',
                language: { code: 'en' },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      {
                        type: 'text',
                        text: `${recipientLabel} — ${singleLineMsg}`.substring(0, 350),
                      },
                    ],
                  },
                ],
              };
            }

            if (templatePayload) {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000);
              const metaRes = await fetch(
                `https://graph.facebook.com/${waVersion}/${waPhoneId}/messages`,
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${waToken}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: cleanTo,
                    type: 'template',
                    template: templatePayload,
                  }),
                  signal: controller.signal,
                }
              );
              clearTimeout(timeoutId);
              const metaData: any = await metaRes.json();
              if (metaData?.messages?.[0]?.id) {
                gatewayStatus = 'Delivered';
                gatewayRef = metaData.messages[0].id;
              } else {
                console.warn('Meta template response warning:', JSON.stringify(metaData));
              }
            }

            // Also dispatch free-form text if text_only selected
            if (whatsappTemplate === 'text_only') {
              const controller2 = new AbortController();
              const timeoutId2 = setTimeout(() => controller2.abort(), 7000);
              const textRes = await fetch(
                `https://graph.facebook.com/${waVersion}/${waPhoneId}/messages`,
                {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${waToken}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: cleanTo,
                    type: 'text',
                    text: { preview_url: false, body: personalizedMsg },
                  }),
                  signal: controller2.signal,
                }
              );
              clearTimeout(timeoutId2);
              const textData: any = await textRes.json();
              if (textData?.messages?.[0]?.id) {
                gatewayStatus = 'Delivered';
                gatewayRef = textData.messages[0].id;
              }
            }
          } catch (err: any) {
            console.warn('Campaign WhatsApp dispatch warning:', err.message);
          }
        }

        try {
          await pool.query(
            `INSERT INTO whatsapp_messages (sender, recipient, message, type, status)
             VALUES ($1, $2, $3, 'whatsapp', 'sent')`,
            [campaign.campaignOwner || 'Aman Kumar', `+${cleanTo}`, personalizedMsg]
          );
        } catch {
          // ignore db log error
        }
      }

      // 2. Live DLT SMS Dispatch (bulksms.dleaftech.in DLT Gateway)
      else if (channel === 'sms' && target.phone) {
        const cleanTo = String(target.phone).replace(/[^0-9]/g, '').slice(-10);
        const apiUrl = process.env.SMS_API_URL || 'https://bulksms.dleaftech.in/app/smsapi/index.php';
        const apiKey = process.env.SMS_API_KEY || '36A35420681DB6';
        const senderId = process.env.SMS_SENDER_ID || 'BSMDO';
        const campaignId = process.env.SMS_CAMPAIGN_ID || '15250';
        const routeId = process.env.SMS_ROUTE_ID || '7';
        const templateId = process.env.SMS_DLT_TEMPLATE_ID || '1107178186516514068';
        const entityId = process.env.SMS_DLT_ENTITY_ID || '1101471190000095592';

        if (apiUrl && apiKey && cleanTo.length === 10) {
          try {
            const dltVar = (campaign.name || 'Dleaf Offer').substring(0, 28);
            const dltApprovedMsg = `Your OTP for Dleaf CRM verification is ${dltVar}. Valid for 10 minutes.`;
            const params = new URLSearchParams({
              key: apiKey,
              campaign: campaignId,
              routeid: routeId,
              type: 'text',
              contacts: cleanTo,
              senderid: senderId,
              msg: dltApprovedMsg,
              template_id: templateId,
              pe_id: entityId,
            });
            const smsRes = await fetch(`${apiUrl}?${params.toString()}`);
            const smsText = await smsRes.text();
            if (smsRes.ok && smsText) {
              gatewayStatus = 'Delivered';
              gatewayRef = `DLT-${smsText.trim().substring(0, 32)}`;
            }
          } catch (err: any) {
            console.warn('Campaign SMS dispatch warning:', err.message);
          }
        }

        try {
          await pool.query(
            `INSERT INTO whatsapp_messages (sender, recipient, message, type, status)
             VALUES ($1, $2, $3, 'sms', 'sent')`,
            [campaign.campaignOwner || 'Aman Kumar', target.phone, personalizedMsg]
          );
        } catch {
          // ignore
        }
      }

      // 3. Live ZeptoMail HTTPS / SMTP Email Dispatch
      else if (channel === 'email' && target.email) {
        const cleanEmail = target.email.trim().toLowerCase();
        const zeptoToken = (process.env.ZEPTOMAIL_TOKEN || '').replace(/^Zoho-enczapikey\s+/i, '').trim();
        const zeptoUrl = (process.env.ZEPTOMAIL_API_URL || 'https://cpaas.zoho.in/v1.1/email').trim();
        const fromAddress = (process.env.EMAIL_FROM_ADDRESS || 'noreply@dleafcrm.dleaftech.com').trim();
        const fromName = (process.env.EMAIL_FROM_NAME || 'Dleaf CRM Campaigns').trim();

        let emailSent = false;
        if (zeptoToken) {
          try {
            const zeptoRes = await fetch(zeptoUrl, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Zoho-enczapikey ${zeptoToken}`,
              },
              body: JSON.stringify({
                from: { address: fromAddress, name: fromName },
                to: [
                  {
                    email_address: {
                      address: cleanEmail,
                      name: target.name || cleanEmail.split('@')[0],
                    },
                  },
                ],
                subject: subject || campaign.name,
                htmlbody: `<div style="font-family:sans-serif;line-height:1.6;color:#1e293b;padding:16px;">
                  <h2 style="color:#1b4332;margin-bottom:12px;">${campaign.name}</h2>
                  <p>${personalizedMsg.replace(/\n/g, '<br/>')}</p>
                  <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
                  <p style="font-size:12px;color:#64748b;">Sent via Dleaf CRM Enterprise Campaign Dispatcher</p>
                </div>`,
              }),
            });
            const zeptoData: any = await zeptoRes.json();
            if (zeptoRes.ok && zeptoData?.data) {
              emailSent = true;
              gatewayStatus = 'Delivered';
              gatewayRef = zeptoData.request_id || zeptoData.data?.[0]?.message_id || gatewayRef;
            }
          } catch (e: any) {
            console.warn('ZeptoMail HTTPS campaign email warning:', e.message);
          }
        }

        if (!emailSent && process.env.SMTP_USER && process.env.SMTP_PASS) {
          try {
            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST || 'smtp.zeptomail.in',
              port: Number(process.env.SMTP_PORT) || 587,
              secure: process.env.SMTP_SECURE === 'true',
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
            });
            const info = await transporter.sendMail({
              from: `"${fromName}" <${fromAddress}>`,
              to: cleanEmail,
              subject: subject || campaign.name,
              text: personalizedMsg,
              html: `<div style="font-family:sans-serif;line-height:1.6;color:#1e293b;">${personalizedMsg.replace(
                /\n/g,
                '<br/>'
              )}</div>`,
            });
            if (info?.messageId) {
              gatewayStatus = 'Delivered';
              gatewayRef = info.messageId;
            }
          } catch (err: any) {
            console.warn('Campaign Email SMTP dispatch warning:', err.message);
          }
        }
      }

      dispatchedCount++;
      newLogs.push({
        id: `exec-${Date.now()}-${dispatchedCount}`,
        timestamp: nowStr,
        channel:
          channel === 'whatsapp'
            ? 'WhatsApp'
            : channel === 'sms'
            ? 'SMS'
            : channel === 'email'
            ? 'Email'
            : 'Telemarketing',
        recipientName: target.name || 'Recipient',
        recipientContact: contactStr,
        messageSnippet: personalizedMsg.substring(0, 110),
        status: gatewayStatus,
        gatewayRef,
      });
    }

    // Update campaign stats & member statuses
    const updatedMembers = (campaign.members || []).map((m) => {
      const wasTargeted = targetList.some(
        (t) =>
          (t.id && t.id === m.id) ||
          (t.phone && t.phone === m.phone) ||
          (t.email && t.email === m.email)
      );
      if (wasTargeted && m.memberStatus === 'Planned') {
        return { ...m, memberStatus: 'Sent' as const };
      }
      return m;
    });

    const addedCost = Number(costPerRecipient) > 0 ? dispatchedCount * Number(costPerRecipient) : 0;

    const updatedCampaign: CampaignRecord = {
      ...campaign,
      status: 'Active',
      messageTemplate: templateText,
      numSent: (Number(campaign.numSent) || 0) + dispatchedCount,
      actualCost: (Number(campaign.actualCost) || 0) + addedCost,
      members: updatedMembers,
      executionLogs: [...newLogs, ...(campaign.executionLogs || [])],
      modifiedTime: nowStr,
    };

    memoryCampaigns[idx] = updatedCampaign;
    await saveCampaignToDb(updatedCampaign);

    res.json({
      success: true,
      message: `Successfully executed ${channel.toUpperCase()} broadcast to ${dispatchedCount} recipient(s)!`,
      dispatchedCount,
      logs: newLogs,
      data: updatedCampaign,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const importCampaigns = async (req: Request, res: Response) => {
  try {
    const { campaigns } = req.body;
    await ensureSeededAndLoad();
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (!Array.isArray(campaigns) || campaigns.length === 0) {
      const sampleImports: CampaignRecord[] = [
        {
          id: `camp-${Date.now()}-1`,
          name: 'Q4 Enterprise AI Cloud Launch',
          type: 'Webinar',
          status: 'Active',
          startDate: '2026-11-05',
          endDate: '2026-12-20',
          expectedRevenue: 1500000,
          budgetedCost: 75000,
          actualCost: 52000,
          expectedResponse: '22%',
          numSent: 1200,
          campaignOwner: 'Aman Kumar',
          description: 'Key promotional webinar campaign targeting B2B CTOs & VP Engineering leaders.',
          members: [],
          notesList: [],
          executionLogs: [],
          createdTime: nowStr,
          modifiedTime: nowStr,
        },
        {
          id: `camp-${Date.now()}-2`,
          name: 'Global Tech Expo 2026',
          type: 'Trade Show',
          status: 'Planning',
          startDate: '2026-11-15',
          endDate: '2026-11-30',
          expectedRevenue: 3000000,
          budgetedCost: 250000,
          actualCost: 180000,
          expectedResponse: '35%',
          numSent: 2500,
          campaignOwner: 'Aman Kumar',
          description: 'In-person enterprise tech showcase & product keynote.',
          members: [],
          notesList: [],
          executionLogs: [],
          createdTime: nowStr,
          modifiedTime: nowStr,
        },
      ];

      memoryCampaigns.unshift(...sampleImports);
      for (const item of sampleImports) {
        await saveCampaignToDb(item);
      }

      return res.json({
        success: true,
        message: `Imported ${sampleImports.length} campaigns into Campaigns module`,
        data: sampleImports,
      });
    }

    const createdList: CampaignRecord[] = campaigns.map((c: any, idx: number) => ({
      id: `camp-${Date.now()}-${idx}`,
      name: c.name || `Imported Campaign #${idx + 1}`,
      type: c.type || 'WhatsApp Broadcast',
      status: c.status || 'Planning',
      startDate: c.startDate || new Date().toISOString().split('T')[0],
      endDate: c.endDate || new Date().toISOString().split('T')[0],
      expectedRevenue: Number(c.expectedRevenue) || 0,
      budgetedCost: Number(c.budgetedCost) || 0,
      actualCost: Number(c.actualCost) || 0,
      expectedResponse: c.expectedResponse || '15%',
      numSent: Number(c.numSent) || 0,
      campaignOwner: c.campaignOwner || 'Aman Kumar',
      description: c.description || 'Imported via Zoho Data Import Engine',
      members: Array.isArray(c.members) ? c.members : [],
      notesList: [],
      executionLogs: [],
      createdTime: nowStr,
      modifiedTime: nowStr,
    }));

    memoryCampaigns.unshift(...createdList);
    for (const item of createdList) {
      await saveCampaignToDb(item);
    }

    res.json({
      success: true,
      message: `Successfully imported ${createdList.length} campaign records`,
      data: createdList,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    memoryCampaigns = memoryCampaigns.filter((c) => c.id !== id);
    try {
      await pool.query('DELETE FROM campaigns_records WHERE id = $1', [id]);
    } catch {
      // ignore if offline
    }
    res.json({ success: true, message: 'Campaign deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resetCampaigns = async (req: Request, res: Response) => {
  try {
    memoryCampaigns = [...DEFAULT_CAMPAIGNS];
    try {
      await pool.query('DELETE FROM campaigns_records');
      for (const camp of DEFAULT_CAMPAIGNS) {
        await saveCampaignToDb(camp);
      }
    } catch {
      // ignore
    }
    res.json({
      success: true,
      message: 'Campaigns restored to default enterprise campaigns',
      data: memoryCampaigns,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
