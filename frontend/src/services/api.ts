// Dleaf CRM - Client REST API Bridge
// Connects React frontend directly to the Node.js + Express backend

const TOKEN_KEY = 'Dleaf_crm_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication & User Session
  auth: {
    signup: async (data: {
      fullName: string;
      email: string;
      password?: string;
      companyName?: string;
      phone?: string;
      role?: 'admin' | 'manager' | 'agent';
      otp?: string;
    }) => {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const text = await res.text();
        let result: any = {};
        try {
          result = text ? JSON.parse(text) : {};
        } catch {
          result = { success: false, message: text || `Server error (${res.status})` };
        }
        if (result.success && result.token) {
          setAuthToken(result.token);
        }
        return result;
      } catch (err: any) {
        return {
          success: false,
          message: err.message || 'Network error connecting to backend authentication server.',
        };
      }
    },

    signin: async (data: { emailOrPhone: string; password?: string; otp?: string }) => {
      try {
        const res = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const text = await res.text();
        let result: any = {};
        try {
          result = text ? JSON.parse(text) : {};
        } catch {
          result = { success: false, message: text || `Server error (${res.status})` };
        }
        if (result.success && result.token) {
          setAuthToken(result.token);
        }
        return result;
      } catch (err: any) {
        return {
          success: false,
          message: err.message || 'Network error connecting to backend authentication server.',
        };
      }
    },

    resendOtp: async (data: { email: string; purpose: 'signin' | 'signup' }) => {
      try {
        const res = await fetch('/api/auth/resend-email-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        return await res.json();
      } catch (err: any) {
        return {
          success: false,
          message: err.message || 'Failed to resend verification OTP.',
        };
      }
    },

    getMe: async () => {
      try {
        const token = getAuthToken();
        if (!token) return { success: false, message: 'No active session token' };

        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        if (res.status === 401) {
          setAuthToken(null);
          return { success: false, message: 'Session expired' };
        }
        return await res.json();
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    },

    logout: async () => {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      } catch {
        // Ignore network errors on logout
      } finally {
        setAuthToken(null);
      }
      return { success: true };
    },

    syncUser: async (userData: {
      uid: string;
      email: string;
      name?: string;
      avatar?: string;
      company?: string;
      role?: string;
    }) => {
      try {
        const res = await fetch('/api/auth/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        const result = await res.json();
        if (result.success && result.token) {
          setAuthToken(result.token);
        }
        return result;
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    },

    getUsers: async () => {
      try {
        const res = await fetch('/api/auth/users', {
          method: 'GET',
          headers: getAuthHeaders(),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
  },

  // Health
  checkHealth: async () => {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch {
      return { status: 'offline', databaseEngine: 'Local State' };
    }
  },

  // Deals
  getDeals: async () => {
    try {
      const res = await fetch('/api/deals', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  createDeal: async (dealData: unknown) => {
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(dealData),
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating deal via API:', err);
      return null;
    }
  },

  updateDealStage: async (id: string, stage: string, probability: number) => {
    try {
      const res = await fetch(`/api/deals/${id}/stage`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ stage, probability }),
      });
      return await res.json();
    } catch (err) {
      console.error('Error updating deal stage via API:', err);
      return null;
    }
  },

  deleteDeal: async (id: string) => {
    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('Error deleting deal via API:', err);
      return null;
    }
  },

  // Leads
  getLeads: async () => {
    try {
      const res = await fetch('/api/leads', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  createLead: async (leadData: unknown) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(leadData),
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating lead via API:', err);
      return null;
    }
  },

  // Accounts
  getAccounts: async () => {
    try {
      const res = await fetch('/api/accounts', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  createAccount: async (accountData: unknown) => {
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(accountData),
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating account via API:', err);
      return null;
    }
  },

  updateAccount: async (id: string, accountData: unknown) => {
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(accountData),
      });
      return await res.json();
    } catch (err) {
      console.error('Error updating account via API:', err);
      return null;
    }
  },

  deleteAccount: async (id: string) => {
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('Error deleting account via API:', err);
      return null;
    }
  },

  // Contacts
  getContacts: async () => {
    try {
      const res = await fetch('/api/contacts', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  createContact: async (contactData: unknown) => {
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(contactData),
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating contact via API:', err);
      return null;
    }
  },

  deleteContact: async (id: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('Error deleting contact via API:', err);
      return null;
    }
  },

  convertLead: async (id: string, payload: unknown) => {
    try {
      const res = await fetch(`/api/leads/${id}/convert`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err) {
      console.error('Error converting lead via API:', err);
      return null;
    }
  },

  // Tasks
  getTasks: async () => {
    try {
      const res = await fetch('/api/tasks', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  createTask: async (taskData: unknown) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating task via API:', err);
      return null;
    }
  },

  updateTaskStatus: async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return await res.json();
    } catch (err) {
      console.error('Error updating task status via API:', err);
      return null;
    }
  },

  deleteTask: async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('Error deleting task via API:', err);
      return null;
    }
  },

  // Meetings
  getMeetings: async () => {
    try {
      const res = await fetch('/api/activities/meetings', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  createMeeting: async (meetingData: unknown) => {
    try {
      const res = await fetch('/api/activities/meetings', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(meetingData),
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating meeting via API:', err);
      return null;
    }
  },

  deleteMeeting: async (id: string) => {
    try {
      const res = await fetch(`/api/activities/meetings/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('Error deleting meeting via API:', err);
      return null;
    }
  },

  // Calls
  getCalls: async () => {
    try {
      const res = await fetch('/api/activities/calls', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  createCall: async (callData: unknown) => {
    try {
      const res = await fetch('/api/activities/calls', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(callData),
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating call via API:', err);
      return null;
    }
  },

  deleteCall: async (id: string) => {
    try {
      const res = await fetch(`/api/activities/calls/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('Error deleting call via API:', err);
      return null;
    }
  },

  // Products
  getProducts: async () => {
    try {
      const res = await fetch('/api/inventory/products', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  createProduct: async (productData: unknown) => {
    try {
      const res = await fetch('/api/inventory/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating product via API:', err);
      return null;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.error('Error deleting product via API:', err);
      return null;
    }
  },

  // Invoices
  getInvoices: async () => {
    try {
      const res = await fetch('/api/inventory/invoices', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },

  // Price Books
  getPriceBooks: async () => {
    try {
      const res = await fetch('/api/inventory/pricebooks', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },
  createPriceBook: async (data: unknown) => {
    try {
      const res = await fetch('/api/inventory/pricebooks', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return null;
    }
  },
  deletePriceBook: async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/pricebooks/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Quotes
  getQuotes: async () => {
    try {
      const res = await fetch('/api/inventory/quotes', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },
  createQuote: async (data: unknown) => {
    try {
      const res = await fetch('/api/inventory/quotes', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return null;
    }
  },
  deleteQuote: async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/quotes/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Sales Orders
  getSalesOrders: async () => {
    try {
      const res = await fetch('/api/inventory/salesorders', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },
  createSalesOrder: async (data: unknown) => {
    try {
      const res = await fetch('/api/inventory/salesorders', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return null;
    }
  },
  deleteSalesOrder: async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/salesorders/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Purchase Orders
  getPurchaseOrders: async () => {
    try {
      const res = await fetch('/api/inventory/purchaseorders', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },
  createPurchaseOrder: async (data: unknown) => {
    try {
      const res = await fetch('/api/inventory/purchaseorders', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return null;
    }
  },
  deletePurchaseOrder: async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/purchaseorders/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Vendors
  getVendors: async () => {
    try {
      const res = await fetch('/api/inventory/vendors', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },
  createVendor: async (data: unknown) => {
    try {
      const res = await fetch('/api/inventory/vendors', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return null;
    }
  },
  deleteVendor: async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/vendors/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Support: Cases
  getCases: async () => {
    try {
      const res = await fetch('/api/support/cases', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },
  createCase: async (data: unknown) => {
    try {
      const res = await fetch('/api/support/cases', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return null;
    }
  },
  deleteCase: async (id: string) => {
    try {
      const res = await fetch(`/api/support/cases/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Support: Solutions
  getSolutions: async () => {
    try {
      const res = await fetch('/api/support/solutions', { headers: getAuthHeaders() });
      const data = await res.json();
      return data.success ? data.data : null;
    } catch {
      return null;
    }
  },
  createSolution: async (data: unknown) => {
    try {
      const res = await fetch('/api/support/solutions', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return null;
    }
  },
  deleteSolution: async (id: string) => {
    try {
      const res = await fetch(`/api/support/solutions/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      return await res.json();
    } catch {
      return null;
    }
  },

  // MCP Execution Engine
  executeMCPTool: async (toolName: string, parameters: unknown) => {
    try {
      const res = await fetch('/api/mcp/execute', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ toolName, parameters }),
      });
      return await res.json();
    } catch (err) {
      console.error('Error executing MCP tool via API:', err);
      return null;
    }
  },

  // Real Communication & Payment Suite
  communication: {
    sendWhatsApp: async (recipient: string, message: string, type: 'whatsapp' | 'sms' = 'whatsapp') => {
      try {
        const res = await fetch('/api/communication/send-message', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ recipient, message, type }),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    },

    getMessages: async (recipient?: string) => {
      try {
        const url = recipient
          ? `/api/communication/messages?recipient=${encodeURIComponent(recipient)}`
          : '/api/communication/messages';
        const res = await fetch(url, { headers: getAuthHeaders() });
        return await res.json();
      } catch (err: any) {
        return { success: false, data: [] };
      }
    },

    sendEmail: async (to: string, subject: string, body: string, threadId?: string) => {
      try {
        const res = await fetch('/api/communication/send-email', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ to, subject, body, threadId }),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    },

    configureSmtp: async (smtpConfig: {
      host: string;
      port: number;
      secure: boolean;
      user: string;
      pass: string;
      from?: string;
    }) => {
      try {
        const res = await fetch('/api/communication/configure-smtp', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(smtpConfig),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    },

    logVoipCall: async (callData: {
      number: string;
      name?: string;
      duration?: string;
      callType?: string;
      callResult?: string;
      notes?: string;
    }) => {
      try {
        const res = await fetch('/api/communication/log-call', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(callData),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    },

    createPaymentLink: async (invoice: {
      invoiceId: string;
      invoiceNumber: string;
      amount: number;
      customerName?: string;
      customerEmail?: string;
    }) => {
      try {
        const res = await fetch('/api/communication/create-payment-link', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(invoice),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, message: err.message };
      }
    },
  },

  // Razorpay Payment Gateway & Subscriptions
  payments: {
    getConfig: async () => {
      try {
        const res = await fetch('/api/payments/config');
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    getSubscriptionStatus: async () => {
      try {
        const res = await fetch('/api/payments/subscription-status', {
          headers: getAuthHeaders(),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    createOrder: async (planKey: string) => {
      try {
        const res = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ planKey }),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    verifyPayment: async (payload: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      planKey: string;
    }) => {
      try {
        const res = await fetch('/api/payments/verify-payment', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
  },

  // Forecasts & Fiscal Year Engine
  forecasts: {
    getConfig: async () => {
      try {
        const res = await fetch('/api/forecasts/config', { headers: getAuthHeaders() });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    updateConfig: async (config: any) => {
      try {
        const res = await fetch('/api/forecasts/config', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(config),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    resetConfig: async () => {
      try {
        const res = await fetch('/api/forecasts/reset', {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    updateQuota: async (id: string, targetAmount: number) => {
      try {
        const res = await fetch(`/api/forecasts/quota/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ targetAmount }),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
  },

  // Zoho Documents & WorkDrive Engine
  documents: {
    getAll: async (params?: { category?: string; folder?: string; isTrash?: boolean; isFavorite?: boolean; search?: string }) => {
      try {
        const query = new URLSearchParams();
        if (params?.category) query.append('category', params.category);
        if (params?.folder) query.append('folder', params.folder);
        if (params?.isTrash !== undefined) query.append('isTrash', String(params.isTrash));
        if (params?.isFavorite !== undefined) query.append('isFavorite', String(params.isFavorite));
        if (params?.search) query.append('search', params.search);

        const res = await fetch(`/api/documents?${query.toString()}`, { headers: getAuthHeaders() });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    create: async (data: { name: string; category?: string; folder?: string; size?: string }) => {
      try {
        const res = await fetch('/api/documents', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    update: async (id: string, data: any) => {
      try {
        const res = await fetch(`/api/documents/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    delete: async (id: string, permanent: boolean = false) => {
      try {
        const res = await fetch(`/api/documents/${id}?permanent=${permanent}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    restore: async (id: string) => {
      try {
        const res = await fetch(`/api/documents/${id}/restore`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
  },

  // Zoho Campaigns Engine
  campaigns: {
    getAll: async (params?: { status?: string; type?: string; search?: string }) => {
      try {
        const query = new URLSearchParams();
        if (params?.status) query.append('status', params.status);
        if (params?.type) query.append('type', params.type);
        if (params?.search) query.append('search', params.search);

        const res = await fetch(`/api/campaigns?${query.toString()}`, { headers: getAuthHeaders() });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    create: async (data: any) => {
      try {
        const res = await fetch('/api/campaigns', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    import: async (campaigns?: any[]) => {
      try {
        const res = await fetch('/api/campaigns/import', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ campaigns }),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    delete: async (id: string) => {
      try {
        const res = await fetch(`/api/campaigns/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    reset: async () => {
      try {
        const res = await fetch('/api/campaigns/reset', {
          method: 'POST',
          headers: getAuthHeaders(),
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
  },
};


