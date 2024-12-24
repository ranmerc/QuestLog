/**
 * Formats a date into a localized MM/DD string format
 * Falls back to manual formatting if Intl is not available
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string in MM/DD format
 */
export const formatLocalDate = (date) => {
    try {
        return new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    } catch (e) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
    }
};

/**
 * Gets the user's current timezone
 * Falls back to UTC if timezone detection fails
 * @returns {string} Timezone identifier (e.g., 'America/New_York')
 */
export const getUserTimezone = () => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
        return 'UTC';
    }
};

/**
 * Calculates start and end dates for a given number of days
 * End date is set to end of current day
 * Start date is set to beginning of (days - 1) days ago
 * @param {number} days - Number of days to include in range
 * @returns {Object} Object containing startDate and endDate
 */
export const getDateRange = (days = 7) => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);
    
    return { startDate, endDate };
};

/**
 * Generates an array of dates and their formatted labels
 * Used for chart axis labels and data point mapping
 * @param {number} numDays - Number of days to generate
 * @returns {Array} Array of objects containing date and formatted label
 */
export const calculateDays = (numDays) => {
    const days = [];
    const endDate = new Date();
    
    for (let i = numDays - 1; i >= 0; i--) {
        const date = new Date(endDate);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        days.push({
            date,
            label: formatLocalDate(date)
        });
    }
    return days;
};

/**
 * Checks if two dates fall on the same calendar day in local time
 * Ignores time component when comparing
 * @param {Date|string} date1 - First date to compare
 * @param {Date|string} date2 - Second date to compare
 * @returns {boolean} True if dates are on same calendar day
 */
export const isSameLocalDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

/**
 * Sets time to start of day (00:00:00.000) for the given date
 * Useful for date range comparisons
 * @param {Date|string} date - Date to modify
 * @returns {Date} New date object set to start of day
 */
export const startOfLocalDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};

/**
 * Sets time to end of day (23:59:59.999) for the given date
 * Useful for date range comparisons
 * @param {Date|string} date - Date to modify
 * @returns {Date} New date object set to end of day
 */
export const endOfLocalDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
};
