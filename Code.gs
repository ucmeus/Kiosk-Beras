
const APP_NAME = 'Kiosk Beras - H.Encang';
const APP_TIMEZONE = 'Asia/Jakarta';

const SHEETS = {
  SETTINGS: 'Setting',
  USERS: 'Users',
  BACKUPS: 'BackupHistory',
  SUPPLIERS: 'Supplier',
  CATEGORIES: 'KategoriBeras',
  CUSTOMERS: 'Pelanggan',
  BALANCES: 'Saldo',
  CASHFLOW: 'CashFlow',
  PURCHASES: 'Pembelian',
  TRANSACTIONS: 'Transaksi'
};

const MODULE_SHEETS = {
  settings: SHEETS.SETTINGS,
  users: SHEETS.USERS,
  backups: SHEETS.BACKUPS,
  suppliers: SHEETS.SUPPLIERS,
  categories: SHEETS.CATEGORIES,
  customers: SHEETS.CUSTOMERS,
  balances: SHEETS.BALANCES,
  cashflow: SHEETS.CASHFLOW,
  purchases: SHEETS.PURCHASES,
  transactions: SHEETS.TRANSACTIONS
};

const ID_PREFIX = {
  settings: 'SET',
  users: 'USR',
  backups: 'BKP',
  suppliers: 'SUP',
  categories: 'CAT',
  customers: 'CUS',
  balances: 'BAL',
  cashflow: 'CFL',
  purchases: 'PUR',
  transactions: 'TRX'
};

const SHEET_HEADERS = {
  [SHEETS.SETTINGS]: ['id', 'storeName', 'storeAddress', 'ownerName', 'ownerPhone', 'logoUrl', 'bankName', 'bankAccountNumber', 'dailySalesTarget', 'createdAt', 'updatedAt'],
  [SHEETS.USERS]: ['id', 'username', 'displayName', 'email', 'role', 'avatarUrl', 'passwordHash', 'isActive', 'canViewReports', 'canManageUsers', 'canManageInventory', 'lastLoginAt', 'createdAt', 'updatedAt'],
  [SHEETS.BACKUPS]: ['id', 'timestamp', 'mode', 'fileId', 'fileUrl', 'triggeredBy', 'notes', 'createdAt', 'updatedAt'],
  [SHEETS.SUPPLIERS]: ['id', 'name', 'phone', 'address', 'notes', 'createdAt', 'updatedAt'],
  [SHEETS.CATEGORIES]: ['id', 'name', 'pricePerLiter', 'costPerLiter', 'pricePerKg', 'costPerKg', 'kgPerLiter', 'stockKg', 'reorderLevel', 'supplierId', 'imageUrl', 'description', 'createdAt', 'updatedAt'],
  [SHEETS.CUSTOMERS]: ['id', 'name', 'phone', 'address', 'discountPercent', 'createdAt', 'updatedAt'],
  [SHEETS.BALANCES]: ['id', 'date', 'openingBalance', 'closingBalance', 'notes', 'createdBy', 'createdAt', 'updatedAt'],
  [SHEETS.CASHFLOW]: ['id', 'timestamp', 'date', 'type', 'amount', 'source', 'referenceId', 'description', 'createdBy', 'createdAt', 'updatedAt'],
  [SHEETS.PURCHASES]: ['id', 'timestamp', 'date', 'supplierId', 'supplierName', 'categoryId', 'categoryName', 'qtyKg', 'buyPrice', 'totalCost', 'notes', 'createdBy', 'status', 'createdAt', 'updatedAt'],
  [SHEETS.TRANSACTIONS]: ['id', 'timestamp', 'date', 'customerId', 'customerName', 'cashier', 'itemsJson', 'totalQty', 'totalQtyKg', 'totalQtyLiter', 'subtotal', 'discountPercent', 'discountAmount', 'total', 'cashPaid', 'changeAmount', 'totalCost', 'profit', 'status', 'approvedBy', 'createdAt', 'updatedAt']
};

const ROLE_PERMISSIONS = {
  Admin: {
    create: ['*'],
    edit: ['*'],
    delete: ['*'],
    approve: ['*'],
    view: ['*']
  },
  Supervisor: {
    create: ['suppliers', 'categories', 'customers', 'balances', 'cashflow', 'purchases', 'transactions', 'reports'],
    edit: ['suppliers', 'categories', 'customers', 'balances', 'cashflow', 'purchases', 'transactions', 'reports'],
    delete: ['cashflow'],
    approve: ['transactions', 'purchases'],
    view: ['*']
  },
  Kasir: {
    create: ['transactions'],
    edit: [],
    delete: [],
    approve: [],
    view: ['dashboard', 'categories', 'customers', 'transactions', 'reports', 'about']
  },
  Guest: {
    create: [],
    edit: [],
    delete: [],
    approve: [],
    view: ['dashboard', 'about']
  }
};

const MENU_MODULES = {
  dashboard: 'dashboard',
  suppliers: 'suppliers',
  categories: 'categories',
  customers: 'customers',
  users: 'users',
  balances: 'balances',
  cashflow: 'cashflow',
  stock: 'categories',
  purchases: 'purchases',
  transactions: 'transactions',
  report_daily: 'reports',
  report_weekly: 'reports',
  report_monthly: 'reports',
  backups: 'backups',
  settings: 'settings',
  about: 'about'
};

const BACKUP_TARGET_SHEETS = [
  SHEETS.SETTINGS,
  SHEETS.USERS,
  SHEETS.SUPPLIERS,
  SHEETS.CATEGORIES,
  SHEETS.CUSTOMERS,
  SHEETS.BALANCES,
  SHEETS.CASHFLOW,
  SHEETS.PURCHASES,
  SHEETS.TRANSACTIONS
];

const DB_ENGINE = {
  SHEETS: 'SHEETS'
};
const DEFAULT_KG_PER_LITER = 0.8;
const DEFAULT_BRAND_LOGO_FILE_ID = '19FSpFBYLKTEdowZDZf13KKAZV5ppUvKd0OvW68jBreh221NbqbX';
const DEFAULT_BRAND_LOGO_URL = 'https://drive.google.com/thumbnail?id=' + DEFAULT_BRAND_LOGO_FILE_ID + '&sz=w1200';
const APP_READY_CACHE_KEY = 'KIOSK_APP_READY';
const APP_READY_CACHE_SEC = 6 * 60 * 60;
const APP_BOOTSTRAPPED_AT_KEY = 'KIOSK_APP_BOOTSTRAPPED_AT';
const APP_SCHEMA_VERSION_KEY = 'KIOSK_APP_SCHEMA_VERSION';
const APP_SCHEMA_VERSION = '2026-04-04-01';
const MAX_DATASET_ROWS = {
  transactions: 240,
  purchases: 240,
  cashflow: 240,
  backups: 120
};

