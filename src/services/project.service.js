import { appDataClient } from '@/lib/static-client';

export const projectService = {
  async createProject(projectData = {}) {
    try {
      const payload = {
        title: projectData.title || 'Untitled Project',
        description: projectData.description || '',
        project_type: projectData.projectType || 'CUSTOM',
        address: projectData.address || '',
        city: projectData.city || '',
        pincode: projectData.pincode || null,
        country: projectData.country || 'India',
        area_sq_ft: projectData.areaSqFt || null,
        selected_style_id: projectData.selectedStyleId || null,
        status: projectData.status || 'draft',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await appDataClient
        .from('projects')
        .insert(payload)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: {
          project: data,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create project',
      };
    }
  },
};
