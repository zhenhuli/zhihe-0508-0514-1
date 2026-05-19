import React from 'react';
import { Card, Checkbox, Input, Label, Icon, Grid, Message } from 'semantic-ui-react';
import { oils } from '../data/soapData';

const OilSelector = ({ selectedSkin, selectedOils, oilWeights, onToggleOil, onWeightChange, totalWeight }) => {
  if (!selectedSkin) {
    return (
      <Message info>
        <Icon name="info circle" />
        请先选择肤质类型，系统将为您推荐合适的油脂。
      </Message>
    );
  }

  const isRecommended = (oilId) => selectedSkin.recommendedOils.includes(oilId);
  const isAvoid = (oilId) => selectedSkin.avoidOils.includes(oilId);

  const getOilColor = (oilId) => {
    if (isAvoid(oilId)) return 'red';
    if (isRecommended(oilId)) return 'green';
    return 'grey';
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>
        <Icon name="leaf" /> 选择油脂原料
        <Label color="blue" style={{ marginLeft: '1rem' }}>
          总重量: {totalWeight}g
        </Label>
      </h2>
      <Message warning style={{ marginBottom: '1rem' }}>
        <Icon name="lightbulb" />
        <Message.Content>
          <Message.Header>配方建议</Message.Header>
          <p style={{ margin: '0.5rem 0 0 0' }}>
            <span style={{ color: '#21ba45' }}>■</span> 推荐使用 &nbsp;&nbsp;
            <span style={{ color: '#db2828' }}>■</span> 不建议使用 &nbsp;&nbsp;
            建议油脂总重量：300-500g
          </p>
        </Message.Content>
      </Message>
      <Grid stackable columns={2}>
        {oils.map(oil => {
          const selected = selectedOils.some(o => o.id === oil.id);
          const weight = oilWeights[oil.id] || 0;
          const color = getOilColor(oil.id);
          
          return (
            <Grid.Column key={oil.id}>
              <Card 
                fluid 
                className="soap-card"
                onClick={() => !isAvoid(oil.id) && onToggleOil(oil)}
                style={{ cursor: isAvoid(oil.id) ? 'not-allowed' : 'pointer' }}
              >
                <Card.Content>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <Checkbox
                          checked={selected}
                          onChange={(e) => { e.stopPropagation(); onToggleOil(oil); }}
                          disabled={isAvoid(oil.id)}
                          label={<strong style={{ color: color === 'red' ? '#999' : '#333' }}>{oil.name}</strong>}
                        />
                        {isRecommended(oil.id) && (
                          <Label color="green" size="mini" style={{ marginLeft: '0.5rem' }}>
                            推荐
                          </Label>
                        )}
                        {isAvoid(oil.id) && (
                          <Label color="red" size="mini" style={{ marginLeft: '0.5rem' }}>
                            不建议
                          </Label>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.3rem 0' }}>
                        {oil.description}
                      </p>
                      <div style={{ fontSize: '0.8rem', color: '#999' }}>
                        <Icon name="balance scale" size="small" /> 皂化值: {oil.saponificationValue}
                        <span style={{ margin: '0 0.5rem' }}>|</span>
                        <Icon name="chart bar" size="small" /> 推荐比例: {oil.recommendedUsage}
                      </div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <Label size="mini" color={oil.hardness >= 4 ? 'teal' : 'grey'}>
                          硬度 {oil.hardness}
                        </Label>
                        <Label size="mini" color={oil.cleaning >= 4 ? 'teal' : 'grey'}>
                          清洁 {oil.cleaning}
                        </Label>
                        <Label size="mini" color={oil.foamy >= 4 ? 'teal' : 'grey'}>
                          起泡 {oil.foamy}
                        </Label>
                        <Label size="mini" color={oil.moisturizing >= 4 ? 'teal' : 'grey'}>
                          保湿 {oil.moisturizing}
                        </Label>
                      </div>
                    </div>
                  </div>
                  {selected && (
                    <div 
                      style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Input
                        type="number"
                        size="small"
                        value={weight}
                        onChange={(e) => onWeightChange(oil.id, parseFloat(e.target.value) || 0)}
                        min="0"
                        max="500"
                        style={{ width: '100px' }}
                        label={{ basic: true, content: '克' }}
                        labelPosition="right"
                      />
                      <span style={{ marginLeft: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                        {totalWeight > 0 ? ((weight / totalWeight) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  )}
                </Card.Content>
              </Card>
            </Grid.Column>
          );
        })}
      </Grid>
    </div>
  );
};

export default OilSelector;
