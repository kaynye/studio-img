// Service de traitement d'image côté client
export class ImageProcessor {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  // Charger une image depuis un fichier
  async loadImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Appliquer des filtres à une image
  async applyFilters(imageFile, filters) {
    const img = await this.loadImage(imageFile);
    
    this.canvas.width = img.width;
    this.canvas.height = img.height;
    
    // Dessiner l'image originale
    this.ctx.drawImage(img, 0, 0);
    
    // Appliquer les filtres CSS pour un rendu rapide
    this.ctx.filter = this.buildFilterString(filters);
    this.ctx.drawImage(img, 0, 0);
    
    // Réinitialiser le filtre
    this.ctx.filter = 'none';
    
    return this.canvas.toDataURL();
  }

  // Appliquer des filtres avancés pixel par pixel
  async applyAdvancedFilters(imageFile, filters) {
    const img = await this.loadImage(imageFile);
    
    this.canvas.width = img.width;
    this.canvas.height = img.height;
    this.ctx.drawImage(img, 0, 0);
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    // Appliquer les filtres pixel par pixel
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      let a = data[i + 3];
      
      // Luminosité
      if (filters.brightness !== undefined) {
        const brightness = filters.brightness / 100;
        r = Math.min(255, Math.max(0, r + brightness * 255));
        g = Math.min(255, Math.max(0, g + brightness * 255));
        b = Math.min(255, Math.max(0, b + brightness * 255));
      }
      
      // Contraste
      if (filters.contrast !== undefined) {
        const contrast = (filters.contrast + 100) / 100;
        r = Math.min(255, Math.max(0, (r - 128) * contrast + 128));
        g = Math.min(255, Math.max(0, (g - 128) * contrast + 128));
        b = Math.min(255, Math.max(0, (b - 128) * contrast + 128));
      }
      
      // Gamma
      if (filters.gamma !== undefined && filters.gamma !== 1) {
        const gamma = filters.gamma;
        r = 255 * Math.pow(r / 255, 1 / gamma);
        g = 255 * Math.pow(g / 255, 1 / gamma);
        b = 255 * Math.pow(b / 255, 1 / gamma);
      }
      
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = a;
    }
    
    // Saturation (conversion RGB vers HSL)
    if (filters.saturation !== undefined && filters.saturation !== 0) {
      this.applySaturation(data, filters.saturation);
    }
    
    this.ctx.putImageData(imageData, 0, 0);
    return this.canvas.toDataURL();
  }

  // Construire la chaîne de filtres CSS
  buildFilterString(filters) {
    const filterParts = [];
    
    if (filters.brightness !== undefined && filters.brightness !== 0) {
      filterParts.push(`brightness(${100 + filters.brightness}%)`);
    }
    
    if (filters.contrast !== undefined && filters.contrast !== 0) {
      filterParts.push(`contrast(${100 + filters.contrast}%)`);
    }
    
    if (filters.saturation !== undefined && filters.saturation !== 0) {
      filterParts.push(`saturate(${100 + filters.saturation}%)`);
    }
    
    if (filters.blur !== undefined && filters.blur > 0) {
      filterParts.push(`blur(${filters.blur}px)`);
    }
    
    return filterParts.join(' ') || 'none';
  }

  // Appliquer la saturation
  applySaturation(data, saturationValue) {
    const saturation = saturationValue / 100;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Conversion RGB vers HSL
      const hsl = this.rgbToHsl(r, g, b);
      hsl[1] = Math.min(1, Math.max(0, hsl[1] + saturation));
      
      // Conversion HSL vers RGB
      const rgb = this.hslToRgb(hsl[0], hsl[1], hsl[2]);
      
      data[i] = rgb[0];
      data[i + 1] = rgb[1];
      data[i + 2] = rgb[2];
    }
  }

  // Redimensionner une image
  async resizeImage(imageFile, width, height, maintainRatio = true) {
    const img = await this.loadImage(imageFile);
    
    let newWidth = width;
    let newHeight = height;
    
    if (maintainRatio) {
      const ratio = Math.min(width / img.width, height / img.height);
      newWidth = img.width * ratio;
      newHeight = img.height * ratio;
    }
    
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    
    // Utiliser un algorithme de rééchantillonnage de meilleure qualité
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    
    this.ctx.drawImage(img, 0, 0, newWidth, newHeight);
    
    return this.canvas.toDataURL();
  }

  // Rogner une image
  async cropImage(imageFile, x, y, width, height) {
    const img = await this.loadImage(imageFile);
    
    this.canvas.width = width;
    this.canvas.height = height;
    
    this.ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
    
    return this.canvas.toDataURL();
  }

  // Convertir au format spécifié
  async convertToFormat(imageFile, format, quality = 0.9) {
    const img = await this.loadImage(imageFile);
    
    this.canvas.width = img.width;
    this.canvas.height = img.height;
    
    // Pour PNG transparent, dessiner sur fond transparent
    if (format === 'png-transparent') {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0);
      return this.canvas.toDataURL('image/png');
    }
    
    // Pour JPEG, dessiner sur fond blanc
    if (format === 'jpeg') {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0);
      return this.canvas.toDataURL('image/jpeg', quality);
    }
    
    // Pour WebP
    if (format === 'webp') {
      this.ctx.drawImage(img, 0, 0);
      if (this.canvas.toDataURL('image/webp').indexOf('image/webp') === 5) {
        return this.canvas.toDataURL('image/webp', quality);
      } else {
        // Fallback vers PNG si WebP non supporté
        return this.canvas.toDataURL('image/png');
      }
    }
    
    // Format par défaut PNG
    this.ctx.drawImage(img, 0, 0);
    return this.canvas.toDataURL('image/png');
  }

  // Générer des favicons de différentes tailles
  async generateFavicons(imageFile) {
    const sizes = [16, 32, 48];
    const favicons = {};
    
    for (const size of sizes) {
      const dataUrl = await this.resizeImage(imageFile, size, size, false);
      favicons[`${size}x${size}`] = dataUrl;
    }
    
    return favicons;
  }

  // Obtenir les métadonnées d'une image
  async getImageMetadata(imageFile) {
    const img = await this.loadImage(imageFile);
    
    return {
      width: img.width,
      height: img.height,
      size: imageFile.size,
      type: imageFile.type,
      name: imageFile.name,
      lastModified: imageFile.lastModified
    };
  }

  // Utilitaires de conversion couleur
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [h, s, l];
  }

  hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // Télécharger l'image traitée
  downloadImage(dataUrl, filename, format) {
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}