function doGet(e) {
  ensureAppReady_();
  const params = (e && e.parameter) ? e.parameter : {};
  if (String(params.ping || '').trim() === '1') {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        app: APP_NAME,
        at: nowText_(),
        bootstrappedAt: PropertiesService.getScriptProperties().getProperty(APP_BOOTSTRAPPED_AT_KEY) || ''
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle(APP_NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function initializeApp(context) {
  ensureAppReady_();
  const safeContext = context || {};
  const users = getRecords_(SHEETS.USERS);
  const user = resolveCurrentUser_(users, safeContext.userId);
  const userRole = sanitizeRole_(user.role);
  const requestedRole = sanitizeRole_(safeContext.role || userRole);
  const role = userRole === 'Admin' ? requestedRole : userRole;

  const settings = getStoreSettings_();
  const safeUsers = users.map((u) => stripSensitiveUser_(u));
  const canViewBackups = canRole_(role, 'view', 'backups');
  const allTransactions = getRecords_(SHEETS.TRANSACTIONS);
  const suppliers = getRecords_(SHEETS.SUPPLIERS);
  const categories = getRecords_(SHEETS.CATEGORIES);
  const customers = getRecords_(SHEETS.CUSTOMERS);
  const balances = getRecords_(SHEETS.BALANCES);
  const cashflow = getRecords_(SHEETS.CASHFLOW);
  const purchases = getRecords_(SHEETS.PURCHASES);
  const backups = canViewBackups ? getRecords_(SHEETS.BACKUPS) : [];

  const datasets = {
    suppliers: suppliers,
    categories: categories,
    customers: customers,
    balances: balances,
    cashflow: tailRows_(cashflow, MAX_DATASET_ROWS.cashflow),
    purchases: tailRows_(purchases, MAX_DATASET_ROWS.purchases),
    transactions: tailRows_(allTransactions, MAX_DATASET_ROWS.transactions),
    backups: tailRows_(backups, MAX_DATASET_ROWS.backups),
    users: canRole_(role, 'view', 'users') ? safeUsers : [],
    settings: settings
  };

  const dashboard = buildDashboardData_({
    suppliers: suppliers,
    categories: categories,
    customers: customers,
    transactions: allTransactions
  }, settings);
  const alerts = buildAlerts_(categories, dashboard, settings);

  return {
    appName: APP_NAME,
    storageEngine: getDataEngine_(),
    role: role,
    userRole: userRole,
    roles: userRole === 'Admin' ? Object.keys(ROLE_PERMISSIONS) : [userRole],
    permissions: ROLE_PERMISSIONS[role],
    currentUser: stripSensitiveUser_(user),
    menuAccess: buildMenuAccess_(role),
    datasets: datasets,
    dashboard: dashboard,
    alerts: alerts,
    generatedAt: nowText_()
  };
}

function generateCaptcha() {
  const code = generateCaptchaCode_(6);
  const token = Utilities.getUuid();
  const cache = CacheService.getScriptCache();
  cache.put('CAPTCHA_' + token, String(code).toUpperCase(), 10 * 60);

  return {
    token: token,
    question: code,
    expiresInSec: 600
  };
}

function login(payload) {
  ensureAppReady_();
  const data = payload || {};
  validateCaptcha_(data.captchaToken, data.captchaAnswer);

  const username = String(data.username || '').trim().toLowerCase();
  const password = String(data.password || '');
  if (!username || !password) {
    throw new Error('Username dan password wajib diisi.');
  }

  const users = getRecords_(SHEETS.USERS);
  const user = users.find((row) => String(row.username || '').trim().toLowerCase() === username);
  if (!user || String(user.isActive).toUpperCase() === 'FALSE') {
    throw new Error('User tidak ditemukan atau tidak aktif.');
  }

  const valid = verifyPassword_(password, user.passwordHash);
  if (!valid) {
    throw new Error('Password tidak valid.');
  }

  user.lastLoginAt = nowText_();
  user.updatedAt = nowText_();
  upsertById_(SHEETS.USERS, user);

  const role = sanitizeRole_(user.role);
  return {
    success: true,
    user: stripSensitiveUser_(user),
    role: role,
    roles: role === 'Admin' ? Object.keys(ROLE_PERMISSIONS) : [role]
  };
}

function loginWithGoogle(payload) {
  ensureAppReady_();
  const data = payload || {};
  validateCaptcha_(data.captchaToken, data.captchaAnswer);

  const email = String(Session.getActiveUser().getEmail() || '').trim();
  if (!email) {
    throw new Error('Email akun Google tidak terdeteksi. Pastikan deployment web app dijalankan sebagai user yang mengakses.');
  }

  const users = getRecords_(SHEETS.USERS);
  let user = users.find((row) => String(row.email || '').trim().toLowerCase() === email.toLowerCase());
  if (user && String(user.isActive).toUpperCase() === 'FALSE') {
    throw new Error('Akun Google terdaftar namun statusnya tidak aktif.');
  }

  if (!user) {
    const usernameBase = email.split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '');
    user = {
      id: generateId_('users'),
      username: usernameBase || ('user' + Utilities.formatDate(new Date(), APP_TIMEZONE, 'yyyyMMddHHmmss')),
      displayName: email.split('@')[0],
      email: email,
      role: 'Guest',
      avatarUrl: '',
      passwordHash: hashPassword_(Utilities.getUuid()),
      isActive: 'TRUE',
      lastLoginAt: nowText_(),
      createdAt: nowText_(),
      updatedAt: nowText_()
    };
  } else {
    user.lastLoginAt = nowText_();
    user.updatedAt = nowText_();
  }

  upsertById_(SHEETS.USERS, user);
  const role = sanitizeRole_(user.role);
  return {
    success: true,
    user: stripSensitiveUser_(user),
    role: role,
    roles: role === 'Admin' ? Object.keys(ROLE_PERMISSIONS) : [role]
  };
}

function getModuleData(moduleKey, context) {
  const role = sanitizeRole_(context && context.role);
  const module = normalizeModuleKey_(moduleKey);
  assertPermission_(role, 'view', module);

  if (module === 'settings') {
    return getStoreSettings_();
  }

  const sheetName = MODULE_SHEETS[module];
  if (!sheetName) {
    throw new Error('Modul tidak ditemukan: ' + module);
  }
  return getRecords_(sheetName);
}

function saveRecord(moduleKey, payload, context) {
  const role = sanitizeRole_(context && context.role);
  const module = normalizeModuleKey_(moduleKey);
  const data = payload || {};
  const isCreate = !data.id;
  assertPermission_(role, isCreate ? 'create' : 'edit', module);

  switch (module) {
    case 'suppliers':
      return upsertSupplier_(data);
    case 'categories':
      return upsertCategory_(data);
    case 'customers':
      return upsertCustomer_(data);
    case 'balances':
      return upsertBalance_(data, context);
    case 'cashflow':
      return upsertCashFlow_(data, context);
    case 'purchases':
      return upsertPurchase_(data, context);
    case 'settings':
      return saveSettings_(data);
    case 'users':
      return upsertUser_(data);
    default:
      throw new Error('Modul belum didukung untuk save: ' + module);
  }
}
function deleteRecord(moduleKey, id, context) {
  const role = sanitizeRole_(context && context.role);
  const module = normalizeModuleKey_(moduleKey);
  assertPermission_(role, 'delete', module);

  if (!id) {
    throw new Error('ID wajib diisi untuk hapus data.');
  }

  switch (module) {
    case 'purchases':
      return deletePurchase_(id);
    case 'transactions':
      return deleteTransaction_(id);
    default:
      return deleteById_(MODULE_SHEETS[module], id);
  }
}

function saveTransaction(payload, context) {
  const role = sanitizeRole_(context && context.role);
  assertPermission_(role, 'create', 'transactions');

  const data = payload || {};
  const items = Array.isArray(data.items) ? data.items : [];
  if (!items.length) {
    throw new Error('Minimal ada 1 item transaksi.');
  }

  const customers = getRecords_(SHEETS.CUSTOMERS);
  const categories = getRecords_(SHEETS.CATEGORIES);
  const categoryMap = toMapById_(categories);
  const customer = customers.find((row) => String(row.id) === String(data.customerId)) || null;
  const discountPercent = customer ? toNumber_(customer.discountPercent) : 0;

  let subtotal = 0;
  let totalCost = 0;
  let totalQtyKg = 0;
  let totalQtyLiter = 0;
  const normalizedItems = [];

  items.forEach((item) => {
    const category = categoryMap[item.categoryId];
    const qty = toNumber_(item.qty);
    const unit = normalizeUnit_(item.unit);

    if (!category) {
      throw new Error('Kategori tidak ditemukan untuk item: ' + item.categoryId);
    }
    if (qty <= 0) {
      return;
    }

    const kgPerLiter = resolveKgPerLiter_(category);
    const qtyKg = unit === 'liter' ? round2_(qty * kgPerLiter) : round2_(qty);
    const stock = toNumber_(category.stockKg);
    if (stock < qtyKg) {
      throw new Error('Stok tidak cukup untuk ' + category.name + '. Sisa stok: ' + stock + ' kg');
    }

    const unitPrice = getCategoryPriceByUnit_(category, unit, kgPerLiter);
    const unitCost = getCategoryCostByUnit_(category, unit, kgPerLiter);
    const lineTotal = qty * unitPrice;
    const lineCost = qty * unitCost;

    subtotal += lineTotal;
    totalCost += lineCost;
    totalQtyKg += qtyKg;
    totalQtyLiter += unit === 'liter' ? qty : (kgPerLiter > 0 ? (qty / kgPerLiter) : 0);

    normalizedItems.push({
      categoryId: category.id,
      categoryName: category.name,
      unit: unit,
      qty: qty,
      qtyKg: qtyKg,
      kgPerLiter: round2_(kgPerLiter),
      pricePerUnit: round2_(unitPrice),
      costPerUnit: round2_(unitCost),
      lineTotal: lineTotal,
      lineCost: lineCost
    });
  });

  if (!normalizedItems.length) {
    throw new Error('Jumlah item transaksi tidak valid.');
  }

  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;
  const cashPaid = toNumber_(data.cashPaid);

  if (cashPaid < total) {
    throw new Error('Uang dibayar kurang dari total transaksi.');
  }

  const changeAmount = cashPaid - total;
  const now = new Date();
  const nowText = formatDateTime_(now);
  const dateText = formatDate_(now);
  const transactionId = generateId_('transactions');
  const status = role === 'Kasir' ? 'Pending' : 'Approved';

  normalizedItems.forEach((item) => {
    adjustCategoryStock_(item.categoryId, -item.qtyKg);
  });

  const trxRecord = {
    id: transactionId,
    timestamp: nowText,
    date: dateText,
    customerId: customer ? customer.id : '',
    customerName: customer ? customer.name : 'Umum',
    cashier: data.cashierName || (context && context.userName) || role,
    itemsJson: JSON.stringify(normalizedItems),
    totalQty: round2_(totalQtyKg),
    totalQtyKg: round2_(totalQtyKg),
    totalQtyLiter: round2_(totalQtyLiter),
    subtotal: round2_(subtotal),
    discountPercent: round2_(discountPercent),
    discountAmount: round2_(discountAmount),
    total: round2_(total),
    cashPaid: round2_(cashPaid),
    changeAmount: round2_(changeAmount),
    totalCost: round2_(totalCost),
    profit: round2_(total - totalCost),
    status: status,
    approvedBy: status === 'Approved' ? (context && context.userName) || role : '',
    createdAt: nowText,
    updatedAt: nowText
  };

  upsertById_(SHEETS.TRANSACTIONS, trxRecord);

  upsertCashFlowByReference_({
    source: 'Penjualan',
    referenceId: transactionId,
    type: 'IN',
    amount: round2_(total),
    date: dateText,
    description: 'Transaksi ' + transactionId,
    createdBy: (context && context.userName) || role
  });

  const refreshed = getRecords_(SHEETS.TRANSACTIONS).find((row) => row.id === transactionId);
  return {
    transaction: refreshed,
    categories: getRecords_(SHEETS.CATEGORIES),
    cashflow: getRecords_(SHEETS.CASHFLOW)
  };
}

function approveTransaction(transactionId, context) {
  const role = sanitizeRole_(context && context.role);
  assertPermission_(role, 'approve', 'transactions');

  const trx = findById_(SHEETS.TRANSACTIONS, transactionId);
  if (!trx) {
    throw new Error('Transaksi tidak ditemukan.');
  }

  const nowText = nowText_();
  trx.status = 'Approved';
  trx.approvedBy = (context && context.userName) || role;
  trx.updatedAt = nowText;
  upsertById_(SHEETS.TRANSACTIONS, trx);

  return trx;
}

function getCustomerPurchaseHistory(customerId, context) {
  const role = sanitizeRole_(context && context.role);
  assertPermission_(role, 'view', 'customers');

  const trx = getRecords_(SHEETS.TRANSACTIONS)
    .filter((row) => String(row.customerId) === String(customerId))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return trx;
}

function getReportData(period, unitOrContext, maybeContext) {
  let context = maybeContext || null;
  let reportUnit = 'kg';

  if (typeof unitOrContext === 'string') {
    reportUnit = normalizeUnit_(unitOrContext);
  } else {
    context = unitOrContext || maybeContext || null;
  }

  const role = sanitizeRole_(context && context.role);
  assertPermission_(role, 'view', 'reports');

  const safePeriod = (period || 'daily').toLowerCase();
  const now = new Date();
  let days = 1;

  if (safePeriod === 'weekly') {
    days = 7;
  } else if (safePeriod === 'monthly') {
    days = 30;
  }

  const start = new Date(now.getTime() - ((days - 1) * 24 * 60 * 60 * 1000));
  start.setHours(0, 0, 0, 0);

  const transactions = getRecords_(SHEETS.TRANSACTIONS).filter((row) => {
    const dateObj = parseDate_(row.timestamp || row.date);
    return dateObj && dateObj >= start;
  });

  let totalSales = 0;
  let totalProfit = 0;
  let totalTransactions = 0;
  let totalQty = 0;
  const categorySales = {};
  const categoryQty = {};

  transactions.forEach((trx) => {
    totalSales += toNumber_(trx.total);
    totalProfit += toNumber_(trx.profit);
    totalTransactions += 1;

    const items = safeParseJson_(trx.itemsJson, []);
    items.forEach((item) => {
      const key = item.categoryName || 'Lainnya';
      categorySales[key] = (categorySales[key] || 0) + toNumber_(item.lineTotal);
      const qtyConverted = convertItemQtyToUnit_(item, reportUnit);
      categoryQty[key] = (categoryQty[key] || 0) + qtyConverted;
      totalQty += qtyConverted;
    });
  });

  const topCategories = Object.keys(categorySales)
    .map((name) => ({
      name: name,
      totalSales: round2_(categorySales[name]),
      totalQty: round2_(categoryQty[name] || 0),
      unit: reportUnit
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 10);

  return {
    period: safePeriod,
    unit: reportUnit,
    startDate: formatDate_(start),
    endDate: formatDate_(now),
    totalSales: round2_(totalSales),
    totalProfit: round2_(totalProfit),
    totalQty: round2_(totalQty),
    totalTransactions: totalTransactions,
    topCategories: topCategories,
    transactions: transactions
  };
}

function updateProfile(payload, context) {
  const role = sanitizeRole_(context && context.role);
  if (!payload || !payload.id) {
    throw new Error('Data profil tidak valid.');
  }

  const currentUser = findById_(SHEETS.USERS, payload.id);
  if (!currentUser) {
    throw new Error('User tidak ditemukan.');
  }

  const isAdmin = role === 'Admin';
  const sameUser = String(context && context.userId) === String(payload.id);
  if (!isAdmin && !sameUser) {
    throw new Error('Anda tidak punya izin mengubah profil user lain.');
  }

  currentUser.displayName = payload.displayName || currentUser.displayName;
  currentUser.email = payload.email || currentUser.email;
  currentUser.avatarUrl = payload.avatarUrl || currentUser.avatarUrl;
  if (payload.password) {
    currentUser.passwordHash = hashPassword_(payload.password);
  }
  currentUser.updatedAt = nowText_();

  upsertById_(SHEETS.USERS, currentUser);
  return currentUser;
}

function logout() {
  return { success: true, at: nowText_() };
}

function getBackupHistory(context) {
  const role = sanitizeRole_(context && context.role);
  assertPermission_(role, 'view', 'backups');
  return getRecords_(SHEETS.BACKUPS).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function createBackup(mode, notes, context) {
  const role = sanitizeRole_(context && context.role);
  assertPermission_(role, 'create', 'backups');
  return createBackupSnapshot_(String(mode || 'MANUAL').toUpperCase(), String(notes || ''), (context && context.userName) || role);
}

function restoreBackup(backupId, context) {
  const role = sanitizeRole_(context && context.role);
  assertPermission_(role, 'edit', 'backups');
  if (!backupId) {
    throw new Error('ID backup wajib diisi.');
  }

  const backup = findById_(SHEETS.BACKUPS, backupId);
  if (!backup || !backup.fileId) {
    throw new Error('Backup tidak ditemukan.');
  }

  const sourceSpreadsheet = SpreadsheetApp.openById(backup.fileId);
  const targetSpreadsheet = getSpreadsheet_();

  BACKUP_TARGET_SHEETS.forEach((sheetName) => {
    const sourceSheet = sourceSpreadsheet.getSheetByName(sheetName);
    const targetSheet = targetSpreadsheet.getSheetByName(sheetName);
    if (!sourceSheet || !targetSheet) {
      return;
    }
    const values = sourceSheet.getDataRange().getValues();
    targetSheet.clearContents();
    if (values.length > 0) {
      targetSheet.getRange(1, 1, values.length, values[0].length).setValues(values);
    }
    targetSheet.setFrozenRows(1);
  });

  return {
    success: true,
    backupId: backupId,
    restoredAt: nowText_()
  };
}

function setupAutoBackupTrigger(context) {
  const role = sanitizeRole_(context && context.role);
  assertPermission_(role, 'create', 'backups');
  ensureAutoBackupTrigger_();
  return { success: true, message: 'Auto backup tahunan aktif (dicek harian).' };
}

function runAutoBackupScheduler() {
  ensureAppReady_();
  const props = PropertiesService.getScriptProperties();
  const lastAuto = props.getProperty('LAST_AUTO_BACKUP_AT');
  const now = new Date();
  const lastTime = lastAuto ? new Date(lastAuto).getTime() : NaN;
  const shouldBackup = !lastAuto || isNaN(lastTime) || ((now.getTime() - lastTime) >= (365 * 24 * 60 * 60 * 1000));

  if (shouldBackup) {
    const result = createBackupSnapshot_('AUTO', 'Backup otomatis tahunan', 'System');
    props.setProperty('LAST_AUTO_BACKUP_AT', now.toISOString());
    return { success: true, created: true, backup: result };
  }

  return { success: true, created: false, message: 'Belum waktunya auto backup tahunan.' };
}

function setupApp() {
  setupApp_();
  return { success: true, at: nowText_() };
}

function warmupApp() {
  const start = new Date().getTime();
  ensureAppReady_();
  return {
    success: true,
    warmedAt: nowText_(),
    durationMs: new Date().getTime() - start,
    bootstrappedAt: PropertiesService.getScriptProperties().getProperty(APP_BOOTSTRAPPED_AT_KEY) || ''
  };
}

function setupApp_() {
  const ss = getSpreadsheet_();
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());
  Object.keys(SHEET_HEADERS).forEach((sheetName) => {
    ensureSheetWithHeaders_(sheetName, SHEET_HEADERS[sheetName]);
  });

  seedDefaults_();
  migrateSettingsLogo_();
  migrateCategoryUnitFields_();
  ensureUserCredentials_();

  try {
    ensureAutoBackupTrigger_();
  } catch (err) {
    // Trigger setup can fail on first authorization; app tetap berjalan.
  }

  const props = PropertiesService.getScriptProperties();
  props.setProperty(APP_BOOTSTRAPPED_AT_KEY, nowText_());
  props.setProperty(APP_SCHEMA_VERSION_KEY, APP_SCHEMA_VERSION);
  CacheService.getScriptCache().put(APP_READY_CACHE_KEY, APP_SCHEMA_VERSION, APP_READY_CACHE_SEC);
}

function ensureAppReady_() {
  const cache = CacheService.getScriptCache();
  if (cache.get(APP_READY_CACHE_KEY) === APP_SCHEMA_VERSION) {
    return;
  }

  const props = PropertiesService.getScriptProperties();
  const sameSchema = props.getProperty(APP_SCHEMA_VERSION_KEY) === APP_SCHEMA_VERSION;
  if (props.getProperty(APP_BOOTSTRAPPED_AT_KEY) && sameSchema) {
    cache.put(APP_READY_CACHE_KEY, APP_SCHEMA_VERSION, APP_READY_CACHE_SEC);
    return;
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const latestSchema = props.getProperty(APP_SCHEMA_VERSION_KEY) === APP_SCHEMA_VERSION;
    if (!props.getProperty(APP_BOOTSTRAPPED_AT_KEY) || !latestSchema) {
      setupApp_();
    }
    cache.put(APP_READY_CACHE_KEY, APP_SCHEMA_VERSION, APP_READY_CACHE_SEC);
  } finally {
    lock.releaseLock();
  }
}

function tailRows_(rows, limit) {
  const list = Array.isArray(rows) ? rows : [];
  const max = Math.max(1, Number(limit || 100));
  if (list.length <= max) {
    return list;
  }
  return list.slice(list.length - max);
}

function seedDefaults_() {
  if (getRecords_(SHEETS.SETTINGS).length === 0) {
    upsertById_(SHEETS.SETTINGS, {
      id: 'SET-001',
      storeName: APP_NAME,
      storeAddress: 'Jl. Contoh No. 1, Jakarta',
      ownerName: 'H. Nana',
      ownerPhone: '0812-0000-0000',
      logoUrl: DEFAULT_BRAND_LOGO_URL,
      bankName: 'Bank BRI',
      bankAccountNumber: '1234567890',
      dailySalesTarget: 5000000,
      createdAt: nowText_(),
      updatedAt: nowText_()
    });
  }

  if (getRecords_(SHEETS.USERS).length === 0) {
    const baseUsers = [
      {
        id: 'USR-ADM-001',
        username: 'admin',
        displayName: 'Admin Utama',
        email: 'admin@kioskberas.local',
        role: 'Admin',
        avatarUrl: 'https://drive.google.com/thumbnail?id=1r0P-k0nrmhJjwSLNDiwa3P6DZXnQmlUS',
        passwordHash: hashPassword_('admin123'),
        isActive: 'TRUE',
        lastLoginAt: '',
        createdAt: nowText_(),
        updatedAt: nowText_()
      },
      {
        id: 'USR-SPV-001',
        username: 'supervisor',
        displayName: 'Supervisor',
        email: 'supervisor@kioskberas.local',
        role: 'Supervisor',
        avatarUrl: 'https://drive.google.com/thumbnail?id=1r0P-k0nrmhJjwSLNDiwa3P6DZXnQmlUS',
        passwordHash: hashPassword_('super123'),
        isActive: 'TRUE',
        lastLoginAt: '',
        createdAt: nowText_(),
        updatedAt: nowText_()
      },
      {
        id: 'USR-KSR-001',
        username: 'kasir',
        displayName: 'Kasir',
        email: 'kasir@kioskberas.local',
        role: 'Kasir',
        avatarUrl: 'https://drive.google.com/thumbnail?id=1r0P-k0nrmhJjwSLNDiwa3P6DZXnQmlUS',
        passwordHash: hashPassword_('kasir123'),
        isActive: 'TRUE',
        lastLoginAt: '',
        createdAt: nowText_(),
        updatedAt: nowText_()
      },
      {
        id: 'USR-GST-001',
        username: 'guest',
        displayName: 'Guest',
        email: 'guest@kioskberas.local',
        role: 'Guest',
        avatarUrl: 'https://drive.google.com/thumbnail?id=1Uxib9Q3DIjq6GREZKvhwac8N_qrlFrgX',
        passwordHash: hashPassword_('guest123'),
        isActive: 'TRUE',
        lastLoginAt: '',
        createdAt: nowText_(),
        updatedAt: nowText_()
      }
    ];

    baseUsers.forEach((row) => upsertById_(SHEETS.USERS, row));
  }

  if (getRecords_(SHEETS.SUPPLIERS).length === 0) {
    [
      { id: 'SUP-001', name: 'CV Padi Makmur', phone: '0821-1111-1111', address: 'Karawang, Jawa Barat', notes: 'Supplier utama', createdAt: nowText_(), updatedAt: nowText_() },
      { id: 'SUP-002', name: 'PT Sawah Jaya', phone: '0821-2222-2222', address: 'Indramayu, Jawa Barat', notes: 'Kualitas premium', createdAt: nowText_(), updatedAt: nowText_() }
    ].forEach((row) => upsertById_(SHEETS.SUPPLIERS, row));
  }

  if (getRecords_(SHEETS.CATEGORIES).length === 0) {
    [
      {
        id: 'CAT-001',
        name: 'Beras Premium 5kg',
        pricePerLiter: 13600,
        costPerLiter: 11600,
        pricePerKg: 17000,
        costPerKg: 14500,
        kgPerLiter: DEFAULT_KG_PER_LITER,
        stockKg: 280,
        reorderLevel: 80,
        supplierId: 'SUP-001',
        imageUrl: 'https://drive.google.com/thumbnail?id=1qvikPoHcav1pPPSvaBVwLaw2C9FBiGfM',
        description: 'Aroma wangi dan pulen',
        createdAt: nowText_(),
        updatedAt: nowText_()
      },
      {
        id: 'CAT-002',
        name: 'Beras Medium 5kg',
        pricePerLiter: 11600,
        costPerLiter: 9840,
        pricePerKg: 14500,
        costPerKg: 12300,
        kgPerLiter: DEFAULT_KG_PER_LITER,
        stockKg: 190,
        reorderLevel: 75,
        supplierId: 'SUP-002',
        imageUrl: 'https://drive.google.com/thumbnail?id=1qvikPoHcav1pPPSvaBVwLaw2C9FBiGfM',
        description: 'Harga ekonomis harian',
        createdAt: nowText_(),
        updatedAt: nowText_()
      },
      {
        id: 'CAT-003',
        name: 'Beras Organik 5kg',
        pricePerLiter: 17600,
        costPerLiter: 15200,
        pricePerKg: 22000,
        costPerKg: 19000,
        kgPerLiter: DEFAULT_KG_PER_LITER,
        stockKg: 95,
        reorderLevel: 40,
        supplierId: 'SUP-001',
        imageUrl: 'https://drive.google.com/thumbnail?id=1qvikPoHcav1pPPSvaBVwLaw2C9FBiGfM',
        description: 'Tanpa pestisida',
        createdAt: nowText_(),
        updatedAt: nowText_()
      }
    ].forEach((row) => upsertById_(SHEETS.CATEGORIES, row));
  }

  if (getRecords_(SHEETS.CUSTOMERS).length === 0) {
    [
      { id: 'CUS-001', name: 'Toko Sembako Maju', phone: '0813-1111-1111', address: 'Cikarang', discountPercent: 5, createdAt: nowText_(), updatedAt: nowText_() },
      { id: 'CUS-002', name: 'Warung Bu Ani', phone: '0813-2222-2222', address: 'Bekasi Timur', discountPercent: 2.5, createdAt: nowText_(), updatedAt: nowText_() }
    ].forEach((row) => upsertById_(SHEETS.CUSTOMERS, row));
  }

  if (getRecords_(SHEETS.BALANCES).length === 0) {
    upsertById_(SHEETS.BALANCES, {
      id: 'BAL-001',
      date: formatDate_(new Date()),
      openingBalance: 15000000,
      closingBalance: 15000000,
      notes: 'Saldo awal sistem',
      createdBy: 'System',
      createdAt: nowText_(),
      updatedAt: nowText_()
    });
  }
}

function migrateCategoryUnitFields_() {
  const categories = getRecords_(SHEETS.CATEGORIES);
  categories.forEach((row) => {
    let changed = false;
    const rawKgPerLiter = toNumber_(row.kgPerLiter);
    const kgPerLiter = rawKgPerLiter > 0 ? rawKgPerLiter : DEFAULT_KG_PER_LITER;

    if (!(rawKgPerLiter > 0)) {
      row.kgPerLiter = kgPerLiter;
      changed = true;
    }

    const pricePerKg = toNumber_(row.pricePerKg);
    const costPerKg = toNumber_(row.costPerKg);
    const pricePerLiter = toNumber_(row.pricePerLiter);
    const costPerLiter = toNumber_(row.costPerLiter);

    if (!(pricePerLiter > 0) && pricePerKg > 0) {
      row.pricePerLiter = round2_(pricePerKg * kgPerLiter);
      changed = true;
    }

    if (!(costPerLiter > 0) && costPerKg > 0) {
      row.costPerLiter = round2_(costPerKg * kgPerLiter);
      changed = true;
    }

    if (!(pricePerKg > 0) && pricePerLiter > 0) {
      row.pricePerKg = round2_(pricePerLiter / kgPerLiter);
      changed = true;
    }

    if (!(costPerKg > 0) && costPerLiter > 0) {
      row.costPerKg = round2_(costPerLiter / kgPerLiter);
      changed = true;
    }

    if (changed) {
      row.updatedAt = nowText_();
      upsertById_(SHEETS.CATEGORIES, row);
    }
  });
}

function migrateSettingsLogo_() {
  const settings = getStoreSettings_();
  const currentLogo = String(settings.logoUrl || '').trim();
  const isLegacyDefault = !currentLogo || /images\.unsplash\.com\/photo-1586201375761-83865001e31c/i.test(currentLogo);
  if (!isLegacyDefault) {
    return;
  }

  settings.logoUrl = DEFAULT_BRAND_LOGO_URL;
  settings.createdAt = settings.createdAt || nowText_();
  settings.updatedAt = nowText_();
  upsertById_(SHEETS.SETTINGS, settings);
}

function buildDashboardData_(datasets, settings) {
  const today = formatDate_(new Date());
  const transactions = datasets.transactions || [];

  let todaySales = 0;
  let todayProfit = 0;
  let todayTransactions = 0;

  transactions.forEach((trx) => {
    if (trx.date === today) {
      todaySales += toNumber_(trx.total);
      todayProfit += toNumber_(trx.profit);
      todayTransactions += 1;
    }
  });

  const salesByCategory = {};
  const profitByCategory = {};
  const profitTrendMap = {};
  for (let i = 6; i >= 0; i -= 1) {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - i);
    const key = formatDate_(dateObj);
    profitTrendMap[key] = 0;
  }

  transactions.forEach((trx) => {
    const items = safeParseJson_(trx.itemsJson, []);
    items.forEach((item) => {
      const key = item.categoryName || 'Tanpa Kategori';
      salesByCategory[key] = (salesByCategory[key] || 0) + toNumber_(item.lineTotal);
      const profit = toNumber_(item.lineTotal) - toNumber_(item.lineCost);
      profitByCategory[key] = (profitByCategory[key] || 0) + profit;
    });
  });

  const trendMap = {};
  for (let i = 6; i >= 0; i -= 1) {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - i);
    const key = formatDate_(dateObj);
    trendMap[key] = 0;
    profitTrendMap[key] = 0;
  }
  transactions.forEach((trx) => {
    if (Object.prototype.hasOwnProperty.call(trendMap, trx.date)) {
      trendMap[trx.date] += toNumber_(trx.total);
    }
    if (Object.prototype.hasOwnProperty.call(profitTrendMap, trx.date)) {
      profitTrendMap[trx.date] += toNumber_(trx.profit);
    }
  });

  const target = toNumber_(settings.dailySalesTarget || 0);
  const targetProgress = target > 0 ? round2_((todaySales / target) * 100) : 0;

  return {
    totalCustomers: (datasets.customers || []).length,
    totalSuppliers: (datasets.suppliers || []).length,
    totalCategories: (datasets.categories || []).length,
    todaySales: round2_(todaySales),
    todayProfit: round2_(todayProfit),
    todayTransactions: todayTransactions,
    dailyTarget: target,
    targetProgress: targetProgress,
    salesByCategory: Object.keys(salesByCategory).map((name) => ({ name: name, totalSales: round2_(salesByCategory[name]) })),
    profitByCategory: Object.keys(profitByCategory).map((name) => ({ name: name, totalProfit: round2_(profitByCategory[name]) })),
    salesTrend: Object.keys(trendMap).map((date) => ({ date: date, totalSales: round2_(trendMap[date]) })),
    profitTrend: Object.keys(profitTrendMap).map((date) => ({ date: date, totalProfit: round2_(profitTrendMap[date]) }))
  };
}

function buildAlerts_(categories, dashboard, settings) {
  const list = [];
  (categories || []).forEach((row) => {
    const stock = toNumber_(row.stockKg);
    const reorder = toNumber_(row.reorderLevel);
    if (stock <= reorder) {
      list.push({
        level: 'warning',
        title: 'Stok rendah',
        message: row.name + ' tersisa ' + stock + ' kg (batas minimum ' + reorder + ' kg).'
      });
    }
  });

  const target = toNumber_(settings.dailySalesTarget || 0);
  if (target > 0) {
    if (dashboard.todaySales < target) {
      list.push({
        level: 'info',
        title: 'Target harian belum tercapai',
        message: 'Realisasi Rp ' + formatNumber_(dashboard.todaySales) + ' dari target Rp ' + formatNumber_(target) + '.'
      });
    } else {
      list.push({
        level: 'success',
        title: 'Target harian tercapai',
        message: 'Selamat, target penjualan hari ini berhasil dilampaui.'
      });
    }
  }

  if (!list.length) {
    list.push({
      level: 'success',
      title: 'Kondisi aman',
      message: 'Belum ada alert kritikal saat ini.'
    });
  }

  return list;
}
function upsertSupplier_(payload) {
  const now = nowText_();
  const record = {
    id: payload.id || generateId_('suppliers'),
    name: payload.name || '',
    phone: payload.phone || '',
    address: payload.address || '',
    notes: payload.notes || '',
    createdAt: payload.createdAt || now,
    updatedAt: now
  };
  upsertById_(SHEETS.SUPPLIERS, record);
  return record;
}

function upsertCategory_(payload) {
  const now = nowText_();
  const kgPerLiter = toNumber_(payload.kgPerLiter) > 0 ? toNumber_(payload.kgPerLiter) : DEFAULT_KG_PER_LITER;
  const pricePerLiterInput = toNumber_(payload.pricePerLiter);
  const costPerLiterInput = toNumber_(payload.costPerLiter);
  const pricePerKgInput = toNumber_(payload.pricePerKg);
  const costPerKgInput = toNumber_(payload.costPerKg);

  const pricePerLiter = pricePerLiterInput > 0
    ? pricePerLiterInput
    : (pricePerKgInput > 0 ? round2_(pricePerKgInput * kgPerLiter) : 0);
  const costPerLiter = costPerLiterInput > 0
    ? costPerLiterInput
    : (costPerKgInput > 0 ? round2_(costPerKgInput * kgPerLiter) : 0);
  const pricePerKg = pricePerKgInput > 0
    ? pricePerKgInput
    : (pricePerLiter > 0 ? round2_(pricePerLiter / kgPerLiter) : 0);
  const costPerKg = costPerKgInput > 0
    ? costPerKgInput
    : (costPerLiter > 0 ? round2_(costPerLiter / kgPerLiter) : 0);

  const record = {
    id: payload.id || generateId_('categories'),
    name: payload.name || '',
    pricePerLiter: round2_(pricePerLiter),
    costPerLiter: round2_(costPerLiter),
    pricePerKg: round2_(pricePerKg),
    costPerKg: round2_(costPerKg),
    kgPerLiter: round2_(kgPerLiter),
    stockKg: toNumber_(payload.stockKg),
    reorderLevel: toNumber_(payload.reorderLevel),
    supplierId: payload.supplierId || '',
    imageUrl: payload.imageUrl || '',
    description: payload.description || '',
    createdAt: payload.createdAt || now,
    updatedAt: now
  };
  upsertById_(SHEETS.CATEGORIES, record);
  return record;
}

function upsertCustomer_(payload) {
  const now = nowText_();
  const record = {
    id: payload.id || generateId_('customers'),
    name: payload.name || '',
    phone: payload.phone || '',
    address: payload.address || '',
    discountPercent: toNumber_(payload.discountPercent),
    createdAt: payload.createdAt || now,
    updatedAt: now
  };
  upsertById_(SHEETS.CUSTOMERS, record);
  return record;
}

function upsertBalance_(payload, context) {
  const now = nowText_();
  const record = {
    id: payload.id || generateId_('balances'),
    date: payload.date || formatDate_(new Date()),
    openingBalance: toNumber_(payload.openingBalance),
    closingBalance: toNumber_(payload.closingBalance),
    notes: payload.notes || '',
    createdBy: payload.createdBy || (context && context.userName) || 'System',
    createdAt: payload.createdAt || now,
    updatedAt: now
  };
  upsertById_(SHEETS.BALANCES, record);
  return record;
}

function upsertCashFlow_(payload, context) {
  const now = nowText_();
  const dateText = payload.date || formatDate_(new Date());
  const record = {
    id: payload.id || generateId_('cashflow'),
    timestamp: payload.timestamp || now,
    date: dateText,
    type: String(payload.type || 'IN').toUpperCase() === 'OUT' ? 'OUT' : 'IN',
    amount: toNumber_(payload.amount),
    source: payload.source || 'Manual',
    referenceId: payload.referenceId || '',
    description: payload.description || '',
    createdBy: payload.createdBy || (context && context.userName) || 'System',
    createdAt: payload.createdAt || now,
    updatedAt: now
  };
  upsertById_(SHEETS.CASHFLOW, record);
  return record;
}

function upsertPurchase_(payload, context) {
  const suppliers = getRecords_(SHEETS.SUPPLIERS);
  const categories = getRecords_(SHEETS.CATEGORIES);
  const supplier = suppliers.find((row) => String(row.id) === String(payload.supplierId));
  const category = categories.find((row) => String(row.id) === String(payload.categoryId));

  if (!supplier) {
    throw new Error('Supplier tidak ditemukan.');
  }
  if (!category) {
    throw new Error('Kategori beras tidak ditemukan.');
  }

  const now = nowText_();
  const qty = toNumber_(payload.qtyKg);
  const buyPrice = toNumber_(payload.buyPrice);
  const totalCost = round2_(qty * buyPrice);

  if (qty <= 0 || buyPrice <= 0) {
    throw new Error('Qty dan harga beli harus lebih dari 0.');
  }

  if (payload.id) {
    const oldPurchase = findById_(SHEETS.PURCHASES, payload.id);
    if (!oldPurchase) {
      throw new Error('Data pembelian tidak ditemukan saat update.');
    }

    adjustCategoryStock_(oldPurchase.categoryId, -toNumber_(oldPurchase.qtyKg));

    const updated = {
      id: oldPurchase.id,
      timestamp: payload.timestamp || oldPurchase.timestamp || now,
      date: payload.date || oldPurchase.date || formatDate_(new Date()),
      supplierId: payload.supplierId,
      supplierName: supplier.name,
      categoryId: payload.categoryId,
      categoryName: category.name,
      qtyKg: qty,
      buyPrice: buyPrice,
      totalCost: totalCost,
      notes: payload.notes || '',
      createdBy: oldPurchase.createdBy || (context && context.userName) || 'System',
      status: payload.status || oldPurchase.status || 'Approved',
      createdAt: oldPurchase.createdAt || now,
      updatedAt: now
    };

    upsertById_(SHEETS.PURCHASES, updated);
    adjustCategoryStock_(updated.categoryId, qty);

    upsertCashFlowByReference_({
      source: 'Pembelian Beras',
      referenceId: updated.id,
      type: 'OUT',
      amount: totalCost,
      date: updated.date,
      description: 'Pembelian ' + updated.categoryName,
      createdBy: updated.createdBy
    });

    return updated;
  }

  const purchaseId = generateId_('purchases');
  const created = {
    id: purchaseId,
    timestamp: payload.timestamp || now,
    date: payload.date || formatDate_(new Date()),
    supplierId: payload.supplierId,
    supplierName: supplier.name,
    categoryId: payload.categoryId,
    categoryName: category.name,
    qtyKg: qty,
    buyPrice: buyPrice,
    totalCost: totalCost,
    notes: payload.notes || '',
    createdBy: (context && context.userName) || 'System',
    status: payload.status || 'Approved',
    createdAt: now,
    updatedAt: now
  };

  upsertById_(SHEETS.PURCHASES, created);
  adjustCategoryStock_(created.categoryId, qty);

  upsertCashFlowByReference_({
    source: 'Pembelian Beras',
    referenceId: created.id,
    type: 'OUT',
    amount: totalCost,
    date: created.date,
    description: 'Pembelian ' + created.categoryName,
    createdBy: created.createdBy
  });

  return created;
}

function deletePurchase_(purchaseId) {
  const purchase = findById_(SHEETS.PURCHASES, purchaseId);
  if (!purchase) {
    throw new Error('Pembelian tidak ditemukan.');
  }

  adjustCategoryStock_(purchase.categoryId, -toNumber_(purchase.qtyKg));
  deleteById_(SHEETS.PURCHASES, purchaseId);
  deleteCashFlowByReference_('Pembelian Beras', purchaseId);
  return { success: true, id: purchaseId };
}

function deleteTransaction_(transactionId) {
  const trx = findById_(SHEETS.TRANSACTIONS, transactionId);
  if (!trx) {
    throw new Error('Transaksi tidak ditemukan.');
  }

  const items = safeParseJson_(trx.itemsJson, []);
  items.forEach((item) => {
    const qtyKg = toNumber_(item.qtyKg) > 0 ? toNumber_(item.qtyKg) : toNumber_(item.qty);
    adjustCategoryStock_(item.categoryId, qtyKg);
  });

  deleteById_(SHEETS.TRANSACTIONS, transactionId);
  deleteCashFlowByReference_('Penjualan', transactionId);
  return { success: true, id: transactionId };
}

function saveSettings_(payload) {
  const now = nowText_();
  const current = getStoreSettings_();
  const logoCandidate = payload.logoUrl || current.logoUrl || '';
  const record = {
    id: current.id || payload.id || 'SET-001',
    storeName: payload.storeName || current.storeName || APP_NAME,
    storeAddress: payload.storeAddress || current.storeAddress || '',
    ownerName: payload.ownerName || current.ownerName || '',
    ownerPhone: payload.ownerPhone || current.ownerPhone || '',
    logoUrl: resolveLogoUrl_(logoCandidate, current.logoUrl || ''),
    bankName: payload.bankName || current.bankName || '',
    bankAccountNumber: payload.bankAccountNumber || current.bankAccountNumber || '',
    dailySalesTarget: toNumber_(payload.dailySalesTarget || current.dailySalesTarget),
    createdAt: current.createdAt || now,
    updatedAt: now
  };

  upsertById_(SHEETS.SETTINGS, record);
  return record;
}

function listDriveImagesFromDatabaseFolder() {
  ensureAppReady_();
  const folder = getDatabaseFolder_();
  const files = folder.getFiles();
  const images = [];

  while (files.hasNext()) {
    const file = files.next();
    const mimeType = String(file.getMimeType() || '');
    if (mimeType.indexOf('image/') !== 0) {
      continue;
    }

    images.push({
      id: file.getId(),
      name: file.getName(),
      mimeType: mimeType,
      url: file.getUrl(),
      thumbnailUrl: buildDriveImageUrl_(file.getId(), 1200),
      command: 'drive:' + file.getName()
    });
  }

  images.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
  return {
    folderId: folder.getId(),
    folderName: folder.getName(),
    count: images.length,
    images: images
  };
}

function listDriveImageCommands() {
  const payload = listDriveImagesFromDatabaseFolder();
  return payload.images.map((row) => {
    return {
      fileName: row.name,
      fileId: row.id,
      command: row.command,
      logoUrl: row.thumbnailUrl,
      htmlTag: '<img src="' + row.thumbnailUrl + '" alt="' + row.name + '">'
    };
  });
}

function getDriveImageCommand(fileNameOrId) {
  ensureAppReady_();
  const image = findDriveImageInDatabaseFolder_(fileNameOrId);
  return {
    fileId: image.id,
    fileName: image.name,
    command: 'drive:' + image.name,
    logoUrl: image.thumbnailUrl,
    htmlTag: '<img src="' + image.thumbnailUrl + '" alt="' + image.name + '">',
    fileUrl: image.url
  };
}
function upsertUser_(payload) {
  const now = nowText_();
  const role = sanitizeRole_(payload.role);
  const existing = payload.id ? findById_(SHEETS.USERS, payload.id) : null;
  const passwordHash = payload.password
    ? hashPassword_(payload.password)
    : (payload.passwordHash || (existing && existing.passwordHash) || hashPassword_('changeme123'));
  const record = {
    id: payload.id || generateId_('users'),
    username: payload.username || '',
    displayName: payload.displayName || '',
    email: payload.email || '',
    role: role,
    avatarUrl: payload.avatarUrl || '',
    passwordHash: passwordHash,
    isActive: String(payload.isActive || 'TRUE'),
    canViewReports: String(payload.canViewReports || 'FALSE'),
    canManageUsers: String(payload.canManageUsers || 'FALSE'),
    canManageInventory: String(payload.canManageInventory || 'FALSE'),
    lastLoginAt: payload.lastLoginAt || (existing && existing.lastLoginAt) || '',
    createdAt: payload.createdAt || now,
    updatedAt: now
  };

  upsertById_(SHEETS.USERS, record);
  return record;
}

function getStoreSettings_() {
  const rows = getRecords_(SHEETS.SETTINGS);
  return rows[0] || {
    id: 'SET-001',
    storeName: APP_NAME,
    storeAddress: '',
    ownerName: '',
    ownerPhone: '',
    logoUrl: DEFAULT_BRAND_LOGO_URL,
    bankName: '',
    bankAccountNumber: '',
    dailySalesTarget: 0,
    createdAt: '',
    updatedAt: ''
  };
}

function resolveCurrentUser_(users, userId) {
  const activeUsers = (users || []).filter((row) => String(row.isActive).toUpperCase() !== 'FALSE');
  if (!userId) return createGuestUser_();
  const user = activeUsers.find((row) => String(row.id) === String(userId));
  return user || createGuestUser_();
}

function createGuestUser_() {
  return {
    id: 'USR-GUEST-SESSION',
    username: 'guest',
    displayName: 'Guest',
    email: '',
    role: 'Guest',
    avatarUrl: '',
    isActive: 'TRUE',
    lastLoginAt: '',
    createdAt: '',
    updatedAt: ''
  };
}

function stripSensitiveUser_(user) {
  const safe = Object.assign({}, user || {});
  delete safe.passwordHash;
  return safe;
}

function buildMenuAccess_(role) {
  const access = {};
  Object.keys(MENU_MODULES).forEach((menuKey) => {
    const module = MENU_MODULES[menuKey];
    access[menuKey] = canRole_(role, 'view', module);
  });
  return access;
}

function ensureUserCredentials_() {
  const users = getRecords_(SHEETS.USERS);
  users.forEach((user) => {
    const updates = {};
    let needUpdate = false;

    if (!user.passwordHash) {
      updates.passwordHash = hashPassword_(defaultPasswordForUser_(user));
      needUpdate = true;
    }
    if (user.lastLoginAt === undefined) {
      updates.lastLoginAt = '';
      needUpdate = true;
    }

    if (needUpdate) {
      const merged = Object.assign({}, user, updates, { updatedAt: nowText_() });
      upsertById_(SHEETS.USERS, merged);
    }
  });
}

function defaultPasswordForUser_(user) {
  const role = sanitizeRole_(user && user.role);
  if (role === 'Admin') return 'admin123';
  if (role === 'Supervisor') return 'super123';
  if (role === 'Kasir') return 'kasir123';
  return 'guest123';
}

function hashPassword_(plain) {
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(plain || ''), Utilities.Charset.UTF_8);
  return raw.map((b) => ((b < 0 ? b + 256 : b).toString(16).padStart(2, '0'))).join('');
}

function verifyPassword_(plain, hash) {
  if (!hash) return false;
  return hashPassword_(plain) === String(hash);
}

function validateCaptcha_(token, answer) {
  const safeToken = String(token || '').trim();
  const safeAnswer = String(answer || '').trim().toUpperCase();
  if (!safeToken || !safeAnswer) {
    throw new Error('CAPTCHA wajib diisi.');
  }

  const cache = CacheService.getScriptCache();
  const expected = cache.get('CAPTCHA_' + safeToken);
  if (!expected || expected !== safeAnswer) {
    throw new Error('CAPTCHA tidak valid atau sudah kedaluwarsa.');
  }

  cache.remove('CAPTCHA_' + safeToken);
}

function generateCaptchaCode_(length) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  const size = Math.max(4, Number(length || 6));
  for (let i = 0; i < size; i += 1) {
    const index = Math.floor(Math.random() * chars.length);
    out += chars.charAt(index);
  }
  return out;
}

