'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { dataGet } from '@/lib/frontend-data';
import { motion } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  Download, 
  Eye, 
  FileText, 
  Image, 
  Palette, 
  Package,
  Loader2,
  FolderOpen,
  CheckSquare,
  Square,
  ZoomIn
} from 'lucide-react';

const FILE_TYPE_ICONS = {
  render: Image,
  moodboard: Palette,
  floorplan: FileText,
  document: Package,
};

const FILE_TYPE_LABELS = {
  render: 'Room Designs',
  moodboard: 'Moodboards',
  floorplan: 'Floor Plans',
  document: 'Documents',
};

export function ProjectFilesTab({ project }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [project.id]);

  const fetchFiles = async () => {
    try {
      const data = await dataGet(`/projects/${project.id}/files?published=true`);
      setFiles(data || []);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const selectAllInCategory = (category) => {
    const categoryFiles = files.filter(f => f.content_type === category);
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      const allSelected = categoryFiles.every(f => newSet.has(f.id));
      categoryFiles.forEach(f => {
        if (allSelected) {
          newSet.delete(f.id);
        } else {
          newSet.add(f.id);
        }
      });
      return newSet;
    });
  };

  const downloadAsZip = async () => {
    if (selectedFiles.size === 0) return;
    
    setDownloadingZip(true);
    const zip = new JSZip();
    
    const filesToDownload = files.filter(f => selectedFiles.has(f.id));
    
    for (const file of filesToDownload) {
      try {
        const response = await fetch(file.file_url);
        const blob = await response.blob();
        zip.file(file.file_name, blob);
      } catch (error) {
        console.error(`Failed to download ${file.file_name}:`, error);
      }
    }
    
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `project-files-${project.id.slice(0, 8)}.zip`);
    setDownloadingZip(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h4 className="text-lg font-semibold text-foreground mb-2">
          No files yet
        </h4>
        <p className="text-muted-foreground">
          Your design package will be available here
        </p>
      </div>
    );
  }

  // Group files by type
  const groupedFiles = files.reduce((acc, file) => {
    const type = file.content_type || 'document';
    if (!acc[type]) acc[type] = [];
    acc[type].push(file);
    return acc;
  }, {});

  const isImage = (type) => type === 'render' || type === 'moodboard';

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      {files.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (selectedFiles.size === files.length) {
                  setSelectedFiles(new Set());
                } else {
                  setSelectedFiles(new Set(files.map(f => f.id)));
                }
              }}
              className="h-8"
            >
              {selectedFiles.size === files.length ? (
                <CheckSquare className="h-4 w-4 mr-2" />
              ) : (
                <Square className="h-4 w-4 mr-2" />
              )}
              {selectedFiles.size === files.length ? 'Deselect All' : 'Select All'}
            </Button>
            <span className="text-sm text-muted-foreground">
              {selectedFiles.size} selected
            </span>
          </div>
          <Button
            onClick={downloadAsZip}
            disabled={selectedFiles.size === 0 || downloadingZip}
            size="sm"
            className="h-8"
          >
            {downloadingZip ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download ZIP
          </Button>
        </div>
      )}

      {/* Files by Category */}
      {Object.entries(groupedFiles).map(([type, typeFiles]) => {
        const Icon = FILE_TYPE_ICONS[type] || Package;
        const label = FILE_TYPE_LABELS[type] || type;
        const allSelected = typeFiles.every(f => selectedFiles.has(f.id));

        return (
          <div key={type}>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => selectAllInCategory(type)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label} ({typeFiles.length})
                {allSelected && <Badge variant="secondary" className="text-xs ml-2">All</Badge>}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {typeFiles.map((file, idx) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`group rounded-xl border overflow-hidden transition-all duration-300 ${
                    selectedFiles.has(file.id) 
                      ? 'border-accent ring-2 ring-accent/20' 
                      : 'border-border/50 hover:shadow-lg'
                  }`}
                >
                  {/* File Preview */}
                  <div className="aspect-square bg-muted relative">
                    {isImage(type) ? (
                      <>
                        <img
                          src={file.file_url}
                          alt={file.file_name}
                          className="w-full h-full object-cover"
                        />
                        <Dialog>
                          <DialogTrigger asChild>
                            <button 
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                              onClick={() => setPreviewImage(file.file_url)}
                            >
                              <ZoomIn className="h-6 w-6 text-white" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl p-0 bg-black border-0">
                            <img
                              src={file.file_url}
                              alt={file.file_name}
                              className="w-full h-auto"
                            />
                          </DialogContent>
                        </Dialog>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}

                    {/* Selection Checkbox */}
                    <button
                      onClick={() => toggleFileSelection(file.id)}
                      className={`absolute top-2 left-2 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                        selectedFiles.has(file.id)
                          ? 'bg-accent border-accent text-white'
                          : 'bg-background/80 border-muted-foreground/30 hover:border-accent'
                      }`}
                    >
                      {selectedFiles.has(file.id) && (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    {/* Action Buttons */}
                    <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => window.open(file.file_url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8"
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = file.file_url;
                          a.download = file.file_name;
                          a.click();
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{file.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(file.published_at || file.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}


