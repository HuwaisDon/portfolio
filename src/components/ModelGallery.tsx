import React from 'react';
import { models } from './modelData';
import './ModelGallery.css';

interface Props {
  onSelect: (id: string) => void;
}

const ModelGallery: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="model-gallery">
      {models.map((m) => (
        <div key={m.id} className="model-row" onClick={() => onSelect(m.id)}>
          <div className="model-id">{m.id}</div>
          <div className="model-name">{m.name}</div>
        </div>
      ))}
    </div>
  );
};

export default ModelGallery;