function createBackupSnapshot_(mode, notes, triggeredBy) {
  const ss = getSpreadsheet_();
  const timestampFile = Utilities.formatDate(new Date(), APP_TIMEZONE, 'yyyyMMdd_HHmmss');
  const backupName = APP_NAME + ' Backup ' + timestampFile;
  const backupFile = DriveApp.getFileById(ss.getId()).makeCopy(backupName);

  const record = {
    id: generateId_('backups'),
    timestamp: nowText_(),
    mode: mode || 'MANUAL',
    fileId: backupFile.getId(),
    fileUrl: backupFile.getUrl(),
    triggeredBy: triggeredBy || 'System',
    notes: notes || '',
    createdAt: nowText_(),
    updatedAt: nowText_()
  };

  upsertById_(SHEETS.BACKUPS, record);
  return record;
}

function ensureAutoBackupTrigger_() {
  const handlerName = 'runAutoBackupScheduler';
  const exists = ScriptApp.getProjectTriggers().some((trigger) => trigger.getHandlerFunction() === handlerName);
  if (!exists) {
    ScriptApp.newTrigger(handlerName)
      .timeBased()
      .everyDays(1)
      .atHour(1)
      .create();
  }
}

function assertPermission_(role, action, module) {
  if (!canRole_(role, action, module)) {
    throw new Error('Role ' + role + ' tidak memiliki izin ' + action + ' pada modul ' + module + '.');
  }
}

