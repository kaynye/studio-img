// Mock data for image editor
export const mockFilters = [
  { id: 'brightness', name: 'Luminosité', min: -100, max: 100, default: 0 },
  { id: 'contrast', name: 'Contraste', min: -100, max: 100, default: 0 },
  { id: 'saturation', name: 'Saturation', min: -100, max: 100, default: 0 },
  { id: 'blur', name: 'Flou', min: 0, max: 10, default: 0 },
  { id: 'sharpen', name: 'Netteté', min: 0, max: 10, default: 0 },
  { id: 'gamma', name: 'Gamma', min: 0.1, max: 3, default: 1 },
];

export const mockFormats = [
  { id: 'png', name: 'PNG', description: 'Qualité parfaite avec transparence' },
  { id: 'png-transparent', name: 'PNG Transparent', description: 'Fond transparent automatique' },
  { id: 'jpeg', name: 'JPEG', description: 'Compression optimisée' },
  { id: 'webp', name: 'WebP', description: 'Format web moderne' },
  { id: 'ico', name: 'ICO', description: 'Icône Windows' },
  { id: 'svg', name: 'SVG', description: 'Vectoriel redimensionnable' },
];

export const mockPresets = [
  { id: 'favicon', name: 'Favicon', sizes: ['16x16', '32x32', '48x48'] },
  { id: 'social', name: 'Réseaux sociaux', sizes: ['1200x630', '1080x1080', '1200x675'] },
  { id: 'web', name: 'Web responsive', sizes: ['320w', '768w', '1200w', '1920w'] },
  { id: 'print', name: 'Impression', sizes: ['300dpi A4', '300dpi A3'] },
];

export const mockProcessingHistory = [
  { id: 1, action: 'Upload', timestamp: '2025-01-20 14:30:15', file: 'image.jpg' },
  { id: 2, action: 'Resize', timestamp: '2025-01-20 14:30:45', details: '800x600' },
  { id: 3, action: 'Filter Applied', timestamp: '2025-01-20 14:31:12', details: 'Brightness +20' },
];

// Mock processing function
export const mockProcessImage = (file, operations) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        processedUrl: URL.createObjectURL(file), // Use original for mock
        metadata: {
          originalSize: file.size,
          newSize: Math.floor(file.size * 0.8), // Mock compression
          format: operations.format || 'png',
          dimensions: operations.dimensions || '800x600',
        }
      });
    }, 2000); // Simulate processing time
  });
};