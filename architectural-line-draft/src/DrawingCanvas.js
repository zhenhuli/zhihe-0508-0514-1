import styles from './styles.module.css';

export class DrawingCanvas {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.className = styles.canvas;
    this.ctx = this.canvas.getContext('2d');
    
    this.isDrawing = false;
    this.currentTool = 'line';
    this.strokeColor = '#1a1a2e';
    this.strokeWidth = 2;
    this.startPoint = null;
    this.history = [];
    this.historyIndex = -1;
    
    this.showPerspective = true;
    this.perspectiveType = 'onePoint';
    this.vanishingPoints = [];
    this.horizonY = 0;
    
    this.showRuler = true;
    this.rulerUnit = 'cm';
    this.scale = 50;
    
    this.snapToGrid = false;
    this.gridSize = 20;
    
    this.currentPath = [];
    
    this.init();
  }
  
  init() {
    this.container.appendChild(this.canvas);
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    this.canvas.addEventListener('mouseleave', (e) => this.onMouseUp(e));
    
    this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
    this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
    this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
    
    this.setPerspectivePoints();
    this.saveState();
  }
  
  resize() {
    const rect = this.container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
    
    this.setPerspectivePoints();
    this.redraw();
  }
  
  setPerspectivePoints() {
    const offset = this.showRuler ? 36 : 0;
    const drawWidth = this.width - offset;
    const drawHeight = this.height - offset;
    const centerX = offset + drawWidth / 2;
    const centerY = offset + drawHeight / 2;
    this.horizonY = centerY;
    
    if (this.perspectiveType === 'onePoint') {
      this.vanishingPoints = [{ x: centerX, y: centerY }];
    } else if (this.perspectiveType === 'twoPoint') {
      this.vanishingPoints = [
        { x: offset + drawWidth * 0.2, y: centerY },
        { x: offset + drawWidth * 0.8, y: centerY }
      ];
    }
  }
  
  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    if (this.snapToGrid) {
      const offset = this.showRuler ? 36 : 0;
      x = Math.round((x - offset) / this.gridSize) * this.gridSize + offset;
      y = Math.round((y - offset) / this.gridSize) * this.gridSize + offset;
    }
    
    return { x, y };
  }
  
  onMouseDown(e) {
    this.isDrawing = true;
    this.startPoint = this.getMousePos(e);
    this.currentPath = [this.startPoint];
  }
  
  onMouseMove(e) {
    if (!this.isDrawing) return;
    
    const currentPoint = this.getMousePos(e);
    this.currentPath.push(currentPoint);
    this.redraw();
    this.drawPreview(currentPoint);
  }
  
  onMouseUp(e) {
    if (!this.isDrawing) return;
    
    this.isDrawing = false;
    const endPoint = this.getMousePos(e);
    
    if (this.currentTool === 'freehand' && this.currentPath.length > 1) {
      this.commitPath([...this.currentPath]);
    } else if (this.startPoint) {
      this.commitShape(this.startPoint, endPoint);
    }
    
    this.currentPath = [];
    this.startPoint = null;
    this.saveState();
  }
  
  onTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.onMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
  }
  
  onTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
  }
  
  onTouchEnd(e) {
    e.preventDefault();
    this.onMouseUp({});
  }
  
  commitPath(path) {
    this.history[this.historyIndex].paths.push({
      type: 'freehand',
      points: path,
      color: this.strokeColor,
      width: this.strokeWidth
    });
  }
  
  commitShape(start, end) {
    this.history[this.historyIndex].paths.push({
      type: this.currentTool,
      start,
      end,
      color: this.strokeColor,
      width: this.strokeWidth
    });
  }
  
  drawPreview(currentPoint) {
    this.ctx.save();
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    if (this.currentTool === 'freehand' && this.currentPath.length > 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.currentPath[0].x, this.currentPath[0].y);
      for (let i = 1; i < this.currentPath.length; i++) {
        this.ctx.lineTo(this.currentPath[i].x, this.currentPath[i].y);
      }
      this.ctx.stroke();
    } else if (this.startPoint) {
      this.drawShape(this.startPoint, currentPoint, true);
    }
    
    this.ctx.restore();
  }
  
  drawShape(start, end, isPreview = false, type = this.currentTool) {
    this.ctx.beginPath();
    
    switch (type) {
      case 'line':
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        break;
        
      case 'rectangle':
        this.ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
        break;
        
      case 'house':
        this.drawHouse(start, end);
        break;
        
      case 'door':
        this.drawDoor(start, end);
        break;
        
      case 'window':
        this.drawWindow(start, end);
        break;
        
      case 'roof':
        this.drawRoof(start, end);
        break;
    }
    
    if (isPreview) {
      this.ctx.setLineDash([5, 5]);
    }
    
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }
  
  drawHouse(start, end) {
    const width = end.x - start.x;
    const height = end.y - start.y;
    
    this.ctx.rect(start.x, start.y, width, height);
    
    const roofHeight = height * 0.3;
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(start.x + width / 2, start.y - roofHeight);
    this.ctx.lineTo(end.x, start.y);
    
    const doorWidth = width * 0.25;
    const doorHeight = height * 0.4;
    const doorX = start.x + (width - doorWidth) / 2;
    const doorY = end.y - doorHeight;
    this.ctx.rect(doorX, doorY, doorWidth, doorHeight);
    
    const windowSize = width * 0.15;
    const windowY = start.y + height * 0.2;
    this.ctx.rect(start.x + width * 0.15, windowY, windowSize, windowSize);
    this.ctx.rect(end.x - width * 0.15 - windowSize, windowY, windowSize, windowSize);
  }
  
  drawDoor(start, end) {
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    
    this.ctx.rect(x, y, width, height);
    
    const knobRadius = width * 0.05;
    this.ctx.beginPath();
    this.ctx.arc(x + width * 0.8, y + height * 0.5, knobRadius, 0, Math.PI * 2);
    this.ctx.stroke();
  }
  
  drawWindow(start, end) {
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    
    this.ctx.rect(x, y, width, height);
    
    this.ctx.moveTo(x + width / 2, y);
    this.ctx.lineTo(x + width / 2, y + height);
    
    this.ctx.moveTo(x, y + height / 2);
    this.ctx.lineTo(x + width, y + height / 2);
  }
  
  drawRoof(start, end) {
    const width = end.x - start.x;
    const height = end.y - start.y;
    
    this.ctx.moveTo(start.x, end.y);
    this.ctx.lineTo(start.x + width / 2, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.closePath();
  }
  
  drawPerspectiveGuides() {
    if (!this.showPerspective) return;
    
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(233, 69, 96, 0.3)';
    this.ctx.lineWidth = 1;
    
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.horizonY);
    this.ctx.lineTo(this.width, this.horizonY);
    this.ctx.stroke();
    
    this.vanishingPoints.forEach((vp, index) => {
      this.ctx.fillStyle = '#e94560';
      this.ctx.beginPath();
      this.ctx.arc(vp.x, vp.y, 6, 0, Math.PI * 2);
      this.ctx.fill();
      
      const numLines = 12;
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2;
        const length = Math.max(this.width, this.height);
        
        this.ctx.beginPath();
        this.ctx.moveTo(vp.x, vp.y);
        this.ctx.lineTo(
          vp.x + Math.cos(angle) * length,
          vp.y + Math.sin(angle) * length
        );
        this.ctx.stroke();
      }
    });
    
    this.ctx.restore();
  }
  
  drawRuler() {
    if (!this.showRuler) return;
    
    const rulerSize = 36;
    const cornerSize = rulerSize;
    
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(22, 33, 62, 0.9)';
    this.ctx.fillRect(cornerSize, 0, this.width - cornerSize, rulerSize);
    this.ctx.fillRect(0, cornerSize, rulerSize, this.height - cornerSize);
    this.ctx.fillRect(0, 0, cornerSize, cornerSize);
    
    this.ctx.strokeStyle = '#533483';
    this.ctx.fillStyle = '#e8e8e8';
    this.ctx.font = '10px monospace';
    this.ctx.lineWidth = 1;
    
    for (let i = 0; cornerSize + i * this.gridSize < this.width; i++) {
      const x = cornerSize + i * this.gridSize;
      const isMajor = i % 5 === 0;
      const height = isMajor ? 12 : 6;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
      
      if (isMajor) {
        const value = ((i * this.gridSize) / this.scale).toFixed(1);
        this.ctx.fillText(value, x + 2, rulerSize - 6);
      }
    }
    
    for (let i = 0; cornerSize + i * this.gridSize < this.height; i++) {
      const y = cornerSize + i * this.gridSize;
      const isMajor = i % 5 === 0;
      const width = isMajor ? 12 : 6;
      this.ctx.beginPath();
      this.ctx.moveTo(rulerSize - width, y);
      this.ctx.lineTo(rulerSize, y);
      this.ctx.stroke();
      
      if (isMajor) {
        const value = ((i * this.gridSize) / this.scale).toFixed(1);
        this.ctx.save();
        this.ctx.translate(rulerSize - 6, y + 4);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.textAlign = 'center';
        this.ctx.fillText(value, 0, 0);
        this.ctx.restore();
      }
    }
    
    this.ctx.fillStyle = '#e94560';
    this.ctx.font = '10px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.rulerUnit, cornerSize / 2, rulerSize / 2 + 3);
    
    this.ctx.restore();
  }
  
  drawGrid() {
    if (!this.snapToGrid) return;
    
    const offset = this.showRuler ? 36 : 0;
    
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(83, 52, 131, 0.2)';
    this.ctx.lineWidth = 0.5;
    
    for (let x = offset; x < this.width; x += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, offset);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    
    for (let y = offset; y < this.height; y += this.gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(offset, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  redraw() {
    this.ctx.fillStyle = '#f5f5f5';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.drawGrid();
    this.drawPerspectiveGuides();
    this.drawRuler();
    
    if (this.historyIndex >= 0 && this.history[this.historyIndex]) {
      this.history[this.historyIndex].paths.forEach(path => {
        this.ctx.save();
        this.ctx.strokeStyle = path.color;
        this.ctx.lineWidth = path.width;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        if (path.type === 'freehand') {
          this.ctx.beginPath();
          if (path.points.length > 0) {
            this.ctx.moveTo(path.points[0].x, path.points[0].y);
            for (let i = 1; i < path.points.length; i++) {
              this.ctx.lineTo(path.points[i].x, path.points[i].y);
            }
          }
          this.ctx.stroke();
        } else {
          this.drawShape(path.start, path.end, false, path.type);
        }
        
        this.ctx.restore();
      });
    }
  }
  
  saveState() {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push({
      paths: JSON.parse(JSON.stringify(
        this.historyIndex >= 0 ? this.history[this.historyIndex].paths : []
      ))
    });
    this.historyIndex++;
  }
  
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.redraw();
    }
  }
  
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.redraw();
    }
  }
  
  clear() {
    this.history = [{ paths: [] }];
    this.historyIndex = 0;
    this.redraw();
  }
  
  exportPNG() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    const dpr = window.devicePixelRatio || 1;
    tempCtx.scale(dpr, dpr);
    tempCtx.fillStyle = '#ffffff';
    tempCtx.fillRect(0, 0, this.width, this.height);
    
    if (this.historyIndex >= 0 && this.history[this.historyIndex]) {
      this.history[this.historyIndex].paths.forEach(path => {
        tempCtx.save();
        tempCtx.strokeStyle = path.color;
        tempCtx.lineWidth = path.width;
        tempCtx.lineCap = 'round';
        tempCtx.lineJoin = 'round';
        
        if (path.type === 'freehand') {
          tempCtx.beginPath();
          if (path.points.length > 0) {
            tempCtx.moveTo(path.points[0].x, path.points[0].y);
            for (let i = 1; i < path.points.length; i++) {
              tempCtx.lineTo(path.points[i].x, path.points[i].y);
            }
          }
          tempCtx.stroke();
        } else {
          this.drawShapeOnContext(tempCtx, path);
        }
        
        tempCtx.restore();
      });
    }
    
    const link = document.createElement('a');
    link.download = `architectural-draft-${Date.now()}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
  }
  
  drawShapeOnContext(ctx, path) {
    ctx.beginPath();
    
    switch (path.type) {
      case 'line':
        ctx.moveTo(path.start.x, path.start.y);
        ctx.lineTo(path.end.x, path.end.y);
        break;
        
      case 'rectangle':
        ctx.rect(path.start.x, path.start.y, path.end.x - path.start.x, path.end.y - path.start.y);
        break;
        
      case 'house':
        this.drawHouseOnContext(ctx, path.start, path.end);
        break;
        
      case 'door':
        this.drawDoorOnContext(ctx, path.start, path.end);
        break;
        
      case 'window':
        this.drawWindowOnContext(ctx, path.start, path.end);
        break;
        
      case 'roof':
        this.drawRoofOnContext(ctx, path.start, path.end);
        break;
    }
    
    ctx.stroke();
  }
  
  drawHouseOnContext(ctx, start, end) {
    const width = end.x - start.x;
    const height = end.y - start.y;
    
    ctx.rect(start.x, start.y, width, height);
    
    const roofHeight = height * 0.3;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(start.x + width / 2, start.y - roofHeight);
    ctx.lineTo(end.x, start.y);
    
    const doorWidth = width * 0.25;
    const doorHeight = height * 0.4;
    const doorX = start.x + (width - doorWidth) / 2;
    const doorY = end.y - doorHeight;
    ctx.rect(doorX, doorY, doorWidth, doorHeight);
    
    const windowSize = width * 0.15;
    const windowY = start.y + height * 0.2;
    ctx.rect(start.x + width * 0.15, windowY, windowSize, windowSize);
    ctx.rect(end.x - width * 0.15 - windowSize, windowY, windowSize, windowSize);
  }
  
  drawDoorOnContext(ctx, start, end) {
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    
    ctx.rect(x, y, width, height);
    
    const knobRadius = width * 0.05;
    ctx.beginPath();
    ctx.arc(x + width * 0.8, y + height * 0.5, knobRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  drawWindowOnContext(ctx, start, end) {
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    
    ctx.rect(x, y, width, height);
    
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width / 2, y + height);
    
    ctx.moveTo(x, y + height / 2);
    ctx.lineTo(x + width, y + height / 2);
  }
  
  drawRoofOnContext(ctx, start, end) {
    const width = end.x - start.x;
    const height = end.y - start.y;
    
    ctx.moveTo(start.x, end.y);
    ctx.lineTo(start.x + width / 2, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.closePath();
  }
  
  setTool(tool) {
    this.currentTool = tool;
  }
  
  setStrokeColor(color) {
    this.strokeColor = color;
  }
  
  setStrokeWidth(width) {
    this.strokeWidth = width;
  }
  
  setShowPerspective(show) {
    this.showPerspective = show;
    this.redraw();
  }
  
  setPerspectiveType(type) {
    this.perspectiveType = type;
    this.setPerspectivePoints();
    this.redraw();
  }
  
  setShowRuler(show) {
    this.showRuler = show;
    this.setPerspectivePoints();
    this.redraw();
  }
  
  setScale(scale) {
    this.scale = scale;
    this.redraw();
  }
  
  setSnapToGrid(snap) {
    this.snapToGrid = snap;
    this.redraw();
  }
  
  setGridSize(size) {
    this.gridSize = size;
    this.redraw();
  }
}
