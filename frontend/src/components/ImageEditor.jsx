import React, { useState, useCallback, useRef } from 'react';
import { Upload, Download, RotateCcw, Crop, Palette, Settings, Zap, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { useToast } from '../hooks/use-toast';
import { mockFilters, mockFormats, mockPresets, mockProcessImage } from '../mock';

const ImageEditor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [filters, setFilters] = useState({});
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

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

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    
    // Reset filters
    setFilters(mockFilters.reduce((acc, filter) => ({
      ...acc,
      [filter.id]: filter.default
    }), {}));
  };

  const handleFilterChange = (filterId, value) => {
    setFilters(prev => ({ ...prev, [filterId]: value[0] }));
  };

  const handleProcess = async () => {
    if (!selectedFile) return;
    
    setProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result = await mockProcessImage(selectedFile, {
        filters,
        format: selectedFormat,
      });
      
      setProcessingProgress(100);
      
      if (result.success) {
        toast({
          title: "Image traitée avec succès!",
          description: `Format: ${result.metadata.format.toUpperCase()}, Taille: ${Math.round(result.metadata.newSize / 1024)}KB`,
        });
      }
    } catch (error) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            ImageCraft Pro
          </h1>
          <p className="text-slate-600 text-lg">Retouche d'image professionnelle avec conversion de formats</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Area */}
          <div className="lg:col-span-2">
            <Card className="h-full border-2 border-orange-200 shadow-lg">
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
                    <Upload className="w-16 h-16 mx-auto mb-4 text-orange-400" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                      Glissez votre image ici
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Ou cliquez pour sélectionner un fichier
                    </p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
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
                    {/* Preview */}
                    <div className="relative rounded-lg overflow-hidden bg-slate-100 border-2 border-orange-200">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-96 object-contain"
                        style={{
                          filter: `
                            brightness(${100 + (filters.brightness || 0)}%)
                            contrast(${100 + (filters.contrast || 0)}%)
                            saturate(${100 + (filters.saturation || 0)}%)
                            blur(${filters.blur || 0}px)
                          `
                        }}
                      />
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
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {processing ? 'Traitement...' : 'Traiter l\'image'}
                      </Button>
                      <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedFile(null);
                          setPreview(null);
                          setFilters({});
                        }}
                        className="border-slate-300 text-slate-600 hover:bg-slate-50"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Nouvelle image
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
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
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="filters">Filtres</TabsTrigger>
                      <TabsTrigger value="format">Format</TabsTrigger>
                      <TabsTrigger value="presets">Presets</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="filters" className="space-y-4 mt-4">
                      {mockFilters.map((filter) => (
                        <div key={filter.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-slate-700">
                              {filter.name}
                            </label>
                            <span className="text-xs text-slate-500">
                              {filters[filter.id] || filter.default}
                            </span>
                          </div>
                          <Slider
                            value={[filters[filter.id] || filter.default]}
                            onValueChange={(value) => handleFilterChange(filter.id, value)}
                            min={filter.min}
                            max={filter.max}
                            step={filter.id === 'gamma' ? 0.1 : 1}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="format" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Format de sortie
                        </label>
                        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {mockFormats.map((format) => (
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
                    </TabsContent>
                    
                    <TabsContent value="presets" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        {mockPresets.map((preset) => (
                          <Card key={preset.id} className="p-3 cursor-pointer hover:bg-orange-25 transition-colors border-orange-200">
                            <div className="font-medium text-slate-700 mb-1">{preset.name}</div>
                            <div className="flex flex-wrap gap-1">
                              {preset.sizes.map((size) => (
                                <Badge key={size} variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                                  {size}
                                </Badge>
                              ))}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* File Info */}
            {selectedFile && (
              <Card className="border-2 border-slate-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-slate-700">Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Nom:</span>
                    <span className="font-medium text-slate-800">{selectedFile.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Taille:</span>
                    <span className="font-medium text-slate-800">{Math.round(selectedFile.size / 1024)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium text-slate-800">{selectedFile.type}</span>
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