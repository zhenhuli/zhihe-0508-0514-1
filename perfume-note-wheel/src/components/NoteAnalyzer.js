import React from 'react';
import { NOTE_CATEGORIES } from '../data/perfumeData';

const NoteAnalyzer = ({ selectedNote, selectedCategory }) => {
  if (selectedNote) {
    return (
      <div className="bg-white br3 shadow-5 pa4">
        <div className="flex items-center mb3">
          <div
            className="w3 h3 br-100 flex items-center justify-center mr3"
            style={{ backgroundColor: selectedNote.category.color }}
          >
            <span className="white b f4">{selectedNote.name[0]}</span>
          </div>
          <div>
            <h2 className="f3 ma0">{selectedNote.name}</h2>
            <span
              className="f6 ph2 pv1 br-pill white"
              style={{ backgroundColor: selectedNote.category.color }}
            >
              {selectedNote.category.name}
            </span>
          </div>
        </div>
        
        <p className="f5 dark-gray lh-copy">{selectedNote.desc}</p>
        
        <div className="mt3 pt3 bt b--light-gray">
          <h3 className="f5 mb2">📝 香调特点</h3>
          <ul className="list pl0">
            <li className="mb2 flex items-center">
              <span className="green mr2">✓</span>
              属于{selectedNote.category.name}
            </li>
            <li className="mb2 flex items-center">
              <span className="green mr2">✓</span>
              {selectedNote.category.description}
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const category = NOTE_CATEGORIES[selectedCategory];
    return (
      <div className="bg-white br3 shadow-5 pa4">
        <div className="flex items-center mb3">
          <div
            className="w3 h3 br-100 flex items-center justify-center mr3"
            style={{ backgroundColor: category.color }}
          >
            <span className="white b f4">{category.name[0]}</span>
          </div>
          <h2 className="f3 ma0">{category.name}</h2>
        </div>
        
        <p className="f5 dark-gray lh-copy">{category.description}</p>
        
        <div className="mt3 pt3 bt b--light-gray">
          <h3 className="f5 mb2">🌸 包含香调</h3>
          <div className="flex flex-wrap gap2">
            {category.notes.map(note => (
              <span
                key={note.id}
                className="f6 ph2 pv1 br-pill"
                style={{ backgroundColor: category.color + '20', color: category.color }}
              >
                {note.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white br3 shadow-5 pa4 tc">
      <div className="w5 h5 br-100 bg-washed-blue flex items-center justify-center center mb3">
        <span className="f1 moon-gray">👃</span>
      </div>
      <h3 className="f4 dark-gray">点击轮盘探索香调</h3>
      <p className="f6 gray">选择圈层或具体香调查看详细解析</p>
    </div>
  );
};

export default NoteAnalyzer;
