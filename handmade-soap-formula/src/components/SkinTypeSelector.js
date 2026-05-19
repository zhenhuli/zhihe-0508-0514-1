import React from 'react';
import { Card, Icon, Grid } from 'semantic-ui-react';
import { skinTypes } from '../data/soapData';

const SkinTypeSelector = ({ selectedSkin, onSelectSkin }) => {
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>
        <Icon name="user circle" /> 选择肤质类型
      </h2>
      <Grid stackable columns={3}>
        {skinTypes.map(skin => (
          <Grid.Column key={skin.id}>
            <Card
              className={`skin-type-card ${selectedSkin?.id === skin.id ? 'selected' : ''}`}
              onClick={() => onSelectSkin(skin)}
              fluid
            >
              <Card.Content textAlign="center">
                <Icon name={skin.icon} size="big" color={selectedSkin?.id === skin.id ? 'blue' : 'grey'} />
                <Card.Header style={{ marginTop: '0.5rem' }}>{skin.name}</Card.Header>
                <Card.Description style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  {skin.description}
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        ))}
      </Grid>
    </div>
  );
};

export default SkinTypeSelector;