function canRole_(role, action, module) {
  const safeRole = sanitizeRole_(role);
  const rolePermission = ROLE_PERMISSIONS[safeRole] || ROLE_PERMISSIONS.Guest;
  const allowed = rolePermission[action] || [];

  if (allowed.indexOf('*') >= 0) {
    return true;
  }
  return allowed.indexOf(module) >= 0;
}

function sanitizeRole_(role) {
  const safe = String(role || '').trim();
  return ROLE_PERMISSIONS[safe] ? safe : 'Guest';
}

function normalizeModuleKey_(moduleKey) {
  const safe = String(moduleKey || '').trim().toLowerCase();
  if (!MODULE_SHEETS[safe] && safe !== 'reports' && safe !== 'dashboard' && safe !== 'about' && safe !== 'stock') {
    throw new Error('Modul tidak valid: ' + moduleKey);
  }
  return safe;
}

function generateId_(module) {
  const prefix = ID_PREFIX[module] || 'ID';
  const stamp = Utilities.formatDate(new Date(), APP_TIMEZONE, 'yyyyMMddHHmmss');
  const rand = Math.floor(Math.random() * 900) + 100;
  return prefix + '-' + stamp + '-' + rand;
}

function adjustCategoryStock_(categoryId, deltaQty) {
  const category = findById_(SHEETS.CATEGORIES, categoryId);
  if (!category) {
    throw new Error('Kategori tidak ditemukan saat update stok: ' + categoryId);
  }

  const oldStock = toNumber_(category.stockKg);
  const newStock = round2_(oldStock + toNumber_(deltaQty));
  if (newStock < 0) {
    throw new Error('Stok kategori ' + category.name + ' tidak cukup.');
  }

  category.stockKg = newStock;
  category.updatedAt = nowText_();
  upsertById_(SHEETS.CATEGORIES, category);
}

