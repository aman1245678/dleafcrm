import { Request, Response } from 'express';

export interface ForecastConfig {
  forecastModel: 'Top down' | 'Bottom up';
  hierarchyBasedOn: 'Roles' | 'Territory';
  dealRevenue: boolean;
  dealQuantity: boolean;
  fiscalYearType: 'Standard Fiscal Year' | 'Custom Fiscal Year';
  fiscalYearBeginsIn: string;
  isConfigured: boolean;
  setBy?: string;
  configuredAt?: string;
}

export interface TargetQuotaItem {
  id: string;
  roleOrUser: string;
  period: string; // e.g. Q4 2026
  targetAmount: number;
  achievedAmount: number;
  pipelineCommit: number;
  bestCase: number;
  dealsCount: number;
}

// In-memory initial state for Forecast Configuration matching Zoho CRM
let memoryForecastConfig: ForecastConfig = {
  forecastModel: 'Top down',
  hierarchyBasedOn: 'Roles',
  dealRevenue: false,
  dealQuantity: false,
  fiscalYearType: 'Standard Fiscal Year',
  fiscalYearBeginsIn: 'January',
  isConfigured: false,
  setBy: '-',
};

let memoryTargetQuotas: TargetQuotaItem[] = [];

export const getForecastConfig = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        config: memoryForecastConfig,
        quotas: memoryTargetQuotas,
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
      fiscalYearBeginsIn: fiscalYearBeginsIn ?? memoryForecastConfig.fiscalYearBeginsIn,
      isConfigured: isConfigured !== undefined ? isConfigured : true,
      setBy: 'Aman kumar',
      configuredAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'Forecast configuration updated successfully',
      data: memoryForecastConfig,
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
      message: 'Forecast configuration reset to unconfigured state',
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
