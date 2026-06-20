import { Validators } from "@angular/forms";
import { I18nService } from "../services/i18n/i18n.service";

export const formEqual = (object1: any, object2: any) => {

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2); 
  
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {

    return shallowEqual(object1[key], object2[key]);
    
  }

  return true

}


/**
 * The shallow equality check of objects get the list of properties (using Object.keys()) of both objects, 
 * then check the properties' values for equality.
 * 
 * @param object1 
 * @param object2 
 * @returns {boolean}
 */
export const shallowEqual = (object1: any, object2: any): boolean => {

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);  

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {

    if (object1[key] !== object2[key]) {  
      return false;
    }
  }

  return true;

}

/**
 * During the deep equality object check, if the values being compared are objects, 
 * then a recursive equality check is performed on these nested objects.
 * 
 * @param object1 
 * @param object2 
 * @returns {boolean}
 */
export const deepEqual = (object1: any, object2: any): boolean => {

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      areObjects && !deepEqual(val1, val2) ||
      !areObjects && val1 !== val2
    ) {
      return false;
    }
  }

  return true;

}

/**
 * Checks if variable is object
 * 
 * @param object 
 * @returns {boolean}
 */
export const isObject = (object: any): boolean => {

  return object != null && typeof object === 'object';

}

/**
 * Converts coordinates from EPSG:4326 to EPSG:3857
 * 
 * @param coordinates 
 * @returns {number[]}
 */
export const epsg3857toEpsg4326 = (coordinates: number[]): number[] => {

  const [x, y] = coordinates;
  const lon = x * 180 / 20037508.34;
  const lat = Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;

  return [lon, lat];

}

/**
 * Returns an object with validators for Angular forms.
 * 
 * @param validators - Array of validator functions.
 * @returns {object} Object containing the validators.
 */
export const getValidators = (validators: any[]) => {

    return {
      validators: Validators.compose(validators)
    };

}

/**
 * Parses a CSV file and returns an array of objects representing the data.
 * Each object corresponds to a row in the CSV, with keys based on the header row.
 * 
 * @param file - The CSV file to parse.
 * @returns {Promise<any[]>} Promise that resolves to an array of objects.
 */
