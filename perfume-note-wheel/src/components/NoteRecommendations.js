import React from 'react';
import { getPairings, NOTE_CATEGORIES } from '../data/perfumeData';

const NoteRecommendations = ({ selectedNote, selectedCategory }) => {
  if (selectedNote) {
    const pairings = getPairings(selectedNote.id);
    
    return (
      <div className="bg-white br3 shadow-5 pa4">
        <h2 className="f3 ma0 mb4 flex items-center">
          <span className="mr2">💫</span>
          搭配推荐
        </h2>
        
        <div className="mb4">
          <div
            className="pa3 br2 mb3"
            style={{ backgroundColor: selectedNote.category.color + '15', borderLeft: `4px solid ${selectedNote.category.color}` }}
          >
            <span className="b">{selectedNote.name}</span> 的最佳拍档
          </div>
          
          <div className="grid grid-cols-2 gap3">
            {pairings.map(pairing => (
              <div
                key={pairing.id}
                className="pa3 br2 pointer hover-shadow-4 transition-all"
                style={{ backgroundColor: pairing.category.color + '10', border: `1px solid ${pairing.category.color}30` }}
              >
                <div className="flex items-center mb2">
                  <div
                    className="w2 h2 br-100 flex items-center justify-center mr2"
                    style={{ backgroundColor: pairing.category.color }}
                  >
                    <span className="white b f6">{pairing.name[0]}</span>
                  </div>
                  <div>
                    <span className="b">{pairing.name}</span>
                    <p className="f6 gray ma0">{pairing.category.name}</p>
                  </div>
                </div>
                <p className="f6 dark-gray lh-copy ma0">{pairing.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt3 bt b--light-gray">
          <h3 className="f5 mb3">🧪 配方建议</h3>
          <div className="pa3 bg-washed-green br2">
            <p className="f6 dark-gray ma0">
              <span className="b green">推荐组合：</span>
              {selectedNote.name} + {pairings[0]?.name || '...'} + {pairings[1]?.name || '...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const category = NOTE_CATEGORIES[selectedCategory];
    const otherCategories = Object.entries(NOTE_CATEGORIES).filter(([k]) => k !== selectedCategory);
    
    return (
      <div className="bg-white br3 shadow-5 pa4">
        <h2 className="f3 ma0 mb4 flex items-center">
          <span className="mr2">🎨</span>
          {category.name}搭配指南
        </h2>
        
        {otherCategories.map(([key, cat]) => (
          <div key={key} className="mb3 pa3 br2" style={{ backgroundColor: cat.color + '10' }}>
            <h3 className="f5 mt0 mb2" style={{ color: cat.color }}>+ {cat.name}</h3>
            <p className="f6 dark-gray ma0">
              {category.name}与{cat.name}的经典搭配能创造出丰富的层次感
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white br3 shadow-5 pa4 tc">
      <div className="w5 h5 br-100 bg-washed-green flex items-center justify-center center mb3">
        <span className="f1 moon-gray">✨</span>
      </div>
      <h3 className="f4 dark-gray">发现完美搭配</h3>
      <p className="f6 gray">选择香调后查看推荐组合配方</p>
    </div>
  );
};

export default NoteRecommendations;
