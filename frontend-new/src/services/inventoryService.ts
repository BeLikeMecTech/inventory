import {
  EquipmentItem,
  EquipmentCategory,
  EquipmentStatus,
  InventoryStats,
  User,
  Vendor,
  Location,
  AuditLog,
  SystemUser,
  ThemeConfig
} from '../types';

import { MOCK_DATA } from '../constants';
import { api } from '../api';

const KEYS = {
  ITEMS: 'bpro_items',
  USERS: 'bpro_users',
  VENDORS: 'bpro_vendors',
  SYS_USERS: 'bpro_system_users',
  LOCATIONS: 'bpro_locations',
  LOGS: 'bpro_logs',
  THEME: 'bpro_theme'
};

const delay = (ms: number = 300) => new Promise(res => setTimeout(res, ms));

export const inventoryService = {

  // ================= BACKUP =================
  backupDatabase: async () => {
    const data = {
      items: await inventoryService.getItems(),
      users: await inventoryService.getUsers(),
      vendors: await inventoryService.getVendors(),
      locations: await inventoryService.getLocations(),
      logs: await inventoryService.getLogs(),
      theme: inventoryService.getTheme()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  },

  // ================= ITEMS (API CONNECTED) =================

  getItems: async (): Promise<EquipmentItem[]> => {
    return api.get("/items");
  },

  saveItem: async (item: EquipmentItem, user: User): Promise<void> => {
    if (item.id) {
      await api.put(`/items/${item.id}`, item);
    } else {
      await api.post("/items", item);
    }

    await inventoryService.addLog(
      user,
      "Save Asset",
      `${item.name} (${item.id || "new"})`
    );
  },

  deleteItem: async (id: string, user: User): Promise<void> => {
    await api.delete(`/items/${id}`);

    await inventoryService.addLog(
      user,
      "Delete Asset",
      `ID: ${id}`
    );
  },

  // ================= USERS =================

  getUsers: async (): Promise<User[]> => {
    await delay();
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  },

  saveUser: async (user: User): Promise<void> => {
    await delay();
    const users = await inventoryService.getUsers();
    const idx = users.findIndex(u => u.id === user.id);

    if (idx > -1) users[idx] = user;
    else users.push(user);

    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  deleteUser: async (id: string): Promise<void> => {
    await delay();
    const users = (await inventoryService.getUsers()).filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  // ================= VENDORS =================

  getVendors: async (): Promise<Vendor[]> => {
    await delay();
    return JSON.parse(localStorage.getItem(KEYS.VENDORS) || '[]');
  },

  saveVendor: async (vendor: Vendor): Promise<void> => {
    await delay();
    const vendors = await inventoryService.getVendors();
    const idx = vendors.findIndex(v => v.id === vendor.id);

    if (idx > -1) vendors[idx] = vendor;
    else vendors.push(vendor);

    localStorage.setItem(KEYS.VENDORS, JSON.stringify(vendors));
  },

  deleteVendor: async (id: string): Promise<void> => {
    await delay();
    const vendors = (await inventoryService.getVendors()).filter(v => v.id !== id);
    localStorage.setItem(KEYS.VENDORS, JSON.stringify(vendors));
  },

  // ================= SYSTEM USERS =================

  getSystemUsers: async (): Promise<SystemUser[]> => {
    await delay();
    const users = JSON.parse(localStorage.getItem(KEYS.SYS_USERS) || '[]');

    if (users.length === 0) {
      const admin: SystemUser = {
        id: 'admin',
        name: 'Administrator',
        password: 'admin',
        role: 'admin'
      };
      localStorage.setItem(KEYS.SYS_USERS, JSON.stringify([admin]));
      return [admin];
    }

    return users;
  },

  saveSystemUser: async (user: SystemUser, currentUser: User): Promise<void> => {
    await delay();
    const users = await inventoryService.getSystemUsers();
    const idx = users.findIndex(u => u.id === user.id);

    if (idx > -1) users[idx] = user;
    else users.push(user);

    localStorage.setItem(KEYS.SYS_USERS, JSON.stringify(users));

    await inventoryService.addLog(
      currentUser,
      'Manage System Access',
      `Modified account: ${user.id}`
    );
  },

  deleteSystemUser: async (id: string, currentUser: User): Promise<void> => {
    await delay();
    const users = (await inventoryService.getSystemUsers()).filter(u => u.id !== id);

    localStorage.setItem(KEYS.SYS_USERS, JSON.stringify(users));

    await inventoryService.addLog(
      currentUser,
      'Manage System Access',
      `Deleted account: ${id}`
    );
  },

  // ================= LOCATIONS =================

  getLocations: async (): Promise<Location[]> => {
    await delay();
    return JSON.parse(localStorage.getItem(KEYS.LOCATIONS) || '[]');
  },

  saveLocation: async (loc: Location): Promise<void> => {
    await delay();
    const locs = await inventoryService.getLocations();
    const idx = locs.findIndex(l => l.id === loc.id);

    if (idx > -1) locs[idx] = loc;
    else locs.push(loc);

    localStorage.setItem(KEYS.LOCATIONS, JSON.stringify(locs));
  },

  deleteLocation: async (id: string): Promise<void> => {
    await delay();
    const locs = (await inventoryService.getLocations()).filter(l => l.id !== id);
    localStorage.setItem(KEYS.LOCATIONS, JSON.stringify(locs));
  },

  // ================= LOGS =================

  getLogs: async (): Promise<AuditLog[]> => {
    await delay();
    return JSON.parse(localStorage.getItem(KEYS.LOGS) || '[]');
  },

  addLog: async (user: User, action: string, details: string): Promise<void> => {
    const logs = JSON.parse(localStorage.getItem(KEYS.LOGS) || '[]');

    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      userId: user.id,
      userName: user.name,
      action,
      details
    };

    logs.unshift(newLog);
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs.slice(0, 500)));
  },

  // ================= THEME =================

  getTheme: (): ThemeConfig => {
    const defaults: ThemeConfig = {
      primaryColor: '#2563eb',
      backgroundColor: '#f8fafc',
      surfaceColor: '#ffffff',
      sidebarColor: '#ffffff',
      borderColor: '#e2e8f0',
      textColor: '#0f172a',
      secondaryTextColor: '#64748b',
      borderRadius: '1.25rem',
      mode: 'light',
      customIcons: {}
    };

    const stored = localStorage.getItem(KEYS.THEME);
    return stored ? JSON.parse(stored) : defaults;
  },

  saveTheme: async (theme: ThemeConfig): Promise<void> => {
    await delay();
    localStorage.setItem(KEYS.THEME, JSON.stringify(theme));
  },

  // ================= STATS =================

  getStats: (items: EquipmentItem[]): InventoryStats => {
    const stats: InventoryStats = {
      totalItems: items.length,
      byCategory: {},
      byStatus: {}
    };

    Object.values(EquipmentCategory).forEach(c => stats.byCategory[c] = 0);
    Object.values(EquipmentStatus).forEach(s => stats.byStatus[s] = 0);

    items.forEach(item => {
      stats.byCategory[item.category]++;
      stats.byStatus[item.status]++;
    });

    return stats;
  }
};