function upsertCashFlowByReference_(params) {
  const source = params.source || 'System';
  const referenceId = params.referenceId || '';
  const rows = getRecords_(SHEETS.CASHFLOW);
  const found = rows.find((row) => row.source === source && String(row.referenceId) === String(referenceId));

  const payload = {
    id: found ? found.id : generateId_('cashflow'),
    timestamp: nowText_(),
    date: params.date || formatDate_(new Date()),
    type: params.type || 'IN',
    amount: toNumber_(params.amount),
    source: source,
    referenceId: referenceId,
    description: params.description || '',
    createdBy: params.createdBy || 'System',
    createdAt: found ? found.createdAt : nowText_(),
    updatedAt: nowText_()
  };

  upsertById_(SHEETS.CASHFLOW, payload);
}

function deleteCashFlowByReference_(source, referenceId) {
  const rows = getRecords_(SHEETS.CASHFLOW);
  rows.forEach((row) => {
    if (row.source === source && String(row.referenceId) === String(referenceId)) {
      deleteById_(SHEETS.CASHFLOW, row.id);
    }
  });
}

function upsertById_(sheetName, record) {
  return upsertSheetById_(sheetName, record);
}

function deleteById_(sheetName, id) {
  return deleteSheetById_(sheetName, id);
}

function clearAllRecords_(sheetName) {
  const sheet = getSheet_(sheetName);
  const lastRow = sheet.getLastRow();
  const lastCol = Math.max(sheet.getLastColumn(), SHEET_HEADERS[sheetName].length);
  if (lastRow > 1 && lastCol > 0) {
    sheet.getRange(2, 1, lastRow - 1, lastCol).clearContent();
  }
}

