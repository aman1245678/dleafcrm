import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../routes/authRoutes.js';
import { getPlan } from '../lib/plans.js';

export interface AuthUser {
  uid: string;
  id?: number;
  email: string;
  name?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'AGENT' | 'USER';
  companyId: string;
  permissions?: string[];
  planKey?: string;
  planStatus?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Authentication Guard
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token missing or invalid. Please log in.',
    });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyJWT(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Session expired or token invalid. Please log in again.',
    });
  }

  req.user = {
    uid: decoded.uid || decoded.id,
    id: decoded.id,
    email: decoded.email,
    name: decoded.name || 'User',
    role: (decoded.role || 'ADMIN').toUpperCase() as any,
    companyId: decoded.companyId || 'comp-dleaf',
    permissions: decoded.permissions || ['all'],
    planKey: decoded.planKey || 'growth',
    planStatus: decoded.planStatus || 'active',
  };

  next();
};

// Super Admin Only Guard (Like NexwAPI SuperAdmin)
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const role = req.user.role;
  if (role !== 'SUPER_ADMIN' && role !== ('super_admin' as any)) {
    return res.status(403).json({
      success: false,
      error: 'Access Denied: Super Admin privileges are required to access this resource.',
    });
  }

  next();
};

// Plan Feature Gate Guard
export const requirePlanFeature = (featureKey: keyof ReturnType<typeof getPlan>['features']) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    // Super Admin has unrestricted access to everything
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const plan = getPlan(req.user.planKey || 'trial');
    const isAllowed = plan.features[featureKey];

    if (!isAllowed) {
      return res.status(403).json({
        success: false,
        error: `Feature Locked: Your current '${plan.name}' does not include '${String(featureKey)}'. Please upgrade your plan.`,
        upgradeRequired: true,
        currentPlan: plan.key,
        feature: featureKey,
      });
    }

    next();
  };
};
