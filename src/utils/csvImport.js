import Papa from 'papaparse';

/**
 * Parse CSV file and extract employee IDs
 */
export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const employeeIds = extractEmployeeIdsFromCSV(results.data);
          resolve({
            success: true,
            data: employeeIds,
            totalRows: results.data.length,
            errors: results.errors,
          });
        } catch (error) {
          reject({
            success: false,
            error: error.message,
            data: [],
          });
        }
      },
      error: (error) => {
        reject({
          success: false,
          error: error.message,
          data: [],
        });
      },
    });
  });
};

/**
 * Parse CSV text and extract employee IDs
 */
export const parseCSVText = (csvText) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const employeeIds = extractEmployeeIdsFromCSV(results.data);
          resolve({
            success: true,
            data: employeeIds,
            totalRows: results.data.length,
            errors: results.errors,
          });
        } catch (error) {
          reject({
            success: false,
            error: error.message,
            data: [],
          });
        }
      },
      error: (error) => {
        reject({
          success: false,
          error: error.message,
          data: [],
        });
      },
    });
  });
};

/**
 * Extract employee IDs from parsed CSV data
 */
const extractEmployeeIdsFromCSV = (data) => {
  if (!data || data.length === 0) {
    throw new Error('No data found in CSV');
  }
  
  // Get the first row to determine column names
  const firstRow = data[0];
  const columns = Object.keys(firstRow);
  
  // Try to find the employee ID column
  const employeeIdColumn = findEmployeeIdColumn(columns);
  
  if (!employeeIdColumn) {
    throw new Error('Could not find employee ID column. Expected columns like: id, employee_id, emp_id, employee_number, etc.');
  }
  
  // Extract employee IDs
  const employeeIds = [];
  const duplicates = new Set();
  const invalid = [];
  
  data.forEach((row, index) => {
    const id = row[employeeIdColumn];
    
    if (!id || typeof id !== 'string') {
      invalid.push(`Row ${index + 1}: Empty or invalid ID`);
      return;
    }
    
    const trimmedId = id.trim();
    
    if (trimmedId.length === 0) {
      invalid.push(`Row ${index + 1}: Empty ID`);
      return;
    }
    
    if (trimmedId.length > 20) {
      invalid.push(`Row ${index + 1}: ID too long (${trimmedId})`);
      return;
    }
    
    if (employeeIds.includes(trimmedId)) {
      duplicates.add(trimmedId);
      return;
    }
    
    employeeIds.push(trimmedId);
  });
  
  // Log warnings for duplicates and invalid entries
  if (duplicates.size > 0) {
    console.warn('Duplicate employee IDs found:', Array.from(duplicates));
  }
  
  if (invalid.length > 0) {
    console.warn('Invalid entries found:', invalid);
  }
  
  if (employeeIds.length === 0) {
    throw new Error('No valid employee IDs found in CSV');
  }
  
  return employeeIds;
};

/**
 * Find the column that likely contains employee IDs
 */
const findEmployeeIdColumn = (columns) => {
  const possibleColumns = [
    'id',
    'employee_id',
    'employeeid',
    'emp_id',
    'empid',
    'employee_number',
    'employee_no',
    'employeenumber',
    'staff_id',
    'staffid',
    'badge_number',
    'badge_id',
    'user_id',
    'userid',
    'number',
    'code',
  ];
  
  // First, try exact matches (case insensitive)
  for (const possibleColumn of possibleColumns) {
    const found = columns.find(col => 
      col.toLowerCase() === possibleColumn.toLowerCase()
    );
    if (found) return found;
  }
  
  // Then, try partial matches
  for (const possibleColumn of possibleColumns) {
    const found = columns.find(col => 
      col.toLowerCase().includes(possibleColumn.toLowerCase()) ||
      possibleColumn.toLowerCase().includes(col.toLowerCase())
    );
    if (found) return found;
  }
  
  // If no match found, use the first column
  return columns[0];
};

/**
 * Generate sample CSV content for testing
 */
export const generateSampleCSV = () => {
  const headers = ['employee_id', 'name', 'department'];
  const rows = [];
  
  for (let i = 1; i <= 50; i++) {
    rows.push([
      `EMP${i.toString().padStart(4, '0')}`,
      `Employee ${i}`,
      i <= 20 ? 'IT' : i <= 35 ? 'HR' : 'Finance'
    ]);
  }
  
  return Papa.unparse({
    fields: headers,
    data: rows,
  });
};

/**
 * Export employee IDs to CSV format
 */
export const exportToCSV = (employeeIds, filename = 'employee-ids.csv') => {
  const data = employeeIds.map(id => ({ employee_id: id }));
  const csv = Papa.unparse(data);
  
  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Validate CSV file before parsing
 */
export const validateCSVFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return { valid: false, errors };
  }
  
  // Check file type
  const validTypes = ['text/csv', 'application/csv', 'text/plain'];
  if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.csv')) {
    errors.push('File must be a CSV file');
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push('File size must be less than 10MB');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};
