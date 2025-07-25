export const isQuizStartAvailable = (startDateTime) => {
    if (!startDateTime) return false;
    const now = new Date();
    const start = new Date(startDateTime);
    return now >= start;
};

export const isQuizUpcoming = (startDateTime) => {
    if (!startDateTime) return false;
    const now = new Date();
    const start = new Date(startDateTime);
    return now < start;
};

export const formatStartDateTime = (dateTimeString) => {
    try {
        // Convert "00:00 am, 21 Apr 2025" => "21 Apr 2025 00:00 am"
        const [timePart, datePart] = dateTimeString.split(', ');
        const combined = `${datePart} ${timePart}`;

        // Parse into a Date object
        const parsedDate = new Date(combined);

        if (isNaN(parsedDate)) return 'Invalid date';

        // Format it: e.g., "April 21, 2025 at 12:00 AM"
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit',
            // hour12: true,
        }).format(parsedDate);
    } catch (err) {
        return 'Invalid date';
    }
};