import React from 'react';

const MapView = ({ units, selectedUnit, onUnitClick, onCalculateClick }) => {
  return (
    <>
      {/* Left side: map + header */}
      <div className="flex-1 space-y-6">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/company-logo.png"
            alt="HBFA Logo"
            className="mb-4 rounded-xl"
          />
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight text-center">
            Project Units Map
          </h1>
          <p className="mt-2 text-gray-600 text-center max-w-md">
            Click on a unit to see its details and calculate a mortgage payment.
          </p>
        </div>

        {/* Placeholder static map image w/ markers */}
        <div className="relative w-full aspect-video bg-gray-200 rounded-2xl shadow-inner border border-gray-300 overflow-hidden">
          <img
            src="https://placehold.co/1200x675/e2e8f0/0f172a?text=Subdivision+Map+Placeholder"
            alt="Subdivision Map"
            className="w-full h-full object-cover"
          />
          {units.map((unit) => (
            <div
              key={unit.unit_id}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                ${
                  selectedUnit && selectedUnit.unit_id === unit.unit_id
                    ? 'bg-sky-500 ring-4 ring-offset-2 ring-sky-500 z-10'
                    : 'bg-blue-500 hover:scale-125'
                }`}
              style={{ left: unit.map_x, top: unit.map_y }}
              onClick={() => onUnitClick(unit)}
            >
              <span className="text-white text-xs font-bold">
                {unit.plan_type.slice(-1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: unit details panel */}
      <div
        className={`flex-1 lg:flex-none lg:w-96 p-6 rounded-2xl bg-gray-50 shadow-2xl flex flex-col items-center justify-center space-y-6 transition-all duration-300 transform 
          ${selectedUnit ? 'opacity-100' : 'lg:opacity-0'}`}
      >
        {selectedUnit ? (
          <>
            <h3 className="text-lg font-semibold tracking-wide text-gray-800 uppercase text-center">
              Selected Unit Details
            </h3>
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 w-full text-center">
              <p className="text-lg font-bold text-gray-800">
                {selectedUnit.plan_type}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedUnit.address}
              </p>
              <img
                src={selectedUnit.floor_plan_image_url}
                alt={`Floor plan for ${selectedUnit.plan_type}`}
                className="mt-4 rounded-lg w-full h-auto object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://placehold.co/400x300/a0a0a0/ffffff?text=Image+Not+Found';
                }}
              />
            </div>
            <button
              onClick={onCalculateClick}
              className="w-full rounded-full py-3 px-6 bg-sky-600 text-white font-bold text-lg hover:bg-sky-700 transition-colors duration-200 shadow-lg"
            >
              Calculate My Payment!
            </button>
          </>
        ) : (
          <p className="text-center text-gray-600 text-sm">
            Select a unit on the map to see its details.
          </p>
        )}
      </div>
    </>
  );
};

export default MapView;
