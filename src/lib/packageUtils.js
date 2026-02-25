// Package utility functions for pricing calculations and cart management
/**
 * Calculate cart summary with all pricing details
 */
export function calculateCartSummary(selectedPackage, selectedAddons, discountPercent = 0) {
    const basePrice = selectedPackage?.price || 0;
    const addonsTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    const subtotal = basePrice + addonsTotal;
    const discountAmount = Math.round(subtotal * (discountPercent / 100));
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = 0; // No tax for now
    const finalPrice = afterDiscount + taxAmount;
    return {
        base_price: basePrice,
        addons_total: addonsTotal,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        final_price: finalPrice,
    };
}
/**
 * Calculate bundle savings
 */
export function calculateBundleSavings(bundle) {
    if (!bundle.is_bundle || !bundle.original_price)
        return 0;
    return bundle.original_price - bundle.price;
}
/**
 * Check if addon is already included in selected addons
 */
export function isAddonSelected(addon, selectedAddons) {
    return selectedAddons.some((a) => a.id === addon.id);
}
/**
 * Toggle addon selection
 */
export function toggleAddon(addon, selectedAddons) {
    if (isAddonSelected(addon, selectedAddons)) {
        return selectedAddons.filter((a) => a.id !== addon.id);
    }
    return [...selectedAddons, addon];
}
/**
 * Group addons by category
 */
export function groupAddonsByCategory(addons) {
    return addons.reduce((groups, addon) => {
        const category = addon.category_display || addon.category || 'Other';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(addon);
        return groups;
    }, {});
}
/**
 * Get bundles from addons list
 */
export function getBundles(addons) {
    return addons.filter((addon) => addon.is_bundle === true);
}
/**
 * Get non-bundle addons
 */
export function getIndividualAddons(addons) {
    return addons.filter((addon) => !addon.is_bundle);
}
/**
 * Format price for display
 */
export function formatPrice(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}
/**
 * Format price range
 */
export function formatPriceRange(min, max) {
    if (min === max)
        return formatPrice(min);
    return `${formatPrice(min)} - ${formatPrice(max)}`;
}
/**
 * Get package room display text
 */
export function getRoomCountDisplay(pkg) {
    if (pkg.room_count_display)
        return pkg.room_count_display;
    if (pkg.room_count_min === pkg.room_count_max) {
        return `${pkg.room_count_min} room${pkg.room_count_min > 1 ? 's' : ''}`;
    }
    return `${pkg.room_count_min}-${pkg.room_count_max} rooms`;
}
/**
 * Validate order draft for checkout
 */
export function validateOrderDraft(draft) {
    const errors = [];
    if (!draft) {
        errors.push('No order draft found');
        return { valid: false, errors };
    }
    if (!draft.package) {
        errors.push('No package selected');
    }
    if (!draft.summary) {
        errors.push('Missing order summary');
    }
    if (draft.summary?.final_price <= 0) {
        errors.push('Invalid order total');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
