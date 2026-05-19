import React, { useState } from 'react';
import { Card, Checkbox, Icon, Grid, Label, Message, Button } from 'semantic-ui-react';
import { fragrances, getRecommendedFragrances, getRecommendedAdditives } from '../data/soapData';

const FragranceSelector = ({ selectedSkin }) => {
  const [selectedFragrances, setSelectedFragrances] = useState([]);
  const [selectedAdditives, setSelectedAdditives] = useState([]);

  if (!selectedSkin) {
    return null;
  }

  const recommendedFragrances = getRecommendedFragrances(selectedSkin.id);
  const recommendedAdditives = getRecommendedAdditives(selectedSkin.id);

  const toggleFragrance = (fragrance) => {
    setSelectedFragrances(prev => {
      const exists = prev.some(f => f.id === fragrance.id);
      if (exists) {
        return prev.filter(f => f.id !== fragrance.id);
      } else {
        return [...prev, fragrance];
      }
    });
  };

  const toggleAdditive = (additive) => {
    setSelectedAdditives(prev => {
      const exists = prev.some(a => a.id === additive.id);
      if (exists) {
        return prev.filter(a => a.id !== additive.id);
      } else {
        return [...prev, additive];
      }
    });
  };

  const getNoteColor = (note) => {
    switch (note) {
      case '花香调': return 'pink';
      case '草本调': return 'green';
      case '柑橘调': return 'yellow';
      case '木质调': return 'brown';
      case '美食调': return 'orange';
      default: return 'grey';
    }
  };

  const getBlendingSuggestions = () => {
    if (selectedFragrances.length === 0) return [];
    
    const suggestions = new Set();
    selectedFragrances.forEach(f => {
      f.blendsWith.forEach(b => {
        const fragrance = fragrances.find(fr => fr.id === b);
        if (fragrance && !selectedFragrances.some(sf => sf.id === b) && recommendedFragrances.some(rf => rf.id === b)) {
          suggestions.add(fragrance);
        }
      });
    });
    
    return Array.from(suggestions);
  };

  const blendingSuggestions = getBlendingSuggestions();

  return (
    <div>
      <h2 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
        <Icon name="fire" /> 香型与添加物搭配
      </h2>

      <Message success style={{ marginBottom: '1.5rem' }}>
        <Icon name="star" />
        <Message.Content>
          <Message.Header>为 {selectedSkin.name} 推荐</Message.Header>
          根据您选择的肤质类型，以下香型和添加物最为适合。
        </Message.Content>
      </Message>

      <h3 style={{ marginBottom: '1rem' }}>
        <Icon name="leaf" /> 推荐精油香型
      </h3>
      <Grid stackable columns={3}>
        {recommendedFragrances.map(fragrance => (
          <Grid.Column key={fragrance.id}>
            <Card 
              fluid 
              className="soap-card"
              onClick={() => toggleFragrance(fragrance)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Content>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <Checkbox
                        checked={selectedFragrances.some(f => f.id === fragrance.id)}
                        onChange={(e) => { e.stopPropagation(); toggleFragrance(fragrance); }}
                        label={<strong>{fragrance.name}</strong>}
                      />
                      <Label color={getNoteColor(fragrance.note)} size="mini" style={{ marginLeft: '0.5rem' }}>
                        {fragrance.note}
                      </Label>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#666', margin: '0.3rem 0' }}>
                      {fragrance.description}
                    </p>
                    <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
                      <Icon name="percentage" size="small" /> 推荐比例: {fragrance.usageRate}
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </Grid.Column>
        ))}
      </Grid>

      {selectedFragrances.length > 0 && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f9eb', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#67c23a' }}>
            <Icon name="check circle" /> 已选择的香型
          </h4>
          <div>
            {selectedFragrances.map(f => (
              <span key={f.id} className="fragrance-tag" style={{ background: '#67c23a', color: 'white' }}>
                {f.name}
              </span>
            ))}
          </div>
          {blendingSuggestions.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.9rem', color: '#67c23a', marginBottom: '0.5rem' }}>
                💡 搭配建议：这些精油与您的选择很协调
              </p>
              <div>
                {blendingSuggestions.map(f => (
                  <Button
                    key={f.id}
                    size="mini"
                    basic
                    color="green"
                    onClick={() => toggleFragrance(f)}
                    style={{ margin: '0.2rem' }}
                  >
                    + {f.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <Icon name="magic" /> 推荐添加物
      </h3>
      <Grid stackable columns={4}>
        {recommendedAdditives.map(additive => (
          <Grid.Column key={additive.id}>
            <Card 
              fluid 
              className="soap-card"
              onClick={() => toggleAdditive(additive)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Content textAlign="center">
                <Checkbox
                  checked={selectedAdditives.some(a => a.id === additive.id)}
                  onChange={(e) => { e.stopPropagation(); toggleAdditive(additive); }}
                  label={<strong>{additive.name}</strong>}
                />
                <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.5rem 0' }}>
                  {additive.description}
                </p>
                <Label size="mini" color="blue">
                  {additive.usageRate}
                </Label>
              </Card.Content>
            </Card>
          </Grid.Column>
        ))}
      </Grid>

      {selectedAdditives.length > 0 && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#ecf5ff', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '0.5rem', color: '#409eff' }}>
            <Icon name="check circle" /> 已选择的添加物
          </h4>
          <div>
            {selectedAdditives.map(a => (
              <span key={a.id} className="fragrance-tag" style={{ background: '#409eff', color: 'white' }}>
                {a.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FragranceSelector;