function replaceRecords_(sheetName, rows) {
  clearAllRecords_(sheetName);
  (rows || []).forEach((row) => {
    if (!row || !row.id) return;
    upsertById_(sheetName, row);
  });
}

function findById_(sheetName, id) {
  const rows = getRecords_(sheetName);
  return rows.find((row) => String(row.id) === String(id)) || null;
}

function findRowIndexById_(sheetName, id) {
  const sheet = getSheet_(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return { rowIndex: -1 };
  }

  const headers = values[0];
  const idCol = headers.indexOf('id');
  if (idCol < 0) {
    throw new Error('Kolom id tidak ditemukan pada sheet: ' + sheetName);
  }

  for (let r = 1; r < values.length; r += 1) {
    if (String(values[r][idCol]) === String(id)) {
      return { rowIndex: r + 1 };
    }
  }

  return { rowIndex: -1 };
}

function getRecords_(sheetName) {
  return getSheetRecords_(sheetName);
}

function upsertSheetById_(sheetName, record) {
  const sheet = getSheet_(sheetName);
  const headers = SHEET_HEADERS[sheetName];

  if (!record || !record.id) {
    throw new Error('Record dan ID wajib diisi untuk upsert di ' + sheetName);
  }

  const finder = findRowIndexById_(sheetName, record.id);
  const rowValues = headers.map((header) => toSheetValue_(record[header]));

  if (finder.rowIndex > 0) {
    sheet.getRange(finder.rowIndex, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }
}

function deleteSheetById_(sheetName, id) {
  const finder = findRowIndexById_(sheetName, id);
  if (finder.rowIndex > 0) {
    getSheet_(sheetName).deleteRow(finder.rowIndex);
    return { success: true, id: id };
  }
  throw new Error('Data tidak ditemukan pada sheet ' + sheetName + ' dengan ID ' + id);
}

function getSheetRecords_(sheetName) {
  const sheet = getSheet_(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return [];
  }

  const headers = data[0];
  const records = [];

  for (let i = 1; i < data.length; i += 1) {
    const row = data[i];
    if (!rowHasValue_(row)) {
      continue;
    }

    const obj = {};
    for (let c = 0; c < headers.length; c += 1) {
      obj[headers[c]] = fromSheetValue_(row[c]);
    }
    records.push(obj);
  }

  return records;
}

function getDataEngine_() {
  return DB_ENGINE.SHEETS;
}

function resolveLogoUrl_(inputValue, fallbackValue) {
  const raw = String(inputValue || '').trim();
  const fallback = String(fallbackValue || '').trim();

  if (!raw) {
    return isHttpUrl_(fallback) ? fallback : '';
  }

  if (isHttpUrl_(raw)) {
    return raw;
  }

  const driveMatch = raw.match(/^drive:(.+)$/i);
  if (driveMatch && driveMatch[1]) {
    const found = findDriveImageInDatabaseFolder_(driveMatch[1].trim());
    return found.thumbnailUrl;
  }

  const driveIdMatch = raw.match(/^driveid:(.+)$/i);
  if (driveIdMatch && driveIdMatch[1]) {
    const foundById = findDriveImageInDatabaseFolder_(driveIdMatch[1].trim());
    return foundById.thumbnailUrl;
  }

  // Allow direct file ID for convenience when admin only has the Drive ID.
  if (/^[a-zA-Z0-9_-]{20,}$/.test(raw)) {
    const foundByRawId = findDriveImageInDatabaseFolder_(raw);
    return foundByRawId.thumbnailUrl;
  }

  throw new Error('Logo tidak valid. Gunakan URL http/https, drive:nama-file-gambar.jpg, atau driveid:FILE_ID');
}

function getDatabaseFolder_() {
  const ss = getSpreadsheet_();
  const ssFile = DriveApp.getFileById(ss.getId());
  const parents = ssFile.getParents();
  if (parents.hasNext()) {
    return parents.next();
  }
  return DriveApp.getRootFolder();
}

function buildDriveImageUrl_(fileId, width) {
  const safeWidth = Math.max(120, Number(width || 1200));
  return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(String(fileId || '')) + '&sz=w' + safeWidth;
}

function isFileInFolder_(file, folderId) {
  const parents = file.getParents();
  while (parents.hasNext()) {
    const parent = parents.next();
    if (String(parent.getId()) === String(folderId)) {
      return true;
    }
  }
  return false;
}

function findDriveImageInDatabaseFolder_(fileNameOrId) {
  const key = String(fileNameOrId || '').trim();
  if (!key) {
    throw new Error('Nama file atau file ID gambar wajib diisi.');
  }

  const folder = getDatabaseFolder_();
  let file = null;

  try {
    const byId = DriveApp.getFileById(key);
    const mimeTypeById = String(byId.getMimeType() || '');
    if (mimeTypeById.indexOf('image/') === 0 && isFileInFolder_(byId, folder.getId())) {
      file = byId;
    }
  } catch (err) {
    // Ignore and continue fallback by name.
  }

  if (!file) {
    const files = folder.getFilesByName(key);
    while (files.hasNext()) {
      const candidate = files.next();
      const mimeType = String(candidate.getMimeType() || '');
      if (mimeType.indexOf('image/') === 0) {
        file = candidate;
        break;
      }
    }
  }

  if (!file) {
    throw new Error('Gambar tidak ditemukan di folder yang sama dengan database Spreadsheet: ' + key);
  }

  return {
    id: file.getId(),
    name: file.getName(),
    mimeType: file.getMimeType(),
    url: file.getUrl(),
    thumbnailUrl: buildDriveImageUrl_(file.getId(), 1200),
    folderId: folder.getId(),
    folderName: folder.getName()
  };
}

function tryGetSpreadsheet_() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) {
    return active;
  }

  const propId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (propId) {
    return SpreadsheetApp.openById(propId);
  }
  return null;
}

