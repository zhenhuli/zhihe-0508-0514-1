import styles from './styles.module.css';
import { DrawingCanvas } from './DrawingCanvas.js';

const tools = [
  { id: 'line', icon: '╱', title: '直线 (L)' },
  { id: 'freehand', icon: '✎', title: '自由绘制 (F)' },
  { id: 'rectangle', icon: '▢', title: '矩形 (R)' },
  { id: 'house', icon: '⌂', title: '房屋 (H)' },
  { id: 'roof', icon: '▲', title: '屋顶 (T)' },
  { id: 'door', icon: '🚪', title: '门 (D)' },
  { id: 'window', icon: '⊞', title: '窗户 (W)' },
];

function initApp() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.className = styles.app;
  
  const header = document.createElement('header');
  header.className = styles.header;
  header.innerHTML = `
    <h1 class="${styles.title}">🏠 建筑简笔线稿辅助绘图工具</h1>
    <div style="color: #a0a0a0; font-size: 12px;">v1.0.0</div>
  `;
  app.appendChild(header);
  
  const main = document.createElement('div');
  main.className = styles.main;
  app.appendChild(main);
  
  const toolbar = document.createElement('div');
  toolbar.className = styles.toolbar;
  main.appendChild(toolbar);
  
  const canvasContainer = document.createElement('div');
  canvasContainer.className = styles.canvasContainer;
  main.appendChild(canvasContainer);
  
  const sidebar = document.createElement('aside');
  sidebar.className = styles.sidebar;
  main.appendChild(sidebar);
  
  const canvas = new DrawingCanvas(canvasContainer);
  
  tools.forEach(tool => {
    const btn = document.createElement('button');
    btn.className = `${styles.toolBtn} ${tool.id === 'line' ? styles.active : ''}`;
    btn.innerHTML = tool.icon;
    btn.title = tool.title;
    btn.dataset.tool = tool.id;
    btn.addEventListener('click', () => {
      document.querySelectorAll(`.${styles.toolBtn}`).forEach(b => b.classList.remove(styles.active));
      btn.classList.add(styles.active);
      canvas.setTool(tool.id);
    });
    toolbar.appendChild(btn);
  });
  
  const divider = document.createElement('div');
  divider.style.height = '1px';
  divider.style.background = '#0f3460';
  divider.style.width = '80%';
  divider.style.margin = '8px 0';
  toolbar.appendChild(divider);
  
  const undoBtn = document.createElement('button');
  undoBtn.className = styles.toolBtn;
  undoBtn.innerHTML = '↶';
  undoBtn.title = '撤销 (Ctrl+Z)';
  undoBtn.addEventListener('click', () => canvas.undo());
  toolbar.appendChild(undoBtn);
  
  const redoBtn = document.createElement('button');
  redoBtn.className = styles.toolBtn;
  redoBtn.innerHTML = '↷';
  redoBtn.title = '重做 (Ctrl+Y)';
  redoBtn.addEventListener('click', () => canvas.redo());
  toolbar.appendChild(redoBtn);
  
  const clearBtn = document.createElement('button');
  clearBtn.className = styles.toolBtn;
  clearBtn.innerHTML = '🗑';
  clearBtn.title = '清空画布';
  clearBtn.addEventListener('click', () => {
    if (confirm('确定要清空画布吗？此操作不可撤销。')) {
      canvas.clear();
    }
  });
  toolbar.appendChild(clearBtn);
  
  sidebar.innerHTML = `
    <div class="${styles.section}">
      <h3 class="${styles.sectionTitle}">🎨 绘图设置</h3>
      
      <div class="${styles.controlGroup}">
        <label class="${styles.controlLabel}">线条颜色</label>
        <input type="color" class="${styles.colorPicker}" id="strokeColor" value="#1a1a2e">
      </div>
      
      <div class="${styles.controlGroup}">
        <label class="${styles.controlLabel}">线条宽度: <span id="lineWidthValue">2</span>px</label>
        <input type="range" class="${styles.rangeInput}" id="strokeWidth" min="1" max="10" value="2">
      </div>
    </div>
    
    <div class="${styles.section}">
      <h3 class="${styles.sectionTitle}">📐 透视辅助</h3>
      
      <label class="${styles.checkboxLabel}">
        <input type="checkbox" class="${styles.checkbox}" id="showPerspective" checked>
        显示透视辅助线
      </label>
      
      <div class="${styles.controlGroup}">
        <label class="${styles.controlLabel}">透视类型</label>
        <select class="${styles.controlInput}" id="perspectiveType">
          <option value="onePoint">一点透视</option>
          <option value="twoPoint">两点透视</option>
        </select>
      </div>
    </div>
    
    <div class="${styles.section}">
      <h3 class="${styles.sectionTitle}">📏 标尺设置</h3>
      
      <label class="${styles.checkboxLabel}">
        <input type="checkbox" class="${styles.checkbox}" id="showRuler" checked>
        显示标尺
      </label>
      
      <div class="${styles.controlGroup}">
        <label class="${styles.controlLabel}">比例: 1cm = <span id="scaleValue">50</span>px</label>
        <input type="range" class="${styles.rangeInput}" id="scale" min="10" max="200" value="50">
      </div>
    </div>
    
    <div class="${styles.section}">
      <h3 class="${styles.sectionTitle}">🔲 网格设置</h3>
      
      <label class="${styles.checkboxLabel}">
        <input type="checkbox" class="${styles.checkbox}" id="snapToGrid">
        吸附到网格
      </label>
      
      <div class="${styles.controlGroup}">
        <label class="${styles.controlLabel}">网格大小: <span id="gridSizeValue">20</span>px</label>
        <input type="range" class="${styles.rangeInput}" id="gridSize" min="10" max="100" value="20">
      </div>
    </div>
    
    <div class="${styles.section}">
      <h3 class="${styles.sectionTitle}">💾 导出</h3>
      <button class="${styles.actionBtn}" id="exportBtn">导出 PNG 图片</button>
    </div>
    
    <div class="${styles.section}">
      <h3 class="${styles.sectionTitle}">⌨️ 快捷键</h3>
      <div class="${styles.info}">
        <p><span class="${styles.hotkey}">L</span> 直线工具</p>
        <p><span class="${styles.hotkey}">F</span> 自由绘制</p>
        <p><span class="${styles.hotkey}">R</span> 矩形工具</p>
        <p><span class="${styles.hotkey}">H</span> 房屋工具</p>
        <p><span class="${styles.hotkey}">T</span> 屋顶工具</p>
        <p><span class="${styles.hotkey}">D</span> 门工具</p>
        <p><span class="${styles.hotkey}">W</span> 窗户工具</p>
        <p><span class="${styles.hotkey}">Ctrl+Z</span> 撤销</p>
        <p><span class="${styles.hotkey}">Ctrl+Y</span> 重做</p>
      </div>
    </div>
  `;
  
  document.getElementById('strokeColor').addEventListener('input', (e) => {
    canvas.setStrokeColor(e.target.value);
  });
  
  document.getElementById('strokeWidth').addEventListener('input', (e) => {
    const width = parseInt(e.target.value);
    document.getElementById('lineWidthValue').textContent = width;
    canvas.setStrokeWidth(width);
  });
  
  document.getElementById('showPerspective').addEventListener('change', (e) => {
    canvas.setShowPerspective(e.target.checked);
  });
  
  document.getElementById('perspectiveType').addEventListener('change', (e) => {
    canvas.setPerspectiveType(e.target.value);
  });
  
  document.getElementById('showRuler').addEventListener('change', (e) => {
    canvas.setShowRuler(e.target.checked);
  });
  
  document.getElementById('scale').addEventListener('input', (e) => {
    const scale = parseInt(e.target.value);
    document.getElementById('scaleValue').textContent = scale;
    canvas.setScale(scale);
  });
  
  document.getElementById('snapToGrid').addEventListener('change', (e) => {
    canvas.setSnapToGrid(e.target.checked);
  });
  
  document.getElementById('gridSize').addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    document.getElementById('gridSizeValue').textContent = size;
    canvas.setGridSize(size);
  });
  
  document.getElementById('exportBtn').addEventListener('click', () => {
    canvas.exportPNG();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    
    const toolMap = {
      'l': 'line',
      'f': 'freehand',
      'r': 'rectangle',
      'h': 'house',
      't': 'roof',
      'd': 'door',
      'w': 'window'
    };
    
    if (toolMap[e.key.toLowerCase()]) {
      e.preventDefault();
      const toolId = toolMap[e.key.toLowerCase()];
      const btn = document.querySelector(`[data-tool="${toolId}"]`);
      if (btn) btn.click();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      canvas.undo();
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      canvas.redo();
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);
