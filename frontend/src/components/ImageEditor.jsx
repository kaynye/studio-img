import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Download, RotateCcw, Crop, Palette, Settings, Zap, Image as ImageIcon, Scissors, RotateCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import { ImageProcessor } from '../services/ImageProcessor';

const ImageEditor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [processedPreview, setProcessedPreview] = useState(null);
  const [filters, setFilters] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    sharpen: 0,
    gamma: 1
  });
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [imageMetadata, setImageMetadata] = useState(null);
  const [customSize, setCustomSize] = useState({ width: '', height: '' });
  const [quality, setQuality] = useState(90);
  const [cropMode, setCropMode] = useState(false);
  
  const fileInputRef = useRef(null);
  const imageProcessor = useRef(new ImageProcessor());
  const { toast } = useToast();

  const formats = [
    { id: 'png', name: 'PNG', description: 'Qualité parfaite avec transparence', extension: 'png' },
    { id: 'png-transparent', name: 'PNG Transparent', description: 'Fond transparent automatique', extension: 'png' },
    { id: 'jpeg', name: 'JPEG', description: 'Compression optimisée', extension: 'jpeg' },
    { id: 'webp', name: 'WebP', description: 'Format web moderne', extension: 'webp' },
    { id: 'ico', name: 'ICO', description: 'Icône Windows/Web', extension: 'ico' },
  ];

  const presetSizes = [
    { 
      id: 'favicon', 
      name: 'Favicon Multi-tailles', 
      description: 'Génère automatiquement toutes les tailles',
      action: 'multi-download'
    },
    { 
      id: 'social-facebook', 
      name: 'Facebook Cover', 
      sizes: [{ w: 820, h: 312 }],
      action: 'resize'
    },
    { 
      id: 'social-instagram', 
      name: 'Instagram Post', 
      sizes: [{ w: 1080, h: 1080 }],
      action: 'resize'
    },
    { 
      id: 'social-twitter', 
      name: 'Twitter Header', 
      sizes: [{ w: 1500, h: 500 }],
      action: 'resize'
    },
    { 
      id: 'web-thumbnail', 
      name: 'Thumbnail Web', 
      sizes: [{ w: 300, h: 200 }],
      action: 'resize'
    },
    { 
      id: 'web-banner', 
      name: 'Banner Web', 
      sizes: [{ w: 1200, h: 400 }],
      action: 'resize'
    },
  ];

  const filterDefinitions = [
    { id: 'brightness', name: 'Luminosité', min: -100, max: 100, default: 0, unit: '' },
    { id: 'contrast', name: 'Contraste', min: -100, max: 100, default: 0, unit: '' },
    { id: 'saturation', name: 'Saturation', min: -100, max: 100, default: 0, unit: '' },
    { id: 'blur', name: 'Flou', min: 0, max: 10, default: 0, unit: 'px' },
    { id: 'gamma', name: 'Gamma', min: 0.1, max: 3, default: 1, step: 0.1, unit: '' },
  ];

  // Appliquer les filtres en temps réel
  useEffect(() => {
    if (selectedFile && originalPreview) {
      applyFiltersRealTime();
    }
  }, [filters, selectedFile, originalPreview]);

  const applyFiltersRealTime = async () => {
    if (!selectedFile) return;
    
    try {
      const processedDataUrl = await imageProcessor.current.applyFilters(selectedFile, filters);
      setProcessedPreview(processedDataUrl);
    } catch (error) {
      console.error('Erreur lors de l\'application des filtres:', error);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    } else {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner une image valide.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    
    // Créer le preview original
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalPreview(e.target.result);
      setProcessedPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // Obtenir les métadonnées
    try {
      const metadata = await imageProcessor.current.getImageMetadata(file);
      setImageMetadata(metadata);
      setCustomSize({ width: metadata.width.toString(), height: metadata.height.toString() });
    } catch (error) {
      console.error('Erreur lors de la lecture des métadonnées:', error);
    }

    // Reset filters
    setFilters({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      sharpen: 0,
      gamma: 1
    });
  };

  const handleFilterChange = (filterId, value) => {
    setFilters(prev => ({ ...prev, [filterId]: value[0] }));
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    
    setProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Simuler une progression pour l'expérience utilisateur
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 200);

      let processedDataUrl;
      
      // Si une taille personnalisée est définie
      if (customSize.width && customSize.height) {
        const resizedUrl = await imageProcessor.current.resizeImage(
          selectedFile, 
          parseInt(customSize.width), 
          parseInt(customSize.height), 
          false
        );
        
        // Créer un blob temporaire pour appliquer les filtres
        const response = await fetch(resizedUrl);
        const blob = await response.blob();
        const resizedFile = new File([blob], selectedFile.name, { type: selectedFile.type });
        
        processedDataUrl = await imageProcessor.current.applyAdvancedFilters(resizedFile, filters);
      } else {
        processedDataUrl = await imageProcessor.current.applyAdvancedFilters(selectedFile, filters);
      }
      
      // Convertir au format demandé
      const response = await fetch(processedDataUrl);
      const blob = await response.blob();
      const tempFile = new File([blob], selectedFile.name, { type: selectedFile.type });
      
      const finalDataUrl = await imageProcessor.current.convertToFormat(
        tempFile, 
        selectedFormat, 
        quality / 100
      );
      
      setProcessedPreview(finalDataUrl);
      setProcessingProgress(100);
      
      toast({
        title: "Image traitée avec succès!",
        description: `Format: ${selectedFormat.toUpperCase()}, Qualité: ${quality}%`,
      });
      
    } catch (error) {
      console.error('Erreur lors du traitement:', error);
      toast({
        title: "Erreur de traitement",
        description: "Une erreur s'est produite lors du traitement de l'image.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
      setTimeout(() => setProcessingProgress(0), 1000);
    }
  };

  const handleDownload = () => {
    if (!processedPreview || !selectedFile) return;
    
    const format = formats.find(f => f.id === selectedFormat);
    const filename = selectedFile.name.replace(/\.[^/.]+$/, '');
    
    // Ajouter info sur les dimensions si modifiées
    let finalFilename = filename;
    if (customSize.width && customSize.height) {
      finalFilename = `${filename}_${customSize.width}x${customSize.height}`;
    }
    
    imageProcessor.current.downloadImage(
      processedPreview, 
      finalFilename, 
      format?.extension || 'png'
    );
    
    toast({
      title: "Téléchargement démarré",
      description: `${finalFilename}.${format?.extension || 'png'}`,
    });
  };

  const handlePresetSize = async (preset) => {
    if (!selectedFile) return;
    
    setProcessing(true);
    setProcessingProgress(10);
    
    try {
      if (preset.action === 'multi-download') {
        // Pour les favicons, générer et télécharger toutes les tailles
        const favicons = await imageProcessor.current.generateFavicons(selectedFile);
        setProcessingProgress(60);
        
        // Appliquer les filtres actuels à chaque taille
        const processedFavicons = {};
        for (const [size, dataUrl] of Object.entries(favicons)) {
          // Convertir en blob pour appliquer les filtres
          const response = await fetch(dataUrl);
          const blob = await response.blob();
          const tempFile = new File([blob], `favicon-${size}.png`, { type: 'image/png' });
          
          const processedDataUrl = await imageProcessor.current.applyAdvancedFilters(tempFile, filters);
          processedFavicons[size] = processedDataUrl;
        }
        
        setProcessingProgress(90);
        
        // Télécharger toutes les tailles traitées
        Object.entries(processedFavicons).forEach(([size, dataUrl]) => {
          setTimeout(() => {
            imageProcessor.current.downloadImage(dataUrl, `favicon-${size}`, 'ico');
          }, 100);
        });
        
        setProcessingProgress(100);
        
        toast({
          title: "Favicons générés!",
          description: `Toutes les tailles téléchargées avec filtres appliqués`,
        });
        
      } else if (preset.action === 'resize') {
        // Pour les autres presets, redimensionner et appliquer les filtres
        const targetSize = preset.sizes[0];
        setProcessingProgress(30);
        
        // Redimensionner l'image
        const resizedDataUrl = await imageProcessor.current.resizeImage(
          selectedFile, 
          targetSize.w, 
          targetSize.h, 
          false
        );
        setProcessingProgress(60);
        
        // Convertir en blob pour appliquer les filtres
        const response = await fetch(resizedDataUrl);
        const blob = await response.blob();
        const tempFile = new File([blob], selectedFile.name, { type: selectedFile.type });
        
        // Appliquer les filtres
        const processedDataUrl = await imageProcessor.current.applyAdvancedFilters(tempFile, filters);
        setProcessingProgress(80);
        
        // Convertir au format sélectionné
        const response2 = await fetch(processedDataUrl);
        const blob2 = await response2.blob();
        const tempFile2 = new File([blob2], selectedFile.name, { type: selectedFile.type });
        
        const finalDataUrl = await imageProcessor.current.convertToFormat(
          tempFile2, 
          selectedFormat, 
          quality / 100
        );
        setProcessingProgress(95);
        
        // Mettre à jour le preview et télécharger
        setProcessedPreview(finalDataUrl);
        
        const format = formats.find(f => f.id === selectedFormat);
        const filename = `${preset.name.toLowerCase().replace(/\s+/g, '-')}-${targetSize.w}x${targetSize.h}`;
        
        setTimeout(() => {
          imageProcessor.current.downloadImage(finalDataUrl, filename, format?.extension || 'png');
        }, 100);
        
        // Mettre à jour aussi les dimensions dans l'interface
        setCustomSize({ width: targetSize.w.toString(), height: targetSize.h.toString() });
        
        setProcessingProgress(100);
        
        toast({
          title: `${preset.name} généré!`,
          description: `${targetSize.w}×${targetSize.h} avec filtres appliqués`,
        });
      }
      
    } catch (error) {
      console.error('Erreur preset:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter le preset.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
      setTimeout(() => setProcessingProgress(0), 1000);
    }
  };

  const resetFilters = () => {
    setFilters({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      sharpen: 0,
      gamma: 1
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            ImageCraft Pro
          </h1>
          <p className="text-slate-600 text-lg">Retouche d'image professionnelle - Traitement local instantané</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zone de travail */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Area */}
            <Card className="border-2 border-orange-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700">
                  <ImageIcon className="w-5 h-5" />
                  Zone de travail
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedFile ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                      isDragging 
                        ? 'border-orange-400 bg-orange-50 scale-105' 
                        : 'border-orange-300 hover:border-orange-400 hover:bg-orange-25'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <Upload className="w-16 h-16 mx-auto mb-4 text-orange-400 upload-icon" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                      Glissez votre image ici
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Ou cliquez pour sélectionner un fichier • Traitement 100% local
                    </p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all duration-300"
                    >
                      Choisir une image
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Comparaison avant/après */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Image originale */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-600">Original</Label>
                        <div className="relative rounded-lg overflow-hidden bg-slate-100 border-2 border-slate-200">
                          <img
                            src={originalPreview}
                            alt="Original"
                            className="w-full h-64 object-contain"
                          />
                        </div>
                      </div>
                      
                      {/* Image traitée */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-600">Aperçu traité</Label>
                        <div className="relative rounded-lg overflow-hidden bg-slate-100 border-2 border-orange-200">
                          <img
                            src={processedPreview}
                            alt="Traité"
                            className="w-full h-64 object-contain"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Processing Progress */}
                    {processing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Traitement en cours...</span>
                          <span>{processingProgress}%</span>
                        </div>
                        <Progress value={processingProgress} className="h-2" />
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        onClick={handleProcess}
                        disabled={processing}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {processing ? 'Traitement...' : 'Traiter l\'image'}
                      </Button>
                      <Button 
                        onClick={handleDownload}
                        variant="outline" 
                        className="border-orange-300 text-orange-600 hover:bg-orange-50 transition-all duration-300"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={resetFilters}
                        className="border-amber-300 text-amber-600 hover:bg-amber-50 transition-all duration-300"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset filtres
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedFile(null);
                          setOriginalPreview(null);
                          setProcessedPreview(null);
                          setImageMetadata(null);
                          resetFilters();
                        }}
                        className="border-slate-300 text-slate-600 hover:bg-slate-50 transition-all duration-300"
                      >
                        <RotateCw className="w-4 h-4 mr-2" />
                        Nouvelle image
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panneau de contrôles */}
          <div className="space-y-6">
            {selectedFile && (
              <Card className="border-2 border-amber-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-700">
                    <Settings className="w-5 h-5" />
                    Contrôles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="filters" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="filters">Filtres</TabsTrigger>
                      <TabsTrigger value="resize">Taille</TabsTrigger>
                      <TabsTrigger value="format">Format</TabsTrigger>
                      <TabsTrigger value="presets">Presets</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="filters" className="space-y-4 mt-4">
                      {filterDefinitions.map((filter) => (
                        <div key={filter.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-700">
                              {filter.name}
                            </label>
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                              {filters[filter.id]}{filter.unit}
                            </Badge>
                          </div>
                          <Slider
                            value={[filters[filter.id]]}
                            onValueChange={(value) => handleFilterChange(filter.id, value)}
                            min={filter.min}
                            max={filter.max}
                            step={filter.step || 1}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="resize" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-600">Largeur</Label>
                          <Input
                            type="number"
                            value={customSize.width}
                            onChange={(e) => setCustomSize(prev => ({ ...prev, width: e.target.value }))}
                            placeholder="px"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-slate-600">Hauteur</Label>
                          <Input
                            type="number"
                            value={customSize.height}
                            onChange={(e) => setCustomSize(prev => ({ ...prev, height: e.target.value }))}
                            placeholder="px"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="format" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-slate-700 mb-2 block">
                            Format de sortie
                          </Label>
                          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {formats.map((format) => (
                                <SelectItem key={format.id} value={format.id}>
                                  <div>
                                    <div className="font-medium">{format.name}</div>
                                    <div className="text-xs text-slate-500">{format.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {(selectedFormat === 'jpeg' || selectedFormat === 'webp') && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm font-medium text-slate-700">
                                Qualité
                              </Label>
                              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                                {quality}%
                              </Badge>
                            </div>
                            <Slider
                              value={[quality]}
                              onValueChange={(value) => setQuality(value[0])}
                              min={10}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="presets" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        {presetSizes.map((preset) => (
                          <Card 
                            key={preset.id} 
                            className="p-3 cursor-pointer hover:bg-orange-25 transition-all duration-300 border-orange-200 hover:border-orange-300 hover:shadow-md"
                            onClick={() => handlePresetSize(preset)}
                          >
                            <div className="font-medium text-slate-700 mb-1">{preset.name}</div>
                            {preset.description && (
                              <div className="text-xs text-slate-500 mb-2">{preset.description}</div>
                            )}
                            {preset.sizes && (
                              <div className="flex flex-wrap gap-1">
                                {preset.sizes.map((size, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                                    {size.w}×{size.h}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {preset.action === 'multi-download' && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  16×16
                                </Badge>
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  32×32
                                </Badge>
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  48×48
                                </Badge>
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Métadonnées */}
            {imageMetadata && (
              <Card className="border-2 border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-700 text-base">Métadonnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Nom:</span>
                    <span className="font-medium text-slate-800 truncate ml-2">{imageMetadata.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Dimensions:</span>
                    <span className="font-medium text-slate-800">{imageMetadata.width} × {imageMetadata.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Taille:</span>
                    <span className="font-medium text-slate-800">{Math.round(imageMetadata.size / 1024)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium text-slate-800">{imageMetadata.type}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;