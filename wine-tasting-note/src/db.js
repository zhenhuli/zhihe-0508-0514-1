const DB_NAME = 'WineTastingDB';
const DB_VERSION = 1;
const STORE_NAME = 'records';

class WineTastingDB {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('无法打开 IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('region', 'region', { unique: false });
        }
      };
    });
  }

  async addRecord(record) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(record);

      request.onsuccess = () => resolve(record.id);
      request.onerror = () => reject(new Error('添加记录失败'));
    });
  }

  async getAllRecords() {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = request.result || [];
        records.sort((a, b) => b.id - a.id);
        resolve(records);
      };
      request.onerror = () => reject(new Error('获取记录失败'));
    });
  }

  async deleteRecord(id) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('删除记录失败'));
    });
  }

  async updateRecord(record) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(record);

      request.onsuccess = () => resolve(record.id);
      request.onerror = () => reject(new Error('更新记录失败'));
    });
  }

  async clearAllRecords() {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('清空记录失败'));
    });
  }
}

export const db = new WineTastingDB();

export const exportToJSON = (records) => {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    records: records
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wine-tasting-records-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importFromJSON = async (file, onSuccess) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.records && Array.isArray(data.records)) {
          resolve(data.records);
        } else {
          reject(new Error('无效的文件格式'));
        }
      } catch (err) {
        reject(new Error('解析 JSON 失败'));
      }
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsText(file);
  });
};

const escapeCSV = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const records = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        if (inQuotes && line[j + 1] === '"') {
          current += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const record = {};
    headers.forEach((header, index) => {
      const value = values[index] || '';
      if (['tannin', 'acidity', 'fruit', 'oak', 'sweetness', 'body', 'year', 'id'].includes(header)) {
        record[header] = parseFloat(value) || 0;
      } else {
        record[header] = value.replace(/^"|"$/g, '').replace(/""/g, '"');
      }
    });
    records.push(record);
  }
  
  return records;
};

export const exportToCSV = (records) => {
  const headers = ['id', 'region', 'year', 'tannin', 'acidity', 'fruit', 'oak', 'sweetness', 'body', 'notes', 'createdAt'];
  const headerNames = ['ID', '产区', '年份', '单宁', '酸度', '果香', '橡木', '甜度', '酒体', '品鉴笔记', '记录日期'];
  
  let csvContent = headerNames.map(escapeCSV).join(',') + '\n';
  
  records.forEach(record => {
    const row = headers.map(header => escapeCSV(record[header]));
    csvContent += row.join(',') + '\n';
  });
  
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wine-tasting-records-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importFromCSV = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvText = e.target.result;
        const records = parseCSV(csvText);
        if (records.length === 0) {
          reject(new Error('CSV 文件中没有数据'));
        } else {
          resolve(records);
        }
      } catch (err) {
        reject(new Error('解析 CSV 失败: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsText(file, 'UTF-8');
  });
};
