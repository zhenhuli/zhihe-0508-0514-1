import styles from './styles.module.css';

let audioContext;
let oscillator;
let gainNode;
let analyser;
let isRunning = false;

let frequency = 440;
let wavelength = 50;
let spreadRange = 150;
let currentStyle = 'classic';

const radioStyles = [
  { id: 'classic', name: 'CLASSIC', color: '#00ff88' },
  { id: 'vortex', name: 'VORTEX', color: '#ff00ff' },
  { id: 'pulse', name: 'PULSAR', color: '#ff8800' },
  { id: 'storm', name: 'STORM', color: '#0088ff' },
  { id: 'nebula', name: 'NEBULA', color: '#88ff00' }
];

let canvas;
let ctx;
let animationId;
let time = 0;

function initApp() {
  const app = document.getElementById('app');
  
  const styleButtons = radioStyles.map(style => 
    `<button class="${styles.styleBtn} ${style.id === currentStyle ? styles.styleBtnActive : ''}" 
             data-style="${style.id}" 
             style="--btn-color: ${style.color}">
      ${style.name}
    </button>`
  ).join('');
  
  app.innerHTML = `
    <div class="${styles.container}">
      <h1 class="${styles.title}">RADIO WAVE SIM</h1>
      
      <div class="${styles.styleSelector}">
        ${styleButtons}
      </div>
      
      <div class="${styles.canvasContainer}">
        <div class="${styles.radioIndicator}" id="radioIndicator"></div>
        <div class="${styles.frequencyDisplay}" id="freqDisplay">${frequency.toFixed(1)} Hz</div>
        <div class="${styles.scanlines}"></div>
        <canvas id="waveCanvas" class="${styles.canvas}"></canvas>
      </div>
      
      <div class="${styles.controls}">
        <div class="${styles.controlGroup}">
          <label class="${styles.label}">Frequency</label>
          <input type="range" class="${styles.slider}" id="frequencySlider" min="20" max="2000" value="${frequency}">
          <span class="${styles.value}" id="frequencyValue">${frequency} Hz</span>
        </div>
        
        <div class="${styles.controlGroup}">
          <label class="${styles.label}">Wavelength</label>
          <input type="range" class="${styles.slider}" id="wavelengthSlider" min="10" max="150" value="${wavelength}">
          <span class="${styles.value}" id="wavelengthValue">${wavelength}</span>
        </div>
        
        <div class="${styles.controlGroup}">
          <label class="${styles.label}">Spread</label>
          <input type="range" class="${styles.slider}" id="spreadSlider" min="50" max="400" value="${spreadRange}">
          <span class="${styles.value}" id="spreadValue">${spreadRange}</span>
        </div>
      </div>
      
      <button class="${styles.startButton}" id="startBtn">START TRANSMISSION</button>
    </div>
  `;

  canvas = document.getElementById('waveCanvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();

  setupEventListeners();
  updateStyleIndicator();
}

function resizeCanvas() {
  const container = canvas.parentElement;
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
}

function setupEventListeners() {
  const startBtn = document.getElementById('startBtn');
  const frequencySlider = document.getElementById('frequencySlider');
  const wavelengthSlider = document.getElementById('wavelengthSlider');
  const spreadSlider = document.getElementById('spreadSlider');

  startBtn.addEventListener('click', toggleAudio);

  frequencySlider.addEventListener('input', (e) => {
    frequency = parseFloat(e.target.value);
    document.getElementById('frequencyValue').textContent = `${frequency} Hz`;
    document.getElementById('freqDisplay').textContent = `${frequency.toFixed(1)} Hz`;
    if (oscillator) {
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    }
  });

  wavelengthSlider.addEventListener('input', (e) => {
    wavelength = parseFloat(e.target.value);
    document.getElementById('wavelengthValue').textContent = wavelength;
  });

  spreadSlider.addEventListener('input', (e) => {
    spreadRange = parseFloat(e.target.value);
    document.getElementById('spreadValue').textContent = spreadRange;
  });

  document.querySelectorAll('[data-style]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentStyle = e.target.dataset.style;
      updateStyleButtons();
      updateStyleIndicator();
    });
  });

  window.addEventListener('resize', resizeCanvas);
}

function getCurrentColor() {
  return radioStyles.find(s => s.id === currentStyle)?.color || '#00ff88';
}

