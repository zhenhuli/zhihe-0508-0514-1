import React, { useState } from 'react';
import NoteWheel from './components/NoteWheel';
import NoteAnalyzer from './components/NoteAnalyzer';
import NoteRecommendations from './components/NoteRecommendations';

const App = () => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setSelectedNote(null);
  };

  return (
    <div className="min-vh-100 bg-washed-yellow pa4">
      <header className="tc mb5">
        <h1 className="f2 fw6 dark-gray mb2">🌸 香调轮盘</h1>
        <p className="f5 gray">探索香水的奥秘，发现你的专属香氛配方</p>
      </header>

      <div className="flex flex-wrap justify-center items-start gap4 max-w-7xl center">
        <div className="order-1 order-2-ns w-100 w-40-ns">
          <NoteAnalyzer
            selectedNote={selectedNote}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className="order-2 order-1-ns w-100 w-auto-ns">
          <div className="bg-white br3 shadow-5 pa3">
            <NoteWheel
              selectedNote={selectedNote}
              onNoteSelect={handleNoteSelect}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        </div>

        <div className="order-3 w-100 w-40-ns">
          <NoteRecommendations
            selectedNote={selectedNote}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>

      <footer className="tc mt5 pt4 bt b--light-gray">
        <p className="f6 gray">
          💡 提示：点击轮盘中的圈层或具体香调，探索香水的前、中、后调
        </p>
      </footer>
    </div>
  );
};

export default App;
