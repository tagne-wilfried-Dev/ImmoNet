import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { type PropertySummary } from '@/lib/types/property.types';
import { useNavigate } from 'react-router-dom';
import { MapPin, Maximize2, BedDouble } from 'lucide-react';

// Correction des icônes par défaut de Leaflet (problème connu avec Vite/Webpack)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Création d'une icône personnalisée "Aqua Tech" (Cyan)
const aquaIcon = L.divIcon({
  className: 'custom-aqua-marker',
  html: `<div class="w-8 h-8 bg-cyan-500 rounded-full border-2 border-white shadow-lg shadow-cyan-500/50 flex items-center justify-center">
            <div class="w-2 h-2 bg-white rounded-full"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

interface PropertyMapProps {
  properties: PropertySummary[];
  center?: [number, number];
  zoom?: number;
}

// Composant pour recentrer la carte quand les propriétés changent
const RecenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  properties, 
  center = [4.0511, 9.7679], // Défaut sur Douala
  zoom = 13 
}) => {
  const navigate = useNavigate();

  // Filtrer les biens qui ont des coordonnées valides
  const validProperties = properties.filter(p => p.latitude && p.longitude);

  return (
    <div className="w-full h-full min-h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        {/* Tuiles Sombres (CartoDB Dark Matter) pour le style Aqua Tech */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {validProperties.map((property) => (
          <Marker 
            key={property.id} 
            position={[Number(property.latitude), Number(property.longitude)]}
            icon={aquaIcon}
          >
            <Popup className="aqua-popup">
              <div 
                className="w-64 bg-slate-900 text-white rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/property/${property.id}`)}
              >
                <div className="relative h-32">
                  <img 
                    src={property.urlPhotoPrincipale || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80'} 
                    alt={property.titre}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-cyan-600 px-2 py-1 rounded-lg text-[10px] font-bold">
                    {new Intl.NumberFormat('fr-FR').format(Number(property.prix))} FCFA
                  </div>
                </div>
                
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-sm line-clamp-1 group-hover:text-cyan-400 transition-colors">
                    {property.titre}
                  </h4>
                  
                  <div className="flex items-center gap-4 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Maximize2 className="w-3 h-3 text-cyan-500" />
                      {property.surface} m²
                    </div>
                    <div className="flex items-center gap-1">
                      <BedDouble className="w-3 h-3 text-cyan-500" />
                      {property.nbChambres || 0} p.
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-500" />
                      {property.ville}
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {validProperties.length > 0 && <RecenterMap center={[Number(validProperties[0].latitude), Number(validProperties[0].longitude)]} />}
      </MapContainer>

      {/* Overlay de style Aqua Tech */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-slate-950/20 rounded-3xl z-10" />
    </div>
  );
};

export default PropertyMap;
