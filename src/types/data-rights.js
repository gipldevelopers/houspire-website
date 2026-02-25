export const COOKIE_CONSENT_VERSION = '1.0.0';
export const COOKIE_CONSENT_KEY = 'houspire_cookie_consent';
export const DATA_RIGHT_TYPES = {
    access: {
        title: 'Right to Access',
        description: 'Request a copy of all personal data we hold about you',
        icon: '📂',
        details: 'You have the right to access your personal data. We will provide you with a copy of your data in a commonly used electronic format within 30 days.',
        whatYouGet: [
            'Account information (name, email, phone)',
            'Order history and payment details',
            'Design files and preferences',
            'Communication history',
            'Any other personal data we process'
        ]
    },
    correction: {
        title: 'Right to Correction',
        description: 'Request correction of inaccurate or incomplete data',
        icon: '✏️',
        details: 'If you believe any of your personal data is inaccurate or incomplete, you have the right to request correction. We will correct the data within 30 days.',
        whatYouGet: [
            'Review and correction of personal details',
            'Update of contact information',
            'Correction of order information',
            'Verification of corrected data'
        ]
    },
    deletion: {
        title: 'Right to Deletion',
        description: 'Request deletion of your personal data (Right to be Forgotten)',
        icon: '🗑️',
        details: 'You can request deletion of your personal data. Please note that we may need to retain certain data for legal or legitimate business purposes.',
        whatYouGet: [
            'Complete account deletion',
            'Removal of personal data from our systems',
            'Confirmation of deletion',
            'Information about data we must retain'
        ]
    },
    portability: {
        title: 'Right to Data Portability',
        description: 'Request your data in a machine-readable format',
        icon: '📦',
        details: 'You have the right to receive your personal data in a structured, commonly used, and machine-readable format (JSON/CSV).',
        whatYouGet: [
            'All personal data in JSON format',
            'Order history in CSV format',
            'Design files and documents',
            'Complete data export package'
        ]
    },
    objection: {
        title: 'Right to Object',
        description: 'Object to processing of your personal data',
        icon: '🚫',
        details: 'You can object to certain types of processing of your personal data, including direct marketing and automated decision-making.',
        whatYouGet: [
            'Stop marketing communications',
            'Opt-out of analytics',
            'Restrict automated processing',
            'Confirmation of objection'
        ]
    },
    restrict: {
        title: 'Right to Restrict Processing',
        description: 'Request restriction of processing your personal data',
        icon: '⏸️',
        details: 'You can request that we temporarily restrict the processing of your data while we verify its accuracy or your objection.',
        whatYouGet: [
            'Temporary halt of data processing',
            'Verification of data accuracy',
            'Resolution of concerns',
            'Notification when restriction is lifted'
        ]
    }
};
