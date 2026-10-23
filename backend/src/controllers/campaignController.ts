import { Request, Response } from 'express';

export interface CampaignRecord {
  id: string;
  name: string;
  type: 'Telemarketing' | 'Email' | 'Webinar' | 'Trade Show' | 'Public Relations' | 'Direct Mail' | 'Banner Ads' | 'Other';
  status: 'Planning' | 'Active' | 'Completed' | 'Cancelled';
  startDate: string;
  endDate: string;
  expectedRevenue: number;
  budgetedCost: number;
  actualCost: number;
  expectedResponse: string;
  numSent: number;
  campaignOwner: string;
  description?: string;
  createdTime: string;
  modifiedTime: string;
}

// In-memory campaign storage initialized to empty to match Zoho Screenshot 1
let memoryCampaigns: CampaignRecord[] = [];

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const { status, type, search } = req.query;

    let filtered = [...memoryCampaigns];

    if (status) {
      filtered = filtered.filter((c) => c.status.toLowerCase() === (status as string).toLowerCase());
    }

    if (type) {
      filtered = filtered.filter((c) => c.type.toLowerCase() === (type as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(q));
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
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Campaign name is required' });
    }

    const newCampaign: CampaignRecord = {
      id: `camp-${Date.now()}`,
      name: name.trim(),
      type: type || 'Telemarketing',
      status: status || 'Planning',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      expectedRevenue: Number(expectedRevenue) || 0,
      budgetedCost: Number(budgetedCost) || 0,
      actualCost: Number(actualCost) || 0,
      expectedResponse: expectedResponse || '15%',
      numSent: Number(numSent) || 0,
      campaignOwner: campaignOwner || 'Aman kumar',
      description: description || '',
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    memoryCampaigns.unshift(newCampaign);

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: newCampaign,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const importCampaigns = async (req: Request, res: Response) => {
  try {
    const { campaigns } = req.body;

    if (!Array.isArray(campaigns) || campaigns.length === 0) {
      // Default sample import if empty
      const sampleImports: CampaignRecord[] = [
        {
          id: `camp-${Date.now()}-1`,
          name: 'Q4 Enterprise AI Cloud Launch',
          type: 'Webinar',
          status: 'Active',
          startDate: '2026-10-15',
          endDate: '2026-11-30',
          expectedRevenue: 1500000,
          budgetedCost: 75000,
          actualCost: 52000,
          expectedResponse: '22%',
          numSent: 1200,
          campaignOwner: 'Aman kumar',
          description: 'Key promotional webinar campaign targeting B2B CTOs',
          createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
          modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
        {
          id: `camp-${Date.now()}-2`,
          name: 'Global Tech Expo 2026',
          type: 'Trade Show',
          status: 'Planning',
          startDate: '2026-11-10',
          endDate: '2026-11-14',
          expectedRevenue: 3000000,
          budgetedCost: 250000,
          actualCost: 180000,
          expectedResponse: '35%',
          numSent: 2500,
          campaignOwner: 'Aman kumar',
          description: 'In-person tech showcase & keynote presentation',
          createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
          modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ];

      memoryCampaigns.unshift(...sampleImports);

      return res.json({
        success: true,
        message: `Imported ${sampleImports.length} sample campaigns into Campaigns module`,
        data: sampleImports,
      });
    }

    const createdList: CampaignRecord[] = campaigns.map((c: any, idx: number) => ({
      id: `camp-${Date.now()}-${idx}`,
      name: c.name || `Imported Campaign #${idx + 1}`,
      type: c.type || 'Telemarketing',
      status: c.status || 'Planning',
      startDate: c.startDate || new Date().toISOString().split('T')[0],
      endDate: c.endDate || new Date().toISOString().split('T')[0],
      expectedRevenue: Number(c.expectedRevenue) || 0,
      budgetedCost: Number(c.budgetedCost) || 0,
      actualCost: Number(c.actualCost) || 0,
      expectedResponse: c.expectedResponse || '10%',
      numSent: Number(c.numSent) || 0,
      campaignOwner: c.campaignOwner || 'Aman kumar',
      description: c.description || 'Imported via Zoho Data Import Engine',
      createdTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      modifiedTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
    }));

    memoryCampaigns.unshift(...createdList);

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
    const idx = memoryCampaigns.findIndex((c) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    memoryCampaigns.splice(idx, 1);
    res.json({ success: true, message: 'Campaign deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resetCampaigns = async (req: Request, res: Response) => {
  try {
    memoryCampaigns = [];
    res.json({ success: true, message: 'Campaigns reset to initial empty state' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