function getSpreadsheet_() {
  const ss = tryGetSpreadsheet_();
  if (ss) {
    return ss;
  }
  throw new Error('Spreadsheet aktif tidak ditemukan. Buat script ini sebagai bound script di Google Sheet.');
}

function getSheet_(sheetName) {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet tidak ditemukan: ' + sheetName);
  }
  return sheet;
}

function ensureSheetWithHeaders_(sheetName, headers) {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  const currentLastCol = Math.max(sheet.getLastColumn(), headers.length);
  const values = currentLastCol > 0 ? sheet.getDataRange().getValues() : [];
  const firstRow = values.length ? values[0] : [];
  const normalizedCurrent = firstRow.slice(0, headers.length).map((v) => String(v || '').trim());
  const sameHeaders = headers.length === normalizedCurrent.length && headers.every((h, i) => h === normalizedCurrent[i]);

  if (sameHeaders) {
    sheet.setFrozenRows(1);
    return;
  }

  const oldHeaders = firstRow.map((v) => String(v || '').trim());
  const remappedRows = [];

  for (let r = 1; r < values.length; r += 1) {
    const row = values[r];
    if (!rowHasValue_(row)) continue;
    const obj = {};
    for (let c = 0; c < oldHeaders.length; c += 1) {
      if (oldHeaders[c]) {
        obj[oldHeaders[c]] = row[c];
      }
    }
    remappedRows.push(headers.map((header) => {
      const value = obj[header];
      return value === undefined || value === null ? '' : value;
    }));
  }

  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (remappedRows.length) {
    sheet.getRange(2, 1, remappedRows.length, headers.length).setValues(remappedRows);
  }
  sheet.setFrozenRows(1);
}