function updateStyleButtons() {
  document.querySelectorAll('[data-style]').forEach(btn => {
    if (btn.dataset.style === currentStyle) {
      btn.classList.add(styles.styleBtnActive);
    } else {
      btn.classList.remove(styles.styleBtnActive);
    }
  });
}

function updateStyleIndicator() {
  const indicator = document.getElementById('radioIndicator');
  const freqDisplay = document.getElementById('freqDisplay');
  const color = getCurrentColor();
  if (indicator) {
    indicator.style.background = color;
    indicator.style.boxShadow = `0 0 10px ${color}`;
  }
  if (freqDisplay) {
    freqDisplay.style.color = color;
    freqDisplay.style.textShadow = `0 0 15px ${color}`;
  }
}

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  oscillator = audioContext.createOscillator();
  gainNode = audioContext.createGain();
  analyser = audioContext.createAnalyser();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(analyser);
  analyser.connect(audioContext.destination);

  analyser.fftSize = 256;

  oscillator.start();
}

function toggleAudio() {
  const startBtn = document.getElementById('startBtn');
  
  if (!isRunning) {
    if (!audioContext) {
      initAudio();
    } else if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    isRunning = true;
    startBtn.textContent = 'STOP TRANSMISSION';
    animate();
  } else {
    if (audioContext) {
      audioContext.suspend();
    }
    isRunning = false;
    startBtn.textContent = 'START TRANSMISSION';
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  }
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 255, b: 136 };
}

function drawWaves() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const color = getCurrentColor();
  const rgb = hexToRgb(color);
  
  ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  switch(currentStyle) {
    case 'vortex':
      drawVortex(centerX, centerY, color, rgb);
      break;
    case 'pulse':
      drawPulsar(centerX, centerY, color, rgb);
      break;
    case 'storm':
      drawStorm(centerX, centerY, color, rgb);
      break;
    case 'nebula':
      drawNebula(centerX, centerY, color, rgb);
      break;
    default:
      drawClassic(centerX, centerY, color, rgb);
  }

  if (isRunning && analyser) {
    drawSpectrum(color, rgb);
  }

  drawNoise();
}

function drawClassic(centerX, centerY, color, rgb) {
  const waveCount = 8;
  const maxRadius = spreadRange;

  for (let i = 0; i < waveCount; i++) {
    const phase = (time + i * wavelength / waveCount) % wavelength;
    const radius = (phase / wavelength) * maxRadius;
    const alpha = 1 - (phase / wavelength);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    
    const gradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.5,
      centerX, centerY, radius
    );
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    gradient.addColorStop(0.7, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.3})`);
    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.8})`);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3 + alpha * 3;
    ctx.stroke();
  }

  for (let i = 0; i < 5; i++) {
    const y = centerY - 60 + i * 30;
    drawSineWave(centerX, y, i, color, rgb);
  }

  drawCenterDot(centerX, centerY, color);
}

