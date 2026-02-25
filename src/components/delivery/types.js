// Types for AI-generated design deliverables
// Check if design_files contains AI-generated content
export function isAIGeneratedDesign(designFiles) {
    return designFiles &&
        typeof designFiles === 'object' &&
        designFiles.ai_generated === true &&
        designFiles.concept &&
        Array.isArray(designFiles.color_palette) &&
        Array.isArray(designFiles.renders);
}
