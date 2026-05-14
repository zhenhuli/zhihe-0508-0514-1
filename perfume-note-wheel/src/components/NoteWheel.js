import React, { useState, useMemo } from 'react';
import { NOTE_CATEGORIES, getPairingIds } from '../data/perfumeData';

const NoteWheel = ({ selectedNote, onNoteSelect, onCategorySelect }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredNote, setHoveredNote] = useState(null);

  const pairingIds = useMemo(() => {
    if (!selectedNote) return [];
    return getPairingIds(selectedNote.id);
  }, [selectedNote]);

  const categories = Object.entries(NOTE_CATEGORIES);
  const radii = [120, 200, 280];
  const centerX = 300;
  const centerY = 300;

  const getNotePosition = (noteIndex, totalNotes, radius) => {
    const angle = (noteIndex / totalNotes) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      angle
    };
  };

  return (
    <div className="relative">
      <svg width="600" height="600" className="center">
        {categories.map(([key, category], catIndex) => {
          const radius = radii[catIndex];
          const notes = category.notes;
          
          return (
            <g key={key}>
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={hoveredCategory === key ? category.color : '#e0e0e0'}
                strokeWidth={hoveredCategory === key ? 4 : 2}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredCategory(key)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => onCategorySelect(key)}
              />
              
              {notes.map((note, noteIndex) => {
                const pos = getNotePosition(noteIndex, notes.length, radius);
                const isSelected = selectedNote?.id === note.id;
                const isPairing = pairingIds.includes(note.id);
                const isHovered = hoveredNote === note.id;
                
                let circleRadius = 14;
                let fillColor = 'white';
                let strokeWidth = 2;
                
                if (isSelected) {
                  circleRadius = 20;
                  fillColor = category.color;
                  strokeWidth = 3;
                } else if (isHovered) {
                  circleRadius = 18;
                  fillColor = category.color + '80';
                } else if (isPairing) {
                  circleRadius = 16;
                  fillColor = category.color + '40';
                  strokeWidth = 2.5;
                }
                
                return (
                  <g
                    key={note.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredNote(note.id)}
                    onMouseLeave={() => setHoveredNote(null)}
                    onClick={() => onNoteSelect({ ...note, categoryKey: key, category })}
                  >
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={pos.x}
                      y2={pos.y}
                      stroke={category.color}
                      strokeWidth={isSelected ? 2.5 : isPairing ? 1 : 0.5}
                      opacity={isSelected ? 1 : isPairing ? 0.6 : 0.3}
                    />
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={circleRadius}
                      fill={fillColor}
                      stroke={category.color}
                      strokeWidth={strokeWidth}
                      className="transition-all"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fontSize={isSelected ? 11 : isPairing || isHovered ? 9 : 8}
                      fill={isSelected ? 'white' : isPairing ? category.color : '#333'}
                      style={{ fontWeight: isSelected ? 'bold' : isPairing ? '600' : 'normal' }}
                    >
                      {note.name}
                    </text>
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={26}
                        fill="none"
                        stroke={category.color}
                        strokeWidth={1.5}
                        strokeDasharray="4,2"
                        opacity={0.6}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
        
        <circle cx={centerX} cy={centerY} r={40} fill="url(#gradient)" />
        <text x={centerX} y={centerY - 8} textAnchor="middle" fontSize={12} fill="white" fontWeight="bold">香调</text>
        <text x={centerX} y={centerY + 10} textAnchor="middle" fontSize={10} fill="white">轮盘</text>
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD93D" />
            <stop offset="50%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#6C5CE7" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute top-0 left-0 flex flex-column gap2">
        {categories.map(([key, category]) => (
          <div
            key={key}
            className={`pa2 br2 pointer transition-all ${hoveredCategory === key ? 'shadow-4' : ''}`}
            style={{ backgroundColor: category.color + '20', borderLeft: `4px solid ${category.color}` }}
            onMouseEnter={() => setHoveredCategory(key)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => onCategorySelect(key)}
          >
            <span className="b white-80">{category.name}</span>
          </div>
        ))}
        
        {selectedNote && (
          <div className="mt3 pa2 bg-white br2 shadow-1">
            <p className="f6 ma0 mb1 b gray">图例</p>
            <div className="flex items-center mb1">
              <div className="w2 h2 br-100 mr2" style={{ backgroundColor: selectedNote.category.color }}></div>
              <span className="f7">选中香调</span>
            </div>
            <div className="flex items-center">
              <div className="w2 h2 br-100 mr2" style={{ backgroundColor: selectedNote.category.color + '40', border: `2px solid ${selectedNote.category.color}` }}></div>
              <span className="f7">推荐搭配</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteWheel;
