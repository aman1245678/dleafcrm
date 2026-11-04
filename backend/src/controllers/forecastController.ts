import { Request, Response } from 'express';
import { memoryDeals } from './dealController.js';
import { prisma, isPrismaConnected } from '../db/prisma.js';

export interface ForecastConfig {
  forecastModel: 'Top down' | 'Bottom up';
  hierarchyBasedOn: 'Roles' | 'Territory';
  dealRevenue: boolean;
  dealQuantity: boolean;
  fiscalYearType: 'Standard Fiscal Year' | 'Custom Fiscal Year';
  fiscalYearBeginsIn: string; // January
  isConfigured: boolean;
  setBy?: string;
  configuredAt?: string;
}

export interface TargetQuotaItem {
  id: string;
  roleOrUser: string;
  period: string; // e.g. Q4 2026, Full Year 2026
  targetAmount: number;
  achievedAmount: number;
  pipelineCommit: number;
  bestCase: number;
  dealsCount: number;
}

// Default Configuration: January to December Fiscal Year, Top down model, Roles hierarchy
let memoryForecastConfig: ForecastConfig = {
  forecastModel: 'Top down',
  hierarchyBasedOn: 'Roles',
  dealRevenue: true,
  dealQuantity: true,
  fiscalYearType: 'Standard Fiscal Year',
  fiscalYearBeginsIn: 'January',
  isConfigured: true,
  setBy: 'Aman kumar',
  configuredAt: new Date().toISOString(),
};

let memoryTargetQuotas: TargetQuotaItem[] = [
  {
    id: 'quota-ceo',
    roleOrUser: 'CEO / Managing Director (Global Target)',
    period: 'FY 2026 (Jan - Dec)',
    targetAmount: 2500000,
    achievedAmount: 0,
    pipelineCommit: 0,
    bestCase: 0,
    dealsCount: 0,
  },
  {
    id: 'quota-sales-head',
    roleOrUser: 'Aman kumar (Sales Head / Manager)',
    period: 'FY 2026 (Jan - Dec)',
    targetAmount: 1500000,
    achievedAmount: 0,
    pipelineCommit: 0,
    bestCase: 0,
    dealsCount: 0,
  },
  {
    id: 'quota-sales-reps',
    roleOrUser: 'Enterprise Sales Executives / Reps',
    period: 'FY 2026 (Jan - Dec)',
    targetAmount: 1000000,
    achievedAmount: 0,
    pipelineCommit: 0,
    bestCase: 0,
    dealsCount: 0,
  },
];

// Helper to compute live dynamic quotas from active CRM deals
async function getLiveQuotas(): Promise<TargetQuotaItem[]> {
  let allDeals: any[] = [];
  if (isPrismaConnected()) {
    try {
      allDeals = await prisma.deal.findMany();
    } catch {
      allDeals = memoryDeals;
    }
  } else {
    allDeals = memoryDeals;
  }

  // Calculate live deals aggregates
  let totalClosedWon = 0;
  let totalCommit = 0;
  let totalBestCase = 0;
  const count = allDeals.length;

  for (const d of allDeals) {
    const amt = Number(d.amount) || 0;
    const stage = String(d.stage || '').toLowerCase();
    const prob = Number(d.probability) || 0;

    if (stage === 'closed won' || prob === 100) {
      totalClosedWon += amt;
    } else if (prob >= 60 || stage.includes('negotiation') || stage.includes('proposal') || stage.includes('decision')) {
      totalCommit += amt;
    } else if (prob >= 20 || stage.includes('needs analysis') || stage.includes('value proposition')) {
      totalBestCase += amt;
    }
  }

  // If there are deals in the system, reflect them in the active manager & CEO quotas
  return memoryTargetQuotas.map((q) => {
    if (q.id === 'quota-ceo') {
      return {
        ...q,
        achievedAmount: totalClosedWon,
        pipelineCommit: totalCommit,
        bestCase: totalBestCase + totalCommit,
        dealsCount: count,
      };
    }
    if (q.id === 'quota-sales-head') {
      return {
        ...q,
        achievedAmount: totalClosedWon,
        pipelineCommit: totalCommit,
        bestCase: totalBestCase + totalCommit,
        dealsCount: count,
      };
    }
    return {
      ...q,
      achievedAmount: 0,
      pipelineCommit: Math.round(totalCommit * 0.4),
      bestCase: Math.round(totalBestCase * 0.5),
      dealsCount: Math.max(0, count - 1),
    };
  });
}

export const getForecastConfig = async (req: Request, res: Response) => {
  try {
    const liveQuotas = await getLiveQuotas();
    res.json({
      success: true,
      data: {
        config: memoryForecastConfig,
        quotas: liveQuotas,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateForecastConfig = async (req: Request, res: Response) => {
  try {
    const {
      forecastModel,
      hierarchyBasedOn,
      dealRevenue,
      dealQuantity,
      fiscalYearType,
      fiscalYearBeginsIn,
      isConfigured,
    } = req.body;

    memoryForecastConfig = {
      ...memoryForecastConfig,
      forecastModel: forecastModel ?? memoryForecastConfig.forecastModel,
      hierarchyBasedOn: hierarchyBasedOn ?? memoryForecastConfig.hierarchyBasedOn,
      dealRevenue: dealRevenue ?? memoryForecastConfig.dealRevenue,
      dealQuantity: dealQuantity ?? memoryForecastConfig.dealQuantity,
      fiscalYearType: fiscalYearType ?? memoryForecastConfig.fiscalYearType,
      fiscalYearBeginsIn: fiscalYearBeginsIn ?? 'January',
      isConfigured: isConfigured !== undefined ? isConfigured : true,
      setBy: 'Aman kumar',
      configuredAt: new Date().toISOString(),
    };

    const liveQuotas = await getLiveQuotas();
    res.json({
      success: true,
      message: 'Forecast configuration updated successfully',
      data: {
        config: memoryForecastConfig,
        quotas: liveQuotas,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const resetForecastConfig = async (req: Request, res: Response) => {
  try {
    memoryForecastConfig.isConfigured = false;
    res.json({
      success: true,
      message: 'Forecast configuration reset to unconfigured landing state',
      data: memoryForecastConfig,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTargetQuota = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { targetAmount } = req.body;

    const idx = memoryTargetQuotas.findIndex((q) => q.id === id);
    if (idx !== -1 && targetAmount !== undefined) {
      memoryTargetQuotas[idx].targetAmount = Number(targetAmount);
      return res.json({ success: true, data: memoryTargetQuotas[idx] });
    }
    res.status(404).json({ success: false, message: 'Quota not found' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
