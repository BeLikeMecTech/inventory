
export enum EquipmentCategory {
  LAPTOP = 'Laptop',
  COMPUTER = 'Computer',
  BROADCAST_GENERIC = 'Broadcast',
  TYPE_C_CABLES = 'Type C Cables',
  SDI_CABLES = 'SDI Cables',
  PERIPHERAL = 'Peripheral',
  PCIE_CARD = 'PCIe Card',
  BROADCAST_EQUIPMENT = 'Broadcast Equipments',
  OTHER = 'Other'
}

export enum EquipmentStatus {
  AVAILABLE = 'Available',
  IN_USE = 'In Use',
  REPAIR = 'In Repair',
  OUT_OF_ORDER = 'Out of Order',
  LOST = 'Lost'
}

export interface User {
  id: string;
  name: string;
}

export interface Vendor {
  id: string;
  companyName: string;
  contactPerson: string;
  contactNumber: string;
}

export interface SystemUser extends User {
  password?: string;
  role: 'admin' | 'staff';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
}

export interface ThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  sidebarColor: string;
  borderColor: string;
  textColor: string;
  secondaryTextColor: string;
  borderRadius: string;
  mode: 'dark' | 'light';
  customIcons: Record<string, string>;
}

export interface Location {
  id: string;
  name: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  serialNumber: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  locationId: string;
  assignedToUserId: string;
  vendorName: string;
  quantity: number;
  lastMaintained: string;
  warrantyDate: string;
  photos?: string[];
  notes: string;
}

export interface InventoryStats {
  totalItems: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
}
