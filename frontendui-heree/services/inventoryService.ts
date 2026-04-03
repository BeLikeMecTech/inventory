
import { EquipmentItem, EquipmentCategory, EquipmentStatus, InventoryStats, User, Vendor, Location, AuditLog, SystemUser, ThemeConfig } from '../types';
import { MOCK_DATA } from '../constants';

const KEYS = {
  ITEMS: 'bpro_items',
  USERS: 'bpro_users',
  VENDORS: 'bpro_vendors',
  SYS_USERS: 'bpro_system_users',
  LOCATIONS: 'bpro_locations',
  LOGS: 'bpro_logs',
  THEME: 'bpro_theme'
};

const delay = (ms: number = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const inventoryService = {
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

  getItems: async (): Promise<EquipmentItem[]> => {
    await delay(300);
    const stored = localStorage.getItem(KEYS.ITEMS);
    if (!stored) {
      localStorage.setItem(KEYS.ITEMS, JSON.stringify(MOCK_DATA));
      return MOCK_DATA;
    }
    return JSON.parse(stored);
  },

  saveItem: async (item: EquipmentItem, user: User): Promise<void> => {
    await delay(400);
    const items = await inventoryService.getItems();
    const index = items.findIndex(i => i.id === item.id);
    const isEdit = index > -1;
    if (isEdit) items[index] = item; else items.push(item);
    localStorage.setItem(KEYS.ITEMS, JSON.stringify(items));
    await inventoryService.addLog(user, isEdit ? 'Update Asset' : 'Create Asset', `${item.name} (${item.id})`);
  },

  deleteItem: async (id: string, user: User): Promise<void> => {
    await delay(300);
    const items = (await inventoryService.getItems()).filter(i => i.id !== id);
    localStorage.setItem(KEYS.ITEMS, JSON.stringify(items));
    await inventoryService.addLog(user, 'Delete Asset', `ID: ${id}`);
  },

  getUsers: async (): Promise<User[]> => {
    await delay(200);
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  },

  saveUser: async (user: User): Promise<void> => {
    await delay(200);
    const users = await inventoryService.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx > -1) users[idx] = user; else users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  deleteUser: async (id: string): Promise<void> => {
    await delay(200);
    const users = (await inventoryService.getUsers()).filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  getVendors: async (): Promise<Vendor[]> => {
    await delay(200);
    return JSON.parse(localStorage.getItem(KEYS.VENDORS) || '[]');
  },

  saveVendor: async (vendor: Vendor): Promise<void> => {
    await delay(200);
    const vendors = await inventoryService.getVendors();
    const idx = vendors.findIndex(v => v.id === vendor.id);
    if (idx > -1) vendors[idx] = vendor; else vendors.push(vendor);
    localStorage.setItem(KEYS.VENDORS, JSON.stringify(vendors));
  },

  deleteVendor: async (id: string): Promise<void> => {
    await delay(200);
    const vendors = (await inventoryService.getVendors()).filter(v => v.id !== id);
    localStorage.setItem(KEYS.VENDORS, JSON.stringify(vendors));
  },

  getSystemUsers: async (): Promise<SystemUser[]> => {
    await delay(300);
    const users = JSON.parse(localStorage.getItem(KEYS.SYS_USERS) || '[]');
    if (users.length === 0) {
      const admin: SystemUser = { id: 'admin', name: 'Administrator', password: 'admin', role: 'admin' };
      localStorage.setItem(KEYS.SYS_USERS, JSON.stringify([admin]));
      return [admin];
    }
    return users;
  },

  saveSystemUser: async (user: SystemUser, currentUser: User): Promise<void> => {
    await delay(400);
    const users = await inventoryService.getSystemUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx > -1) users[idx] = user; else users.push(user);
    localStorage.setItem(KEYS.SYS_USERS, JSON.stringify(users));
    await inventoryService.addLog(currentUser, 'Manage System Access', `Modified account: ${user.id}`);
  },

  deleteSystemUser: async (id: string, currentUser: User): Promise<void> => {
    await delay(300);
    const users = (await inventoryService.getSystemUsers()).filter(u => u.id !== id);
    localStorage.setItem(KEYS.SYS_USERS, JSON.stringify(users));
    await inventoryService.addLog(currentUser, 'Manage System Access', `Deleted account: ${id}`);
  },

  getLocations: async (): Promise<Location[]> => {
    await delay(300);
    return JSON.parse(localStorage.getItem(KEYS.LOCATIONS) || '[]');
  },

  saveLocation: async (loc: Location): Promise<void> => {
    await delay(300);
    const locs = await inventoryService.getLocations();
    const idx = locs.findIndex(l => l.id === loc.id);
    if (idx > -1) locs[idx] = loc; else locs.push(loc);
    localStorage.setItem(KEYS.LOCATIONS, JSON.stringify(locs));
  },

  deleteLocation: async (id: string): Promise<void> => {
    await delay(300);
    const locs = (await inventoryService.getLocations()).filter(l => l.id !== id);
    localStorage.setItem(KEYS.LOCATIONS, JSON.stringify(locs));
  },

  getLogs: async (): Promise<AuditLog[]> => {
    await delay(200);
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
    await delay(300);
    localStorage.setItem(KEYS.THEME, JSON.stringify(theme));
  },

  getStats: (items: EquipmentItem[]): InventoryStats => {
    const stats: InventoryStats = { totalItems: items.length, byCategory: {}, byStatus: {} };
    Object.values(EquipmentCategory).forEach(c => stats.byCategory[c] = 0);
    Object.values(EquipmentStatus).forEach(s => stats.byStatus[s] = 0);
    items.forEach(item => {
      stats.byCategory[item.category]++;
      stats.byStatus[item.status]++;
    });
    return stats;
  },

  exportToCSV: async () => {
    const items = await inventoryService.getItems();
    const headers = ['ID', 'Name', 'Serial', 'Category', 'Status', 'Location', 'Assigned To', 'Vendor', 'Qty', 'Last Maintained', 'Warranty', 'Notes'];
    const rows = items.map(i => [i.id, i.name, i.serialNumber, i.category, i.status, i.locationId, i.assignedToUserId, i.vendorName, i.quantity, i.lastMaintained, i.warrantyDate, `"${(i.notes || '').replace(/"/g, '""')}"`]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${Date.now()}.csv`);
    link.click();
  },

  importFromCSV: async (csvText: string, user: User): Promise<boolean> => {
    try {
      await delay(500);
      const lines = csvText.split('\n').filter(l => l.trim() !== '');
      if (lines.length < 2) return false;
      const newItems: EquipmentItem[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        if (cols.length < 11) continue;
        newItems.push({
          id: cols[0] || `BCAST-${Date.now()}`,
          name: cols[1],
          serialNumber: cols[2],
          category: cols[3] as EquipmentCategory,
          status: cols[4] as EquipmentStatus,
          locationId: cols[5],
          assignedToUserId: cols[6],
          vendorName: cols[7],
          quantity: parseInt(cols[8]) || 1,
          lastMaintained: cols[9],
          warrantyDate: cols[10],
          notes: cols[11] || ''
        });
      }
      if (newItems.length > 0) {
        localStorage.setItem(KEYS.ITEMS, JSON.stringify(newItems));
        await inventoryService.addLog(user, 'Import CSV', `Imported ${newItems.length} assets`);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
};
