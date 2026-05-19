import React from 'react';
import { Card, Statistic, Icon, Progress, Table, Label, Message } from 'semantic-ui-react';
import { calculateLyeAmount, calculateWaterAmount, curingTimes, oils } from '../data/soapData';

const FormulaResult = ({ selectedSkin, selectedOils, oilWeights, superfat, waterRatio }) => {
  if (!selectedSkin || selectedOils.length === 0) {
    return null;
  }

  const totalWeight = Object.values(oilWeights).reduce((sum, w) => sum + w, 0);
  const lyeAmount = calculateLyeAmount(oilWeights, selectedOils, superfat);
  const waterAmount = calculateWaterAmount(oilWeights, waterRatio);
  const totalBatchWeight = totalWeight + lyeAmount + waterAmount;

  const calculateSoapProperties = () => {
    let totalHardness = 0;
    let totalCleaning = 0;
    let totalFoamy = 0;
    let totalMoisturizing = 0;
    let totalStability = 0;

    selectedOils.forEach(oil => {
      const oilData = oils.find(o => o.id === oil.id);
      const weight = oilWeights[oil.id] || 0;
      if (oilData && weight > 0 && totalWeight > 0) {
        const ratio = weight / totalWeight;
        totalHardness += oilData.hardness * ratio;
        totalCleaning += oilData.cleaning * ratio;
        totalFoamy += oilData.foamy * ratio;
        totalMoisturizing += oilData.moisturizing * ratio;
        totalStability += oilData.stability * ratio;
      }
    });

    return {
      hardness: Math.round(totalHardness * 20),
      cleaning: Math.round(totalCleaning * 20),
      foamy: Math.round(totalFoamy * 20),
      moisturizing: Math.round(totalMoisturizing * 20),
      stability: Math.round(totalStability * 20)
    };
  };

  const properties = calculateSoapProperties();
  const processType = 'coldProcess';
  const curingInfo = curingTimes[processType];

  const getProgressColor = (value) => {
    if (value >= 70) return 'green';
    if (value >= 40) return 'yellow';
    return 'red';
  };

  const getPropertyLabel = (value) => {
    if (value >= 70) return '优秀';
    if (value >= 40) return '良好';
    return '一般';
  };

  return (
    <div>
      <h2 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
        <Icon name="calculator" /> 配方计算结果
      </h2>

      <div className="result-section">
        <h3>
          <Icon name="flask" /> 化学配比
        </h3>
        <Card.Group itemsPerRow={3} stackable style={{ marginTop: '1rem' }}>
          <Card inverted style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Card.Content textAlign="center">
              <Statistic inverted size="small">
                <Statistic.Value>{totalWeight}</Statistic.Value>
                <Statistic.Label>油脂总重量 (g)</Statistic.Label>
              </Statistic>
            </Card.Content>
          </Card>
          <Card inverted style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Card.Content textAlign="center">
              <Statistic inverted size="small">
                <Statistic.Value>{lyeAmount}</Statistic.Value>
                <Statistic.Label>氢氧化钠 (NaOH) (g)</Statistic.Label>
              </Statistic>
            </Card.Content>
          </Card>
          <Card inverted style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Card.Content textAlign="center">
              <Statistic inverted size="small">
                <Statistic.Value>{waterAmount}</Statistic.Value>
                <Statistic.Label>水 (g)</Statistic.Label>
              </Statistic>
            </Card.Content>
          </Card>
        </Card.Group>
        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '1.1rem' }}>
          <Icon name="balance scale" /> 总批次重量: <strong>{Math.round(totalBatchWeight)}g</strong>
          <span style={{ margin: '0 1rem' }}>|</span>
          <Icon name="shield" /> 超脂率: <strong>{superfat}%</strong>
          <span style={{ margin: '0 1rem' }}>|</span>
          <Icon name="tint" /> 水油比: <strong>{(waterRatio * 100).toFixed(0)}%</strong>
        </div>
      </div>

      <Card style={{ marginTop: '1.5rem' }}>
        <Card.Content>
          <Card.Header>
            <Icon name="chart line" /> 皂体特性分析
          </Card.Header>
          <div style={{ marginTop: '1rem' }}>
            {[
              { key: 'hardness', label: '硬度', value: properties.hardness, icon: 'cube' },
              { key: 'cleaning', label: '清洁力', value: properties.cleaning, icon: 'broom' },
              { key: 'foamy', label: '起泡性', value: properties.foamy, icon: 'bubbles' },
              { key: 'moisturizing', label: '保湿力', value: properties.moisturizing, icon: 'heart' },
              { key: 'stability', label: '稳定性', value: properties.stability, icon: 'shield' }
            ].map(prop => (
              <div key={prop.key} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span>
                    <Icon name={prop.icon} /> {prop.label}
                  </span>
                  <Label color={getProgressColor(prop.value)} size="mini">
                    {prop.value}% - {getPropertyLabel(prop.value)}
                  </Label>
                </div>
                <Progress
                  percent={prop.value}
                  color={getProgressColor(prop.value)}
                  size="small"
                />
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      <Card style={{ marginTop: '1.5rem' }}>
        <Card.Content>
          <Card.Header>
            <Icon name="table" /> 油脂配比明细
          </Card.Header>
          <Table celled striped style={{ marginTop: '1rem' }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>油脂名称</Table.HeaderCell>
                <Table.HeaderCell>重量 (g)</Table.HeaderCell>
                <Table.HeaderCell>占比</Table.HeaderCell>
                <Table.HeaderCell>皂化值</Table.HeaderCell>
                <Table.HeaderCell>碱量 (g)</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {selectedOils.map(oil => {
                const oilData = oils.find(o => o.id === oil.id);
                const weight = oilWeights[oil.id] || 0;
                const lye = weight * oilData.saponificationValue * (1 - superfat / 100);
                return (
                  <Table.Row key={oil.id}>
                    <Table.Cell>{oil.name}</Table.Cell>
                    <Table.Cell>{weight}</Table.Cell>
                    <Table.Cell>{totalWeight > 0 ? ((weight / totalWeight) * 100).toFixed(1) : 0}%</Table.Cell>
                    <Table.Cell>{oilData.saponificationValue}</Table.Cell>
                    <Table.Cell>{lye.toFixed(2)}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Card.Content>
      </Card>

      <Message info style={{ marginTop: '1.5rem' }}>
        <Icon name="clock" />
        <Message.Content>
          <Message.Header>成型时间预估</Message.Header>
          <p style={{ marginTop: '0.5rem' }}>
            <strong>{curingInfo.description}</strong>
          </p>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            入模后 {curingInfo.minDays}-{curingInfo.maxDays} 天可脱模，
            约 {curingInfo.cureWeeks} 周完全熟成后使用最佳。
          </p>
        </Message.Content>
      </Message>
    </div>
  );
};

export default FormulaResult;
