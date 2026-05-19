class WoodGrainGenerator {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isGenerating = false;
    this.generateId = 0;
    this.options = {
      baseColor: options.baseColor || '#C8A27B',
      grainColor: options.grainColor || '#8B6914',
      density: options.density || 28,
      depth: options.depth || 52,
      angle: options.angle || 0,
      thickness: options.thickness || 6,
      noise: options.noise || 45,
      knots: options.knots || 5,
      irregularity: options.irregularity || 55,
      ringSpacing: options.ringSpacing || 28,
      seed: options.seed || Date.now(),
      quality: options.quality || 'medium'
    };
    this._noiseCache = new Map();
  }

  seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 200, g: 162, b: 123 };
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  lerpColor(c1, c2, t) {
    return {
      r: (c1.r + (c2.r - c1.r) * t) | 0,
      g: (c1.g + (c2.g - c1.g) * t) | 0,
      b: (c1.b + (c2.b - c1.b) * t) | 0
    };
  }

  fastNoise2D(x, y, seed) {
    const key = (x * 73856093) ^ (y * 19349663) ^ (seed * 83492791);
    if (this._noiseCache.has(key)) {
      return this._noiseCache.get(key);
    }
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
    const result = n - Math.floor(n);
    if (this._noiseCache.size < 50000) {
      this._noiseCache.set(key, result);
    }
    return result;
  }

  smoothNoiseFast(x, y, seed) {
    const ix = x | 0;
    const iy = y | 0;
    const fx = x - ix;
    const fy = y - iy;

    const v00 = this.fastNoise2D(ix, iy, seed);
    const v10 = this.fastNoise2D(ix + 1, iy, seed);
    const v01 = this.fastNoise2D(ix, iy + 1, seed);
    const v11 = this.fastNoise2D(ix + 1, iy + 1, seed);

    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);

    return v00 * (1 - sx) * (1 - sy) + v10 * sx * (1 - sy) + v01 * (1 - sx) * sy + v11 * sx * sy;
  }

  fbmFast(x, y, octaves, seed, lacunarity = 2, gain = 0.5) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += amplitude * this.smoothNoiseFast(x * frequency, y * frequency, seed + (i * 100));
      maxValue += amplitude;
      amplitude *= gain;
      frequency *= lacunarity;
    }

    return value / maxValue;
  }

  clearNoiseCache() {
    this._noiseCache.clear();
  }

  async generate(previewMode = false) {
    const currentId = ++this.generateId;
    this.isGenerating = true;

    try {
      const width = this.canvas.width;
      const height = this.canvas.height;
      
      const quality = previewMode ? 'fast' : this.options.quality;
      const step = quality === 'fast' ? 2 : quality === 'low' ? 1 : 1;
      const octaves = quality === 'fast' ? 2 : 3;

      const imageData = this.ctx.createImageData(width, height);
      const data = imageData.data;

      const baseRgb = this.hexToRgb(this.options.baseColor);
      const grainRgb = this.hexToRgb(this.options.grainColor);
      const midRgb = {
        r: ((baseRgb.r + grainRgb.r) / 2) | 0,
        g: ((baseRgb.g + grainRgb.g) / 2) | 0,
        b: ((baseRgb.b + grainRgb.b) / 2) | 0
      };

      const angleRad = (this.options.angle * Math.PI) / 180;
      const cosA = Math.cos(angleRad);
      const sinA = Math.sin(angleRad);

      const density = this.options.density / 10;
      const depth = this.options.depth / 100;
      const thickness = this.options.thickness;
      const noiseIntensity = this.options.noise / 100;
      const irregularity = this.options.irregularity / 100;
      const ringSpacing = this.options.ringSpacing / 10;
      const seed = this.options.seed;

      const batchSize = 50;
      
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (currentId !== this.generateId) {
            return;
          }

          const xr = x * cosA - y * sinA;
          const yr = x * sinA + y * cosA;

          const largeNoise = this.fbmFast(xr * 0.004, yr * 0.004, Math.min(octaves + 1, 4), seed + 1000);
          const medNoise = this.fbmFast(xr * 0.015, yr * 0.015, octaves, seed + 2000);
          const fineNoise = quality === 'fast' ? largeNoise : this.fbmFast(xr * 0.08, yr * 0.08, 2, seed + 3000);

          const driftX = (largeNoise - 0.5) * 80 * irregularity;
          const driftY = (medNoise - 0.5) * 40 * irregularity;

          const xrMod = xr + driftX;
          const yrMod = yr + driftY;

          const wave1 = Math.sin(xrMod * 0.015 * density + medNoise * Math.PI * 3) * thickness;
          const wave2 = Math.sin(xrMod * 0.04 * density + largeNoise * Math.PI * 2) * (thickness * 0.5);

          const ringY = yrMod + wave1 + wave2;
          const ringPos = (ringY / (40 * ringSpacing)) * density;
          const ringVal = Math.sin(ringPos * Math.PI * 2) * 0.5 + 0.5;

          const ringSharp = Math.pow(ringVal, 0.8 + (1 - depth) * 2);
          let grainFactor = ringSharp * (0.2 + depth * 0.8);

          const growthRingNoise = quality === 'fast' ? 0.5 : this.fbmFast(xr * 0.002, yr * 0.002, 2, seed + 5000);
          const ringThicknessVar = Math.sin(growthRingNoise * Math.PI * 8) * 0.3;
          grainFactor *= (1 + ringThicknessVar * 0.5);

          const textureNoise = (fineNoise - 0.5) * noiseIntensity * 0.4;
          grainFactor = Math.max(0, Math.min(1, grainFactor + textureNoise));

          let finalR, finalG, finalB;
          if (grainFactor < 0.5) {
            const t = grainFactor * 2;
            finalR = (baseRgb.r + (midRgb.r - baseRgb.r) * t) | 0;
            finalG = (baseRgb.g + (midRgb.g - baseRgb.g) * t) | 0;
            finalB = (baseRgb.b + (midRgb.b - baseRgb.b) * t) | 0;
          } else {
            const t = (grainFactor - 0.5) * 2;
            finalR = (midRgb.r + (grainRgb.r - midRgb.r) * t) | 0;
            finalG = (midRgb.g + (grainRgb.g - midRgb.g) * t) | 0;
            finalB = (midRgb.b + (grainRgb.b - midRgb.b) * t) | 0;
          }

          const tonalVariation = (largeNoise - 0.5) * 12;
          finalR = Math.max(0, Math.min(255, (finalR + tonalVariation) | 0));
          finalG = Math.max(0, Math.min(255, (finalG + tonalVariation * 0.8) | 0));
          finalB = Math.max(0, Math.min(255, (finalB + tonalVariation * 0.5) | 0));

          for (let dy = 0; dy < step && y + dy < height; dy++) {
            for (let dx = 0; dx < step && x + dx < width; dx++) {
              const idx = ((y + dy) * width + (x + dx)) * 4;
              data[idx] = finalR;
              data[idx + 1] = finalG;
              data[idx + 2] = finalB;
              data[idx + 3] = 255;
            }
          }
        }

        if (y % batchSize === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      if (currentId !== this.generateId) {
        return;
      }

      this.ctx.putImageData(imageData, 0, 0);

      if (!previewMode && this.options.knots > 0) {
        await this.drawKnotsFast(currentId);
      }

      if (!previewMode) {
        this.drawFineTextureFast();
      }
    } finally {
      if (currentId === this.generateId) {
        this.isGenerating = false;
      }
    }
  }

  async drawKnotsFast(currentId) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const knotCount = Math.min(this.options.knots, 8);
    const baseRgb = this.hexToRgb(this.options.baseColor);
    const grainRgb = this.hexToRgb(this.options.grainColor);
    const seed = this.options.seed;

    const darker = {
      r: Math.max(0, grainRgb.r - 35),
      g: Math.max(0, grainRgb.g - 25),
      b: Math.max(0, grainRgb.b - 15)
    };

    for (let i = 0; i < knotCount; i++) {
      if (currentId !== this.generateId) return;

      const knotSeed = seed + i * 9999;
      const cx = this.seededRandom(knotSeed + 1) * width;
      const cy = this.seededRandom(knotSeed + 2) * height;
      const radius = 15 + this.seededRandom(knotSeed + 3) * 40;
      const eccentricity = 0.6 + this.seededRandom(knotSeed + 4) * 0.4;
      const rotation = this.seededRandom(knotSeed + 5) * Math.PI;

      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);

      const minX = Math.max(0, Math.floor(cx - radius));
      const maxX = Math.min(width, Math.ceil(cx + radius));
      const minY = Math.max(0, Math.floor(cy - radius));
      const maxY = Math.min(height, Math.ceil(cy + radius));

      for (let y = minY; y < maxY; y++) {
        for (let x = minX; x < maxX; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const rx = dx * cosR + dy * sinR;
          const ry = -dx * sinR + dy * cosR;
          const dist = Math.sqrt((rx * rx) / (eccentricity * eccentricity) + ry * ry);

          if (dist < radius) {
            const t = dist / radius;
            const ringNoise = this.fbmFast(x * 0.1, y * 0.1, 2, knotSeed + 100);
            const ringFactor = Math.sin(t * Math.PI * (4 + ringNoise * 3)) * 0.5 + 0.5;
            const coreDarkness = (1 - t) * (1 - t);
            const alpha = (1 - t * t) * 0.85;

            const knotR = (darker.r + (baseRgb.r - darker.r) * ringFactor * (1 - coreDarkness * 0.5)) | 0;
            const knotG = (darker.g + (baseRgb.g - darker.g) * ringFactor * (1 - coreDarkness * 0.5)) | 0;
            const knotB = (darker.b + (baseRgb.b - darker.b) * ringFactor * (1 - coreDarkness * 0.5)) | 0;

            const idx = (y * width + x) * 4;
            const data = this.ctx.getImageData(x, y, 1, 1).data;
            
            const finalR = (data[0] * (1 - alpha) + knotR * alpha) | 0;
            const finalG = (data[1] * (1 - alpha) + knotG * alpha) | 0;
            const finalB = (data[2] * (1 - alpha) + knotB * alpha) | 0;

            this.ctx.fillStyle = `rgb(${finalR},${finalG},${finalB})`;
            this.ctx.fillRect(x, y, 1, 1);
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  drawFineTextureFast() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const imageData = this.ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const seed = this.options.seed;
    const noiseIntensity = this.options.noise / 100;

    if (noiseIntensity < 0.2) {
      return;
    }

    const step = 2;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const poreNoise = this.fbmFast(x * 0.5, y * 0.5, 2, seed + 7000);
        const poreEffect = ((poreNoise - 0.5) * 6 * noiseIntensity) | 0;

        for (let dy = 0; dy < step && y + dy < height; dy++) {
          for (let dx = 0; dx < step && x + dx < width; dx++) {
            const idx = ((y + dy) * width + (x + dx)) * 4;
            data[idx] = Math.max(0, Math.min(255, data[idx] + poreEffect));
            data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + (poreEffect * 0.8) | 0));
            data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + (poreEffect * 0.6) | 0));
          }
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  updateOptions(newOptions) {
    Object.assign(this.options, newOptions);
  }

  cancel() {
    this.generateId++;
    this.isGenerating = false;
  }
}

export default WoodGrainGenerator;
