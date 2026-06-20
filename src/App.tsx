import { useState } from 'react';
import TownNavDemo from './components/TownNavDemo';
import BuildingModal from './components/BuildingModal';
import ModelGallery from './components/ModelGallery';
import './App.css';

function App() {
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedModelId(id);
    setGalleryOpen(false);
  };

  return (
    <div className="app-container">
      <TownNavDemo />
      <button className="gallery-btn" onClick={() => setGalleryOpen(true)}>
        Model Gallery
      </button>
      {galleryOpen && <ModelGallery onSelect={handleSelect} />}
      <BuildingModal
        buildingId={selectedModelId}
        isOpen={!!selectedModelId}
        onClose={() => setSelectedModelId(null)}
      />
    </div>
  );
}

export default App;
