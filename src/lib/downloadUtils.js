import JSZip from 'jszip';
import { saveAs } from 'file-saver';
/**
 * Download all project files as ZIP
 */
export async function downloadAllFiles(projectId, content, budget, vendors, materials) {
    const zip = new JSZip();
    // Add renders folder
    const renders = content.filter(c => c.content_type === 'render');
    if (renders.length > 0) {
        const rendersFolder = zip.folder('renders');
        for (let i = 0; i < renders.length; i++) {
            const render = renders[i];
            try {
                const response = await fetch(render.file_url);
                const blob = await response.blob();
                const extension = render.file_name.split('.').pop() || 'jpg';
                rendersFolder?.file(`render_${i + 1}.${extension}`, blob);
            }
            catch (error) {
                console.error(`Failed to download render: ${render.file_name}`, error);
            }
        }
    }
    // Add moodboards folder
    const moodboards = content.filter(c => c.content_type === 'moodboard');
    if (moodboards.length > 0) {
        const moodboardsFolder = zip.folder('moodboards');
        for (let i = 0; i < moodboards.length; i++) {
            const item = moodboards[i];
            try {
                const response = await fetch(item.file_url);
                const blob = await response.blob();
                const extension = item.file_name.split('.').pop() || 'jpg';
                moodboardsFolder?.file(`moodboard_${i + 1}.${extension}`, blob);
            }
            catch (error) {
                console.error(`Failed to download moodboard: ${item.file_name}`, error);
            }
        }
    }
    // Add floorplans folder
    const floorplans = content.filter(c => c.content_type === 'floorplan');
    if (floorplans.length > 0) {
        const floorplansFolder = zip.folder('floorplans');
        for (let i = 0; i < floorplans.length; i++) {
            const item = floorplans[i];
            try {
                const response = await fetch(item.file_url);
                const blob = await response.blob();
                const extension = item.file_name.split('.').pop() || 'pdf';
                floorplansFolder?.file(`floorplan_${i + 1}.${extension}`, blob);
            }
            catch (error) {
                console.error(`Failed to download floorplan: ${item.file_name}`, error);
            }
        }
    }
    // Add budget as JSON and CSV
    if (budget.length > 0) {
        const budgetData = {
            project_id: projectId,
            items: budget,
            total: budget.reduce((sum, item) => sum + (item.total_price || 0), 0),
            generated_at: new Date().toISOString(),
        };
        zip.file('budget.json', JSON.stringify(budgetData, null, 2));
        // Also add as CSV for Excel compatibility
        const csvContent = generateBudgetCSV(budget);
        zip.file('budget.csv', csvContent);
    }
    // Add vendors as JSON and CSV
    if (vendors.length > 0) {
        const vendorsData = {
            project_id: projectId,
            vendors: vendors,
            generated_at: new Date().toISOString(),
        };
        zip.file('vendors.json', JSON.stringify(vendorsData, null, 2));
        const csvContent = generateVendorsCSV(vendors);
        zip.file('vendors.csv', csvContent);
    }
    // Add materials as JSON and CSV
    if (materials && materials.length > 0) {
        const materialsData = {
            project_id: projectId,
            materials: materials,
            generated_at: new Date().toISOString(),
        };
        zip.file('materials.json', JSON.stringify(materialsData, null, 2));
        const csvContent = generateMaterialsCSV(materials);
        zip.file('materials.csv', csvContent);
    }
    // Add README
    const readme = `
# Houspire Design Package

Project ID: ${projectId}
Generated: ${new Date().toLocaleString()}

## Contents

### /renders/
Professional 3D renders of your space from multiple angles.

### /moodboards/
Visual inspiration and style direction boards.

### /floorplans/
Detailed floor plans and layouts.

### budget.json / budget.csv
Itemized budget breakdown with exact costs and quantities.

### vendors.json / vendors.csv
Curated vendor contact list with no-commission pricing.

### materials.json / materials.csv
Material specifications including brands, colors, and finishes.

---

For questions or support:
Email: support@houspire.com
Website: https://houspire.com

© ${new Date().getFullYear()} Houspire. All rights reserved.
`.trim();
    zip.file('README.txt', readme);
    // Generate ZIP
    const zipContent = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
    });
    // Download
    const fileName = `houspire-project-${projectId.slice(0, 8)}.zip`;
    saveAs(zipContent, fileName);
}
/**
 * Generate CSV from budget items
 */
function generateBudgetCSV(budget) {
    const headers = ['Category', 'Item', 'Description', 'Quantity', 'Unit Price (INR)', 'Total (INR)'];
    const rows = budget.map(item => [
        escapeCsvField(item.category || ''),
        escapeCsvField(item.item_name || ''),
        escapeCsvField(item.description || ''),
        item.quantity || 1,
        item.unit_price || 0,
        item.total_price || 0,
    ]);
    const total = budget.reduce((sum, item) => sum + (item.total_price || 0), 0);
    return [
        headers.join(','),
        ...rows.map(row => row.join(',')),
        '',
        `Total,,,,,${total}`,
    ].join('\n');
}
/**
 * Generate CSV from vendors
 */
function generateVendorsCSV(vendors) {
    const headers = ['Name', 'Category', 'Contact Person', 'Phone', 'Email', 'Address', 'Items Supplied', 'Price Range'];
    const rows = vendors.map(vendor => [
        escapeCsvField(vendor.name || ''),
        escapeCsvField(vendor.category || ''),
        escapeCsvField(vendor.contact_person || ''),
        escapeCsvField(vendor.phone || ''),
        escapeCsvField(vendor.email || ''),
        escapeCsvField(vendor.address || ''),
        escapeCsvField(vendor.items_supplied || ''),
        escapeCsvField(vendor.price_range || ''),
    ]);
    return [
        headers.join(','),
        ...rows.map(row => row.join(',')),
    ].join('\n');
}
/**
 * Generate CSV from materials
 */
function generateMaterialsCSV(materials) {
    const headers = ['Category', 'Material Type', 'Brand', 'Color', 'Finish', 'Specifications', 'Price per Unit (INR)', 'Unit'];
    const rows = materials.map(material => [
        escapeCsvField(material.category || ''),
        escapeCsvField(material.material_type || ''),
        escapeCsvField(material.brand || ''),
        escapeCsvField(material.color || ''),
        escapeCsvField(material.finish || ''),
        escapeCsvField(material.specifications || ''),
        material.price_per_unit || 0,
        escapeCsvField(material.unit || ''),
    ]);
    return [
        headers.join(','),
        ...rows.map(row => row.join(',')),
    ].join('\n');
}
/**
 * Escape CSV field to handle commas and quotes
 */
function escapeCsvField(value) {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
/**
 * Download single file
 */
export async function downloadSingleFile(url, filename) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        saveAs(blob, filename);
    }
    catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
}
