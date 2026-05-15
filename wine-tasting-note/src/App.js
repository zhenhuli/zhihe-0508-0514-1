import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { db, exportToJSON, importFromJSON, exportToCSV, importFromCSV } from './db';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const FLAVOR_LABELS = ['单宁', '酸度', '果香', '橡木', '甜度', '酒体'];

function App() {
  const [records, setRecords] = useState([]);
  const [currentForm, setCurrentForm] = useState({
    region: '',
    year: '',
    tannin: 5,
    acidity: 5,
    fruit: 5,
    oak: 5,
    sweetness: 5,
    body: 5,
    notes: ''
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await db.getAllRecords();
      setRecords(data);
    } catch (error) {
      console.error('加载记录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentForm(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || '' : value
    }));
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setCurrentForm(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRecord = {
      ...currentForm,
      id: Date.now(),
      createdAt: new Date().toLocaleDateString('zh-CN')
    };
    try {
      await db.addRecord(newRecord);
      setRecords(prev => [newRecord, ...prev]);
      setCurrentForm({
        region: '',
        year: '',
        tannin: 5,
        acidity: 5,
        fruit: 5,
        oak: 5,
        sweetness: 5,
        body: 5,
        notes: ''
      });
    } catch (error) {
      console.error('保存记录失败:', error);
      alert('保存记录失败，请重试');
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('确定要删除这条品鉴记录吗？')) return;
    try {
      await db.deleteRecord(id);
      setRecords(prev => prev.filter(r => r.id !== id));
      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord(null);
      }
    } catch (error) {
      console.error('删除记录失败:', error);
      alert('删除记录失败，请重试');
    }
  };

  const handleExportJSON = () => {
    exportToJSON(records);
  };

  const handleExportCSV = () => {
    exportToCSV(records);
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      let importedRecords;
      if (file.name.toLowerCase().endsWith('.json')) {
        importedRecords = await importFromJSON(file);
      } else if (file.name.toLowerCase().endsWith('.csv')) {
        importedRecords = await importFromCSV(file);
      } else {
        throw new Error('不支持的文件格式，请选择 JSON 或 CSV 文件');
      }
      
      let successCount = 0;
      for (const record of importedRecords) {
        try {
          record.id = Date.now() + Math.random();
          if (!record.createdAt) {
            record.createdAt = new Date().toLocaleDateString('zh-CN');
          }
          await db.addRecord(record);
          successCount++;
        } catch (err) {
          console.warn('跳过重复记录:', record);
        }
      }
      await loadRecords();
      alert(`成功导入 ${successCount} 条记录！`);
    } catch (error) {
      console.error('导入失败:', error);
      alert('导入失败: ' + error.message);
    }
    e.target.value = '';
  };

  const getChartData = (record) => ({
    labels: FLAVOR_LABELS,
    datasets: [
      {
        label: '风味特征',
        data: [
          record.tannin,
          record.acidity,
          record.fruit,
          record.oak,
          record.sweetness,
          record.body
        ],
        backgroundColor: 'rgba(137, 26, 50, 0.3)',
        borderColor: 'rgba(137, 26, 50, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(137, 26, 50, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(137, 26, 50, 1)',
      },
    ],
  });

  const chartOptions = {
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="w-100 min-vh-100 bg-washed-yellow flex items-center justify-center">
        <div className="tc">
          <div className="f3 burgundy mb3">🍷 加载中...</div>
          <p className="gray">正在加载品鉴记录</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 min-vh-100 bg-washed-yellow pa4">
      <div className="mw9 center">
        <h1 className="f1 fw6 burgundy tc mb5 lh-title">
          🍷 红酒品鉴笔记
        </h1>

        <div className="flex flex-wrap">
          <div className="w-100 w-50-l pr4-l mb4 mb0-l">
            <div className="bg-white br3 shadow-1 pa4">
              <h2 className="f3 fw6 burgundy mb4">📝 录入品鉴记录</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb3">
                  <label className="db fw6 lh-copy f6 mb2">产区</label>
                  <input
                    type="text"
                    name="region"
                    value={currentForm.region}
                    onChange={handleInputChange}
                    placeholder="例如：波尔多、勃艮第..."
                    className="pa2 input-reset ba b--black-20 bg-white w-100 br2"
                    required
                  />
                </div>

                <div className="mb3">
                  <label className="db fw6 lh-copy f6 mb2">年份</label>
                  <input
                    type="number"
                    name="year"
                    value={currentForm.year}
                    onChange={handleInputChange}
                    placeholder="例如：2018"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="pa2 input-reset ba b--black-20 bg-white w-100 br2"
                    required
                  />
                </div>

                <div className="mb4">
                  <h3 className="f5 fw6 mb3">风味层次评分 (0-10)</h3>
                  
                  {[
                    { key: 'tannin', label: '单宁' },
                    { key: 'acidity', label: '酸度' },
                    { key: 'fruit', label: '果香' },
                    { key: 'oak', label: '橡木' },
                    { key: 'sweetness', label: '甜度' },
                    { key: 'body', label: '酒体' },
                  ].map(({ key, label }) => (
                    <div key={key} className="mb3">
                      <div className="flex justify-between items-center mb1">
                        <label className="fw5 f6">{label}</label>
                        <span className="f5 fw6 burgundy">{currentForm[key]}</span>
                      </div>
                      <input
                        type="range"
                        name={key}
                        min="0"
                        max="10"
                        value={currentForm[key]}
                        onChange={handleSliderChange}
                        className="w-100"
                      />
                    </div>
                  ))}
                </div>

                <div className="mb4">
                  <label className="db fw6 lh-copy f6 mb2">品鉴笔记</label>
                  <textarea
                    name="notes"
                    value={currentForm.notes}
                    onChange={handleInputChange}
                    placeholder="记录您的品鉴感受..."
                    rows="3"
                    className="pa2 input-reset ba b--black-20 bg-white w-100 br2"
                  />
                </div>

                <button
                  type="submit"
                  className="w-100 bg-burgundy white pv3 ph4 br2 fw6 f5 hover-bg-dark-red pointer transition-colors"
                >
                  保存品鉴记录
                </button>
              </form>
            </div>

            <div className="bg-white br3 shadow-1 pa4 mt4">
              <div className="flex justify-between items-center mb4">
                <h2 className="f3 fw6 burgundy">📋 品鉴档案 ({records.length})</h2>
                <div className="flex gap2">
                  <button
                    onClick={handleExportJSON}
                    disabled={records.length === 0}
                    className="pa2 bg-green white br2 f6 fw5 hover-bg-dark-green pointer bn disabled-opacity-50"
                    title="导出为 JSON 格式"
                  >
                    📤 JSON
                  </button>
                  <button
                    onClick={handleExportCSV}
                    disabled={records.length === 0}
                    className="pa2 bg-orange white br2 f6 fw5 hover-bg-dark-orange pointer bn disabled-opacity-50"
                    title="导出为 CSV 格式（可用 Excel 打开）"
                  >
                    📊 CSV
                  </button>
                  <button
                    onClick={handleImportClick}
                    className="pa2 bg-blue white br2 f6 fw5 hover-bg-dark-blue pointer bn"
                    title="导入 JSON 或 CSV 文件"
                  >
                    📥 导入
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.csv"
                    onChange={handleFileChange}
                    className="dn"
                  />
                </div>
              </div>
              {records.length === 0 ? (
                <p className="gray tc py4">暂无品鉴记录，开始您的第一次品鉴吧！</p>
              ) : (
                <div className="max-h-60 overflow-y-auto">
                  {records.map(record => (
                    <div
                      key={record.id}
                      className={`pa3 mb2 br2 pointer ${
                        selectedRecord?.id === record.id
                          ? 'bg-light-red b--burgundy ba'
                          : 'bg-washed-yellow hover-bg-light-yellow'
                      }`}
                      onClick={() => setSelectedRecord(record)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="fw6 mb1">
                            {record.region} {record.year}
                          </h4>
                          <p className="f6 gray">{record.createdAt}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRecord(record.id);
                          }}
                          className="f6 red hover-dark-red bg-transparent bn pointer"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-100 w-50-l pl4-l">
            <div className="bg-white br3 shadow-1 pa4">
              <h2 className="f3 fw6 burgundy mb4">📊 风味雷达图</h2>
              {selectedRecord ? (
                <div>
                  <div className="mb4">
                    <h3 className="f4 fw6 mb2">
                      {selectedRecord.region} {selectedRecord.year}
                    </h3>
                    <p className="f6 gray mb3">记录日期: {selectedRecord.createdAt}</p>
                    {selectedRecord.notes && (
                      <p className="i bg-washed-yellow pa3 br2">
                        "{selectedRecord.notes}"
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                      <Radar data={getChartData(selectedRecord)} options={chartOptions} />
                    </div>
                  </div>
                  <div className="mt4 flex flex-wrap justify-center gap2">
                    <span className="f6 bg-light-red pa2 br1">单宁: {selectedRecord.tannin}/10</span>
                    <span className="f6 bg-light-red pa2 br1">酸度: {selectedRecord.acidity}/10</span>
                    <span className="f6 bg-light-red pa2 br1">果香: {selectedRecord.fruit}/10</span>
                    <span className="f6 bg-light-red pa2 br1">橡木: {selectedRecord.oak}/10</span>
                    <span className="f6 bg-light-red pa2 br1">甜度: {selectedRecord.sweetness}/10</span>
                    <span className="f6 bg-light-red pa2 br1">酒体: {selectedRecord.body}/10</span>
                  </div>
                </div>
              ) : (
                <div className="tc py8">
                  <p className="gray mb4">点击左侧品鉴档案查看风味雷达图</p>
                  <div className="flex justify-center">
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                      <Radar
                        data={getChartData(currentForm)}
                        options={chartOptions}
                      />
                    </div>
                  </div>
                  <p className="f6 gray mt3">上图为当前表单的预览</p>
                </div>
              )}
            </div>

            <div className="bg-white br3 shadow-1 pa4 mt4">
              <h2 className="f3 fw6 burgundy mb3">💡 品鉴小贴士</h2>
              <ul className="list pl0 lh-copy">
                <li className="mb2 flex items-start">
                  <span className="mr2">🍇</span>
                  <span>单宁：感受口腔的干涩程度，高单宁红酒更适合陈年</span>
                </li>
                <li className="mb2 flex items-start">
                  <span className="mr2">🍋</span>
                  <span>酸度：感受口中的生津感，高酸度红酒更清爽</span>
                </li>
                <li className="mb2 flex items-start">
                  <span className="mr2">🍒</span>
                  <span>果香：红色或黑色水果的香气，如樱桃、黑莓等</span>
                </li>
                <li className="mb2 flex items-start">
                  <span className="mr2">🪵</span>
                  <span>橡木：香草、烟熏、烘烤的气息</span>
                </li>
                <li className="mb2 flex items-start">
                  <span className="mr2">🍯</span>
                  <span>甜度：从干型到甜型的感知</span>
                </li>
                <li className="flex items-start">
                  <span className="mr2">💧</span>
                  <span>酒体：口感的轻重，如水、牛奶、奶油的区别</span>
                </li>
              </ul>
            </div>

            <div className="bg-white br3 shadow-1 pa4 mt4">
              <h2 className="f3 fw6 burgundy mb3">💾 数据存储</h2>
              <p className="f6 gray lh-copy">
                您的品鉴记录安全存储在浏览器的 IndexedDB 数据库中，支持大容量存储。
                使用导出功能备份您的珍贵品鉴笔记，随时可以导入恢复。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
