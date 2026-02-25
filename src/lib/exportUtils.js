import { supabase } from '@/integrations/supabase/client';
// Room and Style definitions for coverage matrix
const ROOM_CODES = [
    { code: 'LR', dbValue: 'living_room', label: 'Living Room' },
    { code: 'MB', dbValue: 'master_bedroom', label: 'Master Bedroom' },
    { code: 'KB', dbValue: 'kids_bedroom', label: 'Kids Bedroom' },
    { code: 'DR', dbValue: 'dining_room', label: 'Dining Room' },
    { code: 'KT', dbValue: 'kitchen', label: 'Kitchen' },
    { code: 'HO', dbValue: 'home_office', label: 'Home Office' },
    { code: 'BR', dbValue: 'bathroom', label: 'Bathroom' },
    { code: 'PR', dbValue: 'pooja_room', label: 'Pooja Room' },
    { code: 'BL', dbValue: 'balcony', label: 'Balcony' },
    { code: 'EF', dbValue: 'entryway_foyer', label: 'Entryway Foyer' },
];
const STYLE_CODES = [
    { code: 'MOD', dbValue: 'modern_minimalist', label: 'Modern Minimalist' },
    { code: 'CON', dbValue: 'contemporary_indian', label: 'Contemporary Indian' },
    { code: 'TRA', dbValue: 'traditional_indian', label: 'Traditional Indian' },
    { code: 'SCA', dbValue: 'scandinavian', label: 'Scandinavian' },
    { code: 'BOH', dbValue: 'bohemian', label: 'Bohemian' },
    { code: 'IND', dbValue: 'industrial', label: 'Industrial' },
    { code: 'MID', dbValue: 'mid_century_modern', label: 'Mid-Century Modern' },
    { code: 'COA', dbValue: 'coastal_beach', label: 'Coastal Beach' },
    { code: 'RUS', dbValue: 'rustic_farmhouse', label: 'Rustic Farmhouse' },
    { code: 'ART', dbValue: 'art_deco', label: 'Art Deco' },
    { code: 'JAP', dbValue: 'japanese_zen', label: 'Japanese Zen' },
    { code: 'MAX', dbValue: 'maximalist', label: 'Maximalist' },
    { code: 'TRN', dbValue: 'transitional', label: 'Transitional' },
    { code: 'ECL', dbValue: 'eclectic_fusion', label: 'Eclectic Fusion' },
    { code: 'LUX', dbValue: 'luxury_traditional', label: 'Luxury Traditional' },
];
// Helper: Convert array of objects to CSV
function convertToCSV(data, columns) {
    if (!data || data.length === 0)
        return '';
    const cols = columns || Object.keys(data[0]);
    const headers = cols.join(',');
    const rows = data.map((row) => cols
        .map((col) => {
        const value = row[col];
        if (value === null || value === undefined)
            return '';
        const stringValue = String(value).replace(/"/g, '""');
        return stringValue.includes(',') || stringValue.includes('\n')
            ? `"${stringValue}"`
            : stringValue;
    })
        .join(','));
    return [headers, ...rows].join('\n');
}
// Helper: Download CSV file
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
// Helper: Download JSON file
function downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
// Export users to CSV
export async function exportUsersToCSV() {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        const formattedData = (data || []).map((profile) => ({
            user_id: profile.user_id,
            full_name: profile.full_name || '',
            phone: profile.phone || '',
            city: profile.city || '',
            status: profile.status || 'active',
            login_count: profile.login_count || 0,
            last_login_at: profile.last_login_at || '',
            created_at: profile.created_at,
        }));
        const csv = convertToCSV(formattedData);
        downloadCSV(csv, `houspire-users-${new Date().toISOString().split('T')[0]}.csv`);
        return { success: true };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Export failed';
        console.error('Export failed:', error);
        return { success: false, error: errorMessage };
    }
}
// Export projects to CSV
export async function exportProjectsToCSV() {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        const formattedData = (data || []).map((project) => ({
            project_id: project.id,
            user_id: project.user_id,
            room_type: project.room_type,
            workflow_phase: project.workflow_phase,
            phase_status: project.phase_status,
            payment_status: project.payment_status,
            designer_persona: project.designer_persona || '',
            design_style: project.design_style || '',
            total_paid: project.total_paid,
            currency: project.currency,
            created_at: project.created_at,
            updated_at: project.updated_at,
        }));
        const csv = convertToCSV(formattedData);
        downloadCSV(csv, `houspire-projects-${new Date().toISOString().split('T')[0]}.csv`);
        return { success: true };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Export failed';
        console.error('Export failed:', error);
        return { success: false, error: errorMessage };
    }
}
// Export reviews to CSV
export async function exportReviewsToCSV() {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        const formattedData = (data || []).map((review) => ({
            review_id: review.id,
            user_id: review.user_id,
            project_id: review.project_id,
            rating: review.rating,
            title: review.title || '',
            comment: review.comment,
            published: review.published,
            helpful_count: review.helpful_count || 0,
            admin_response: review.admin_response || '',
            created_at: review.created_at,
        }));
        const csv = convertToCSV(formattedData);
        downloadCSV(csv, `houspire-reviews-${new Date().toISOString().split('T')[0]}.csv`);
        return { success: true };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Export failed';
        console.error('Export failed:', error);
        return { success: false, error: errorMessage };
    }
}
// Export analytics report as JSON
export async function exportAnalyticsReport(startDate, endDate) {
    try {
        // Get projects in date range
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .order('created_at', { ascending: false });
        if (projectsError)
            throw projectsError;
        // Get payment transactions
        const { data: payments, error: paymentsError } = await supabase
            .from('payment_transactions')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString());
        if (paymentsError)
            throw paymentsError;
        // Calculate summary
        const totalProjects = projects?.length || 0;
        const completedProjects = projects?.filter(p => p.workflow_phase === 'completed').length || 0;
        const totalRevenue = payments?.filter(p => p.status === 'captured').reduce((sum, p) => sum + p.amount, 0) || 0;
        const report = {
            summary: {
                total_projects: totalProjects,
                completed_projects: completedProjects,
                completion_rate: totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0,
                total_revenue: totalRevenue,
                average_order_value: totalProjects > 0 ? (totalRevenue / totalProjects).toFixed(2) : 0,
            },
            projects: projects,
            payments: payments,
            generated_at: new Date().toISOString(),
            date_range: {
                start: startDate.toISOString().split('T')[0],
                end: endDate.toISOString().split('T')[0],
            },
        };
        downloadJSON(report, `houspire-analytics-${new Date().toISOString().split('T')[0]}.json`);
        return { success: true };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Export failed';
        console.error('Export failed:', error);
        return { success: false, error: errorMessage };
    }
}
// Export gallery coverage matrix as CSV
export async function exportGalleryCoverageMatrix() {
    try {
        // Fetch all room_type and style_primary from gallery_designs
        const { data, error } = await supabase
            .from('gallery_designs')
            .select('room_type, style_primary');
        if (error)
            throw error;
        // Build pivot matrix counting each room/style combination
        const matrix = {};
        const styleTotals = {};
        // Initialize matrix with zeros
        for (const room of ROOM_CODES) {
            matrix[room.dbValue] = {};
            for (const style of STYLE_CODES) {
                matrix[room.dbValue][style.code] = 0;
            }
        }
        // Initialize style totals
        for (const style of STYLE_CODES) {
            styleTotals[style.code] = 0;
        }
        // Count occurrences
        for (const row of data || []) {
            const roomKey = row.room_type;
            const styleEntry = STYLE_CODES.find(s => s.dbValue === row.style_primary);
            if (matrix[roomKey] && styleEntry) {
                matrix[roomKey][styleEntry.code]++;
                styleTotals[styleEntry.code]++;
            }
        }
        // Generate CSV rows
        const styleCodes = STYLE_CODES.map(s => s.code);
        const headers = ['Room', ...styleCodes, 'TOTAL'];
        const rows = [];
        let grandTotal = 0;
        for (const room of ROOM_CODES) {
            const rowData = matrix[room.dbValue];
            const rowTotal = styleCodes.reduce((sum, code) => sum + rowData[code], 0);
            grandTotal += rowTotal;
            rows.push([
                room.dbValue,
                ...styleCodes.map(code => String(rowData[code])),
                String(rowTotal)
            ]);
        }
        // Add totals row
        rows.push([
            'TOTAL',
            ...styleCodes.map(code => String(styleTotals[code])),
            String(grandTotal)
        ]);
        // Convert to CSV string
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        // Trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `houspire-gallery-coverage-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return { success: true };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Export failed';
        console.error('Export failed:', error);
        return { success: false, error: errorMessage };
    }
}
