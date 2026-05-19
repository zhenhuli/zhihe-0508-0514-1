import WoodGrainGenerator from './woodGrain.js';
import woodPresets from './presets.js';
import './styles.less';

const canvas = document.getElementById('woodCanvas');
const generator = new WoodGrainGenerator(canvas, woodPresets.oak);

const loadingOverlay = document.createElement('div');
loadingOverlay.className = 'loading-overlay';
loadingOverlay.innerHTML = '<div class="loading-spinner"></div><span class="loading-text">渲染中...</span>';
document.querySelector('.canvas-wrapper').appendChild(loadingOverlay);

function showLoading() {
  loadingOverlay.classList.add('active');
}

function hideLoading() {
  loadingOverlay.classList.remove('active');
}

let debounceTimer;
let previewDebounceTimer;

function debouncedGenerate() {
  clearTimeout(debounceTimer);
  clearTimeout(previewDebounceTimer);
  
  previewDebounceTimer = setTimeout(async () => {
    if (!generator.isGenerating) {
      showLoading();
      await generator.generate(true);
      hideLoading();
    }
  }, 50);

  debounceTimer = setTimeout(async () => {
    if (!generator.isGenerating) {
      showLoading();
      await generator.generate(false);
      hideLoading();
    }
  }, 300);
}

const controls = {
  baseColor: document.getElementById('baseColor'),
  grainColor: document.getElementById('grainColor'),
  density: document.getElementById('density'),
  depth: document.getElementById('depth'),
  angle: document.getElementById('angle'),
  thickness: document.getElementById('thickness'),
  irregularity: document.getElementById('irregularity'),
  ringSpacing: document.getElementById('ringSpacing'),
  noise: document.getElementById('noise'),
  knots: document.getElementById('knots'),
  canvasWidth: document.getElementById('canvasWidth'),
  canvasHeight: document.getElementById('canvasHeight')
};

const valueDisplays = {
  density: document.getElementById('densityValue'),
  depth: document.getElementById('depthValue'),
  angle: document.getElementById('angleValue'),
  thickness: document.getElementById('thicknessValue'),
  irregularity: document.getElementById('irregularityValue'),
  ringSpacing: document.getElementById('ringSpacingValue'),
  noise: document.getElementById('noiseValue'),
  knots: document.getElementById('knotsValue')
};

const presetDescription = document.getElementById('presetDescription');
const presetBtns = document.querySelectorAll('.preset-btn');

function updateValueDisplays() {
  valueDisplays.density.textContent = controls.density.value;
  valueDisplays.depth.textContent = controls.depth.value;
  valueDisplays.angle.textContent = `${controls.angle.value}°`;
  valueDisplays.thickness.textContent = controls.thickness.value;
  valueDisplays.irregularity.textContent = controls.irregularity.value;
  valueDisplays.ringSpacing.textContent = controls.ringSpacing.value;
  valueDisplays.noise.textContent = controls.noise.value;
  valueDisplays.knots.textContent = controls.knots.value;
}

function updateGeneratorOptions() {
  generator.updateOptions({
    baseColor: controls.baseColor.value,
    grainColor: controls.grainColor.value,
    density: parseInt(controls.density.value, 10),
    depth: parseInt(controls.depth.value, 10),
    angle: parseInt(controls.angle.value, 10),
    thickness: parseInt(controls.thickness.value, 10),
    irregularity: parseInt(controls.irregularity.value, 10),
    ringSpacing: parseInt(controls.ringSpacing.value, 10),
    noise: parseInt(controls.noise.value, 10),
    knots: parseInt(controls.knots.value, 10)
  });
}

function handleControlChange() {
  updateValueDisplays();
  updateGeneratorOptions();
  debouncedGenerate();
}

async function applyPreset(presetKey) {
  const preset = woodPresets[presetKey];
  if (!preset) return;

  presetBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.preset === presetKey);
  });

  controls.baseColor.value = preset.baseColor;
  controls.grainColor.value = preset.grainColor;
  controls.density.value = preset.density;
  controls.depth.value = preset.depth;
  controls.angle.value = preset.angle;
  controls.thickness.value = preset.thickness;
  controls.irregularity.value = preset.irregularity;
  controls.ringSpacing.value = preset.ringSpacing;
  controls.noise.value = preset.noise;
  controls.knots.value = preset.knots;

  presetDescription.textContent = preset.description;

  updateValueDisplays();
  
  generator.cancel();
  showLoading();
  
  generator.options.seed = Date.now();
  updateGeneratorOptions();
  
  clearTimeout(debounceTimer);
  clearTimeout(previewDebounceTimer);
  
  await generator.generate(false);
  hideLoading();
}

Object.values(controls).forEach(control => {
  if (control && control.addEventListener) {
    control.addEventListener('input', handleControlChange);
    control.addEventListener('change', handleControlChange);
  }
});

presetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    applyPreset(btn.dataset.preset);
  });
});

document.getElementById('regenerateBtn').addEventListener('click', async () => {
  generator.options.seed = Date.now();
  generator.clearNoiseCache();
  generator.cancel();
  showLoading();
  await generator.generate(false);
  hideLoading();
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `wood-grain-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

document.getElementById('resizeBtn').addEventListener('click', async () => {
  const width = parseInt(controls.canvasWidth.value, 10);
  const height = parseInt(controls.canvasHeight.value, 10);
  
  if (width >= 100 && width <= 4000 && height >= 100 && height <= 4000) {
    canvas.width = width;
    canvas.height = height;
    generator.cancel();
    showLoading();
    await generator.generate(false);
    hideLoading();
  }
});

async function init() {
  updateValueDisplays();
  updateGeneratorOptions();
  showLoading();
  await generator.generate(false);
  hideLoading();
}

init();