function rowHasValue_(row) {
  for (let i = 0; i < row.length; i += 1) {
    if (String(row[i]).trim() !== '') {
      return true;
    }
  }
  return false;
}

function toSheetValue_(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return value;
}

function fromSheetValue_(value) {
  if (value instanceof Date) {
    return formatDateTime_(value);
  }
  return value;
}

function toMapById_(rows) {
  const map = {};
  (rows || []).forEach((row) => {
    map[row.id] = row;
  });
  return map;
}

function safeParseJson_(raw, fallback) {
  try {
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    return fallback;
  }
}

function parseDate_(value) {
  if (!value) {
    return null;
  }
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) {
    return null;
  }
  return dateObj;
}

function normalizeUnit_(unit) {
  const safe = String(unit || '').trim().toLowerCase();
  return safe === 'liter' ? 'liter' : 'kg';
}

function resolveKgPerLiter_(category) {
  const value = toNumber_(category && category.kgPerLiter);
  return value > 0 ? value : DEFAULT_KG_PER_LITER;
}

function getCategoryPriceByUnit_(category, unit, kgPerLiter) {
  const safeUnit = normalizeUnit_(unit);
  const factor = kgPerLiter > 0 ? kgPerLiter : DEFAULT_KG_PER_LITER;
  const pricePerLiter = toNumber_(category && category.pricePerLiter);
  const pricePerKg = toNumber_(category && category.pricePerKg);

  if (safeUnit === 'liter') {
    if (pricePerLiter > 0) return pricePerLiter;
    if (pricePerKg > 0) return round2_(pricePerKg * factor);
    return 0;
  }

  if (pricePerKg > 0) return pricePerKg;
  if (pricePerLiter > 0) return round2_(pricePerLiter / factor);
  return 0;
}

function getCategoryCostByUnit_(category, unit, kgPerLiter) {
  const safeUnit = normalizeUnit_(unit);
  const factor = kgPerLiter > 0 ? kgPerLiter : DEFAULT_KG_PER_LITER;
  const costPerLiter = toNumber_(category && category.costPerLiter);
  const costPerKg = toNumber_(category && category.costPerKg);

  if (safeUnit === 'liter') {
    if (costPerLiter > 0) return costPerLiter;
    if (costPerKg > 0) return round2_(costPerKg * factor);
    return 0;
  }

  if (costPerKg > 0) return costPerKg;
  if (costPerLiter > 0) return round2_(costPerLiter / factor);
  return 0;
}

function convertItemQtyToUnit_(item, reportUnit) {
  const unit = normalizeUnit_(reportUnit);
  const qty = toNumber_(item && item.qty);
  const qtyKg = toNumber_(item && item.qtyKg);
  const kgPerLiter = toNumber_(item && item.kgPerLiter);
  const factor = kgPerLiter > 0 ? kgPerLiter : DEFAULT_KG_PER_LITER;
  const itemUnit = normalizeUnit_(item && item.unit);

  if (unit === 'kg') {
    if (qtyKg > 0) return qtyKg;
    if (itemUnit === 'kg') return qty;
    return round2_(qty * factor);
  }

  if (itemUnit === 'liter') return qty;
  if (qtyKg > 0 && factor > 0) return round2_(qtyKg / factor);
  return factor > 0 ? round2_(qty / factor) : 0;
}

function toNumber_(value) {
  const n = Number(value);
  if (isNaN(n)) {
    return 0;
  }
  return n;
}

function round2_(value) {
  return Math.round((toNumber_(value) + Number.EPSILON) * 100) / 100;
}

function formatDate_(dateObj) {
  return Utilities.formatDate(dateObj, APP_TIMEZONE, 'yyyy-MM-dd');
}

function formatDateTime_(dateObj) {
  return Utilities.formatDate(dateObj, APP_TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

function nowText_() {
  return formatDateTime_(new Date());
}

function formatNumber_(value) {
  return Utilities.formatString('%,.0f', toNumber_(value));
}

function isHttpUrl_(value) {
  return /^https?:\/\//i.test(String(value || '').trim());
}