export const parseCSVFile = (file: File): Promise<any[]> => {

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string;
          const rows = csvText.split('\n').filter(row => row.trim());
          
          if (rows.length === 0) {
            reject(new Error('Empty CSV file'));
            return;
          }

          // Parse header row
          const headers = rows[0].split(',').map(header => header.trim().replace(/"/g, ''));
          
          // Parse data rows
          const data = rows.slice(1).map(row => {
            const values = row.split(',').map(value => value.trim().replace(/"/g, ''));
            const rowData: any = {};
            
            headers.forEach((header, index) => {
              rowData[header] = values[index] || '';
            });
            
            return rowData;
          });

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });

}


/**
 * Validates CSV data against required fields and returns a validation result.
 * 
 * @param data - The parsed CSV data as an array of objects.
 * @param requiredFields - An array of required field names.
 * @param i18n - An instance of I18nService for translations.
 * @returns {object} Validation result containing isValid and message.
 */
export const validateCSVData = (data: any[], requiredFields: string[], i18n: I18nService): { isValid: boolean; message: string } => {

    if (data.length === 0) {
      return { isValid: false, message: i18n.translate('error.emptyCsvFile') };
    }

    // const requiredFields = ['ProductName', 'OperationName', 'Description', 'WorkersNumber', 'NumberOfOperation', 'MinutesForNorm', 'IsCutting', 'IsBalanced'];
    const firstRow = data[0];    
    
    for (const field of requiredFields) {

      if (!firstRow.hasOwnProperty(field)) {
        return { 
          isValid: false, 
          message: i18n.translate('error.missingRequiredField', { field }) 
        };
      }
    }

    return { isValid: true, message: '' };

}


/**
 * Date selector filter function to prevent future dates from being selected.
 * This function is used in date pickers to restrict the selectable dates.
 * It allows today's date and past dates, but prevents future dates.
 * 
 * @param d 
 * @returns 
 */
export const dateSelectorFilter = (d: Date | null): boolean => {
  const date = d || new Date();
  const today = new Date();
  
  // Reset time to compare only dates (not time)
  today.setHours(23, 59, 59, 999);
  
  // Prevent future dates from being selected
  return date <= today;
}

/**
 * Returns a color string based on efficiency value.
 * 
 * @param efficiency 
 * @returns 
 */
export const getEfficiencyColor = (efficiency: number): string => {

    if (efficiency >= 100) return 'success';
    if (efficiency >= 95) return 'warning';
    return 'error';

}

/**
 * Converts minutes to hours and minutes format.
 * 
 * @param minutes - Total number of minutes to convert
 * @returns Formatted string in "XXh YYmin" format (e.g., "06h 15min")
 * 
 * @example
 * convertMinutesToHoursAndMinutes(375) // Returns "06h 15min"
 * convertMinutesToHoursAndMinutes(60)  // Returns "01h 00min"
 * convertMinutesToHoursAndMinutes(45)  // Returns "00h 45min"
 */
export const convertMinutesToHoursAndMinutes = (minutes: number): string => {
  
  if (!minutes || minutes < 0) {
    return '00h 00min';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);

  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = remainingMinutes.toString().padStart(2, '0');

  return `${hoursStr}h ${minutesStr}min`;

}

/**
 * Week utilities for year/week date picker functionality
 */

/**
 * Gets the ISO week number for a given date
 * @param date - The date to get the week number for
 * @returns The ISO week number (1-53)
 */
export const getISOWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

/**
 * Gets the ISO week year for a given date
 * @param date - The date to get the week year for
 * @returns The ISO week year
 */
export const getISOWeekYear = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
};

/**
 * Formats a date as year and week string (e.g., "2025-W39")
 * @param date - The date to format
 * @returns Formatted year-week string
 */
export const formatDateAsYearWeek = (date: Date): string => {
  const year = getISOWeekYear(date);
  const week = getISOWeekNumber(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
};

/**
 * Creates a date from year and week number
 * @param year - The year
 * @param week - The week number
 * @returns Date object for the Monday of the specified week
 */
export const createDateFromYearWeek = (year: number, week: number): Date => {
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const dayOfWeek = jan1.getUTCDay() || 7;
  const daysToMonday = dayOfWeek <= 4 ? 1 - dayOfWeek : 8 - dayOfWeek;
  const firstMonday = new Date(Date.UTC(year, 0, 1 + daysToMonday));
  const targetDate = new Date(firstMonday);
  targetDate.setUTCDate(firstMonday.getUTCDate() + (week - 1) * 7);
  return targetDate;
};

/**
 * Parses a year-week string (e.g., "2025-W39") into year and week numbers
 * @param yearWeekString - String in format "YYYY-WXX"
 * @returns Object with year and week properties, or null if invalid
 */
export const parseYearWeekString = (yearWeekString: any): { year: number; week: number } | null => {
  // Check if input is a string
  if (typeof yearWeekString !== 'string') {
    return null;
  }
  
  const match = yearWeekString.match(/^(\d{4})-W(\d{1,2})$/);
  if (!match) return null;
  
  const year = parseInt(match[1], 10);
  const week = parseInt(match[2], 10);
  
  if (week < 1 || week > 53) return null;
  
  return { year, week };
};

/**
 * Gets the Monday (start) of the week for any given date
 * @param date - Any date in the week
 * @returns Date object for the Monday of that week
 */
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, so adjust
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Gets the Sunday (end) of the week for any given date
 * @param date - Any date in the week
 * @returns Date object for the Sunday of that week
 */
export const getWeekEnd = (date: Date): Date => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
};

/**
 * Formats a date range as a readable string
 * @param startDate - Start date of the range
 * @param endDate - End date of the range
 * @param short - Whether to use short format
 * @returns Formatted date range string
 */
export const formatDateRange = (startDate: Date, endDate: Date, short: boolean = false): string => {
  const options: Intl.DateTimeFormatOptions = short 
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' };
  
  const startStr = startDate.toLocaleDateString('en-US', options);
  const endStr = endDate.toLocaleDateString('en-US', options);
  
  // If same month and year, show "Jan 15 - 21, 2025"
  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const monthYear = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${monthYear} ${startDay} - ${endDay}`;
  }
  
  return `${startStr} - ${endStr}`;
};

// Helper function to get time string from Date object (HH:mm format)
export const getTimeString = (date: Date | string | null): string | null => {
    if (!date) return null;
    if (typeof date === 'string') return date;
    if (date instanceof Date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    return null;
};

// Helper function to calculate shift duration in hours
export const getShiftDuration = (startTime: string | null, endTime: string | null): number | null => {
    if (!startTime || !endTime) return null;
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let startTotalMinutes = startHours * 60 + startMinutes;
    let endTotalMinutes = endHours * 60 + endMinutes;
    
    // Handle shifts that cross midnight
    if (endTotalMinutes <= startTotalMinutes) {
        endTotalMinutes += 24 * 60; // Add 24 hours
    }
    
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    return durationMinutes / 60; // Convert to hours
};
