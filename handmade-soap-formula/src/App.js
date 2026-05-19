import React, { useState, useEffect } from 'react';
import { Container, Header, Icon, Divider, Button, Menu, Segment } from 'semantic-ui-react';
import SkinTypeSelector from './components/SkinTypeSelector';
import OilSelector from './components/OilSelector';
import FormulaResult from './components/FormulaResult';
import FragranceSelector from './components/FragranceSelector';

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSkin, setSelectedSkin] = useState(null);
  const [selectedOils, setSelectedOils] = useState([]);
  const [oilWeights, setOilWeights] = useState({});
  const [superfat, setSuperfat] = useState(5);
  const [waterRatio, setWaterRatio] = useState(0.35);

  useEffect(() => {
    if (selectedSkin) {
      setSuperfat(selectedSkin.superfat);
      setWaterRatio(selectedSkin.waterRatio);
    }
  }, [selectedSkin]);

  const totalWeight = Object.values(oilWeights).reduce((sum, w) => sum + w, 0);

  const handleSelectSkin = (skin) => {
    setSelectedSkin(skin);
    setSelectedOils([]);
    setOilWeights({});
  };

  const handleToggleOil = (oil) => {
    const exists = selectedOils.some(o => o.id === oil.id);
    if (exists) {
      setSelectedOils(prev => prev.filter(o => o.id !== oil.id));
      const newWeights = { ...oilWeights };
      delete newWeights[oil.id];
      setOilWeights(newWeights);
    } else {
      setSelectedOils(prev => [...prev, oil]);
      setOilWeights(prev => ({ ...prev, [oil.id]: 100 }));
    }
  };

  const handleWeightChange = (oilId, weight) => {
    setOilWeights(prev => ({
      ...prev,
      [oilId]: Math.max(0, Math.min(500, weight))
    }));
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return selectedSkin !== null;
      case 1:
        return selectedOils.length > 0 && totalWeight >= 100;
      default:
        return true;
    }
  };

  const steps = [
    { key: 'skin', icon: 'user', title: '选择肤质' },
    { key: 'oils', icon: 'leaf', title: '选择油脂' },
    { key: 'fragrance', icon: 'fire', title: '香型搭配' },
    { key: 'result', icon: 'calculator', title: '查看配方' }
  ];

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <SkinTypeSelector selectedSkin={selectedSkin} onSelectSkin={handleSelectSkin} />;
      case 1:
        return (
          <OilSelector
            selectedSkin={selectedSkin}
            selectedOils={selectedOils}
            oilWeights={oilWeights}
            onToggleOil={handleToggleOil}
            onWeightChange={handleWeightChange}
            totalWeight={totalWeight}
          />
        );
      case 2:
        return <FragranceSelector selectedSkin={selectedSkin} />;
      case 3:
        return (
          <FormulaResult
            selectedSkin={selectedSkin}
            selectedOils={selectedOils}
            oilWeights={oilWeights}
            superfat={superfat}
            waterRatio={waterRatio}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-container">
      <Container>
        <Segment textAlign="center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '2rem', marginBottom: '2rem', borderRadius: '12px' }}>
          <Header as="h1" style={{ color: 'white', margin: 0 }}>
            <Icon name="bath" />
            手工皂配方调配工具
          </Header>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            根据您的肤质，智能推荐最适合的手工皂配方
          </p>
        </Segment>

        <Menu pointing secondary style={{ marginBottom: '2rem' }}>
          {steps.map((step, index) => (
            <Menu.Item
              key={step.key}
              active={activeStep === index}
              onClick={() => setActiveStep(index)}
              disabled={index > activeStep && !canProceed()}
            >
              <Icon name={step.icon} />
              {index + 1}. {step.title}
            </Menu.Item>
          ))}
        </Menu>

        {renderStepContent()}

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Button
            basic
            disabled={activeStep === 0}
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
          >
            <Icon name="arrow left" />
            上一步
          </Button>
          <Button
            primary
            disabled={activeStep === steps.length - 1 || !canProceed()}
            onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
          >
            下一步
            <Icon name="arrow right" />
          </Button>
        </div>

        <Divider />

        <footer style={{ textAlign: 'center', color: '#999', padding: '1rem 0' }}>
          <p style={{ margin: 0 }}>
            <Icon name="warning sign" />
            温馨提示：制作手工皂时请务必穿戴防护装备，确保操作规范，注意安全。
          </p>
        </footer>
      </Container>
    </div>
  );
}

export default App;