function drawVortex(centerX, centerY, color, rgb) {
  const arms = 6;
  const maxRadius = spreadRange;

  for (let arm = 0; arm < arms; arm++) {
    ctx.beginPath();
    const armAngle = (arm / arms) * Math.PI * 2 + time * 0.02;
    
    for (let r = 0; r < maxRadius; r += 3) {
      const angle = armAngle + (r / maxRadius) * Math.PI * 4;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      const alpha = 1 - r / maxRadius;
      
      ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  for (let i = 0; i < 3; i++) {
    const phase = (time + i * wavelength / 3) % wavelength;
    const radius = (phase / wavelength) * maxRadius;
    const alpha = (1 - phase / wavelength) * 0.5;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawCenterDot(centerX, centerY, color);
}

function drawPulsar(centerX, centerY, color, rgb) {
  const beams = 8;
  const maxRadius = spreadRange;
  const pulsePhase = (time % wavelength) / wavelength;

  for (let beam = 0; beam < beams; beam++) {
    const beamAngle = (beam / beams) * Math.PI * 2;
    const sweepAngle = beamAngle + pulsePhase * Math.PI * 2;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    
    for (let r = 0; r < maxRadius; r += 2) {
      const angle = sweepAngle + (r / maxRadius) * 0.5;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      ctx.lineTo(x, y);
    }
    
    const gradient = ctx.createLinearGradient(
      centerX, centerY,
      centerX + Math.cos(sweepAngle) * maxRadius,
      centerY + Math.sin(sweepAngle) * maxRadius
    );
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`);
    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4 + Math.sin(time * 0.1 + beam) * 2;
    ctx.stroke();
  }

  for (let i = 0; i < 5; i++) {
    const ringPhase = (time + i * wavelength / 5) % wavelength;
    const ringRadius = (ringPhase / wavelength) * maxRadius;
    const ringAlpha = (1 - ringPhase / wavelength) * 0.4;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${ringAlpha})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 10]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawCenterDot(centerX, centerY, color);
}

function drawStorm(centerX, centerY, color, rgb) {
  const particleCount = 100;
  const maxRadius = spreadRange;

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 8 + time * 0.05;
    const dist = ((i + time * 2) % particleCount) / particleCount * maxRadius;
    const x = centerX + Math.cos(angle) * dist;
    const y = centerY + Math.sin(angle) * dist;
    const alpha = 1 - dist / maxRadius;
    
    ctx.beginPath();
    ctx.arc(x, y, 2 + Math.sin(time * 0.1 + i) * 1, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha * 0.8})`;
    ctx.fill();
  }

  for (let i = 0; i < 3; i++) {
    const phase = (time * 2 + i * 20) % 100;
    const radius = (phase / 100) * maxRadius * 1.2;
    const alpha = Math.sin((phase / 100) * Math.PI) * 0.3;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  for (let i = 0; i < 20; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    
    if (dist < maxRadius && Math.random() < 0.1) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 30);
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  drawCenterDot(centerX, centerY, color);
}

function drawNebula(centerX, centerY, color, rgb) {
  const clouds = 5;
  const maxRadius = spreadRange;

  for (let cloud = 0; cloud < clouds; cloud++) {
    const cloudAngle = (cloud / clouds) * Math.PI * 2 + time * 0.01;
    const cloudRadius = maxRadius * (0.5 + Math.sin(time * 0.02 + cloud) * 0.3);
    const cloudX = centerX + Math.cos(cloudAngle) * cloudRadius * 0.3;
    const cloudY = centerY + Math.sin(cloudAngle) * cloudRadius * 0.3;
    
    const gradient = ctx.createRadialGradient(
      cloudX, cloudY, 0,
      cloudX, cloudY, cloudRadius * 0.5
    );
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`);
    gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cloudX, cloudY, cloudRadius * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 6; i++) {
    const phase = (time + i * wavelength / 6) % wavelength;
    const radius = (phase / wavelength) * maxRadius;
    const alpha = (1 - phase / wavelength) * 0.5;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (let i = 0; i < 50; i++) {
    const starAngle = (i / 50) * Math.PI * 2 + time * 0.005;
    const starDist = (i % 8) / 8 * maxRadius;
    const starX = centerX + Math.cos(starAngle) * starDist;
    const starY = centerY + Math.sin(starAngle) * starDist;
    const twinkle = Math.sin(time * 0.1 + i) * 0.5 + 0.5;
    
    ctx.beginPath();
    ctx.arc(starX, starY, 1 + twinkle, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
    ctx.fill();
  }

  drawCenterDot(centerX, centerY, color);
}

function drawCenterDot(centerX, centerY, color) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawSpectrum(color, rgb) {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let barX = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = (dataArray[i] / 255) * 50;
    
    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${dataArray[i] / 255 * 0.8})`;
    ctx.fillRect(barX, canvas.height - barHeight - 20, barWidth, barHeight);
    ctx.fillRect(barX, 20, barWidth, barHeight);
    
    barX += barWidth + 1;
  }
}

function drawSineWave(centerX, y, index, color, rgb) {
  ctx.beginPath();
  ctx.moveTo(0, y);

  const amplitude = 15 - index * 2;
  const frequencyFactor = frequency / 200;

  for (let x = 0; x < canvas.width; x++) {
    const waveY = y + Math.sin((x + time * 3) / wavelength * frequencyFactor + index * 0.5) * amplitude;
    ctx.lineTo(x, waveY);
  }

  ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 + index * 0.1})`;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawNoise() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < 0.002) {
      const noise = Math.random() * 50;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function animate() {
  time += 1;
  drawWaves();
  animationId = requestAnimationFrame(animate);
}

initApp();
