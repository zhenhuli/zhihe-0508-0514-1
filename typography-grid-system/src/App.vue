<template>
  <div class="app-container">
    <nav class="navbar navbar-dark bg-dark">
      <div class="container">
        <span class="navbar-brand mb-0 h1">
          <i class="bi bi-grid-3x3-gap me-2"></i>
          网页版式网格规范设计器
        </span>
      </div>
    </nav>

    <div class="container-fluid mt-4">
      <div class="row">
        <div class="col-lg-3">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">网格参数设置</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">版心宽度</label>
                <div class="d-flex align-items-center">
                  <input type="range" class="form-range me-3" v-model="gridSettings.pageWidth" min="600" max="1920" step="10">
                  <input type="number" class="form-control form-control-sm width-input" v-model.number="gridSettings.pageWidth">
                  <span class="ms-2 text-muted">px</span>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">列数</label>
                <div class="d-flex align-items-center">
                  <input type="range" class="form-range me-3" v-model.number="gridSettings.columns" min="1" max="24" step="1">
                  <input type="number" class="form-control form-control-sm width-input" v-model.number="gridSettings.columns">
                  <span class="ms-2 text-muted">列</span>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">列间距 (Gutter)</label>
                <div class="d-flex align-items-center">
                  <input type="range" class="form-range me-3" v-model.number="gridSettings.gutter" min="0" max="60" step="2">
                  <input type="number" class="form-control form-control-sm width-input" v-model.number="gridSettings.gutter">
                  <span class="ms-2 text-muted">px</span>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">外边距 (Margin)</label>
                <div class="d-flex align-items-center">
                  <input type="range" class="form-range me-3" v-model.number="gridSettings.margin" min="0" max="100" step="5">
                  <input type="number" class="form-control form-control-sm width-input" v-model.number="gridSettings.margin">
                  <span class="ms-2 text-muted">px</span>
                </div>
              </div>

              <hr class="my-4">

              <h6 class="mb-3">基线网格</h6>
              <div class="mb-3 form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="gridSettings.showBaseline" id="baselineToggle">
                <label class="form-check-label" for="baselineToggle">显示基线网格</label>
              </div>

              <div class="mb-3" v-if="gridSettings.showBaseline">
                <label class="form-label">基线高度</label>
                <div class="d-flex align-items-center">
                  <input type="range" class="form-range me-3" v-model.number="gridSettings.baseline" min="4" max="32" step="2">
                  <input type="number" class="form-control form-control-sm width-input" v-model.number="gridSettings.baseline">
                  <span class="ms-2 text-muted">px</span>
                </div>
              </div>

              <hr class="my-4">

              <h6 class="mb-3">显示选项</h6>
              <div class="mb-2 form-check">
                <input class="form-check-input" type="checkbox" v-model="gridSettings.showColumns" id="showColumns">
                <label class="form-check-label" for="showColumns">显示列</label>
              </div>
              <div class="mb-2 form-check">
                <input class="form-check-input" type="checkbox" v-model="gridSettings.showGutters" id="showGutters">
                <label class="form-check-label" for="showGutters">显示间距</label>
              </div>
              <div class="mb-2 form-check">
                <input class="form-check-input" type="checkbox" v-model="gridSettings.showNumbers" id="showNumbers">
                <label class="form-check-label" for="showNumbers">显示列编号</label>
              </div>

              <hr class="my-4">

              <button class="btn btn-outline-primary w-100 mb-2" @click="resetDefaults">
                重置默认值
              </button>
              <button class="btn btn-success w-100" @click="copyCSS">
                复制 CSS 代码
              </button>
            </div>
          </div>

          <div class="card shadow-sm mt-4">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0">当前参数</h5>
            </div>
            <div class="card-body">
              <div class="row g-2">
                <div class="col-6">
                  <div class="p-2 bg-light rounded text-center">
                    <small class="text-muted d-block">列宽</small>
                    <strong>{{ columnWidth.toFixed(1) }}px</strong>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-2 bg-light rounded text-center">
                    <small class="text-muted d-block">总宽度</small>
                    <strong>{{ totalWidth.toFixed(0) }}px</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-9">
          <div class="card shadow-sm">
            <div class="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0">实时预览</h5>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-light" :class="{ active: previewScale === 100 }" @click="previewScale = 100">100%</button>
                <button class="btn btn-outline-light" :class="{ active: previewScale === 75 }" @click="previewScale = 75">75%</button>
                <button class="btn btn-outline-light" :class="{ active: previewScale === 50 }" @click="previewScale = 50">50%</button>
              </div>
            </div>
            <div class="card-body preview-container" ref="previewContainer">
              <div class="preview-wrapper" :style="{ transform: `scale(${previewScale / 100})` }">
                <div class="grid-preview" :style="previewStyle">
                  <div class="baseline-grid" v-if="gridSettings.showBaseline" :style="baselineStyle"></div>
                  
                  <div class="columns-container" :style="columnsContainerStyle">
                    <div class="column" v-for="n in gridSettings.columns" :key="n" :style="getColumnStyle(n)">
                      <span v-if="gridSettings.showNumbers" class="column-number">{{ n }}</span>
                    </div>
                  </div>

                  <div class="sample-content" v-if="gridSettings.showColumns">
                    <h2>网页版式设计示例</h2>
                    <p>这是一段示例文本，用于展示网格系统在实际排版中的应用。通过调整左侧的参数，您可以实时观察网格系统对版面布局的影响。</p>
                    <div class="row g-3 mt-4">
                      <div class="col-md-4" v-for="n in 6" :key="n">
                        <div class="card sample-card">
                          <div class="card-body">
                            <h6 class="card-title">卡片 {{ n }}</h6>
                            <p class="card-text small">示例内容区域</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm mt-4">
            <div class="card-header bg-dark text-white">
              <h5 class="mb-0">生成的 CSS 代码</h5>
            </div>
            <div class="card-body">
              <pre class="bg-dark text-light p-3 rounded"><code>{{ generatedCSS }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'

const gridSettings = reactive({
  pageWidth: 1200,
  columns: 12,
  gutter: 24,
  margin: 24,
  baseline: 8,
  showBaseline: true,
  showColumns: true,
  showGutters: true,
  showNumbers: true
})

const previewScale = ref(100)

const columnWidth = computed(() => {
  const totalGutter = (Number(gridSettings.columns) - 1) * Number(gridSettings.gutter)
  const totalMargin = Number(gridSettings.margin) * 2
  return (Number(gridSettings.pageWidth) - totalGutter - totalMargin) / Number(gridSettings.columns)
})

const totalWidth = computed(() => {
  return Number(gridSettings.pageWidth)
})

const previewStyle = computed(() => ({
  width: `${gridSettings.pageWidth}px`,
  margin: '0 auto',
  paddingLeft: `${gridSettings.margin}px`,
  paddingRight: `${gridSettings.margin}px`,
  backgroundColor: '#f8f9fa',
  position: 'relative',
  minHeight: '600px'
}))

const baselineStyle = computed(() => {
  const baseline = Number(gridSettings.baseline)
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent ${baseline - 1}px, rgba(255, 100, 100, 0.3) ${baseline - 1}px, rgba(255, 100, 100, 0.3) ${baseline}px)`,
    pointerEvents: 'none',
    zIndex: 1
  }
})

const columnsContainerStyle = computed(() => ({
  display: 'flex',
  gap: `${gridSettings.gutter}px`,
  position: 'relative',
  zIndex: 2
}))

const getColumnStyle = (n) => {
  return {
    flex: 1,
    backgroundColor: gridSettings.showColumns ? 'rgba(108, 117, 125, 0.15)' : 'transparent',
    borderRight: gridSettings.showGutters && n < Number(gridSettings.columns) ? `1px dashed rgba(220, 53, 69, 0.5)` : 'none',
    minHeight: '600px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: '10px'
  }
}

const generatedCSS = computed(() => {
  return `/* 网格系统 CSS */
:root {
  --page-width: ${gridSettings.pageWidth}px;
  --columns: ${gridSettings.columns};
  --gutter: ${gridSettings.gutter}px;
  --margin: ${gridSettings.margin}px;
  --column-width: ${columnWidth.value.toFixed(1)}px;
  --baseline: ${gridSettings.baseline}px;
}

.container {
  max-width: var(--page-width);
  margin: 0 auto;
  padding-left: var(--margin);
  padding-right: var(--margin);
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: calc(var(--gutter) / -2);
  margin-right: calc(var(--gutter) / -2);
}

.col {
  flex: 1;
  padding-left: calc(var(--gutter) / 2);
  padding-right: calc(var(--gutter) / 2);
}

/* 基线网格 */
.baseline-grid {
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent calc(var(--baseline) - 1px),
    rgba(255, 100, 100, 0.3) calc(var(--baseline) - 1px),
    rgba(255, 100, 100, 0.3) var(--baseline)
  );
}`
})

const resetDefaults = () => {
  Object.assign(gridSettings, {
    pageWidth: 1200,
    columns: 12,
    gutter: 24,
    margin: 24,
    baseline: 8,
    showBaseline: true,
    showColumns: true,
    showGutters: true,
    showNumbers: true
  })
}

const copyCSS = () => {
  navigator.clipboard.writeText(generatedCSS.value).then(() => {
    alert('CSS 代码已复制到剪贴板！')
  })
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #e9ecef;
}

.width-input {
  width: 80px;
}

.preview-container {
  overflow: auto;
  max-height: 700px;
}

.preview-wrapper {
  transform-origin: top left;
}

.grid-preview {
  border: 2px solid #dee2e6;
  border-radius: 4px;
}

.column-number {
  font-size: 12px;
  color: #6c757d;
  font-weight: bold;
}

.sample-content {
  position: relative;
  z-index: 3;
  padding: 20px;
}

.sample-card {
  background: rgba(255, 255, 255, 0.9);
}

pre {
  margin: 0;
  max-height: 400px;
  overflow: auto;
}
</style>
