'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, X, Filter, Loader2 } from 'lucide-react';
import TagInput from '@/components/TagInput';
import { useDebounce } from 'use-debounce';
import VoitureCard from '@/components/VoitureCard';
import { Cars } from '@/types';
import { fetchCars } from '@/lib/api';

export default function ListingsPage() {
  // All hooks must be called here, inside the function
  const [cars, setCars] = useState<Cars[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCars();
        setCars(data);
      } catch (e) {
        setCars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // List of available car types and options for filters
  const CAR_TYPES = [...new Set(cars.map((car: Cars) => car.type))].sort();
  const ALL_OPTIONS = Array.from(new Set(cars.flatMap((car: Cars) => car.options))).sort();
  const WILAYAS = [...new Set(cars.map((car: Cars) => car.location))].sort();

  // Categorize options
  const TECHNICAL_FEATURES = [
    '4x4',
    'ABS',
    'Airbags',
    'Direction assistée',
    'ESP',
    'Freinage d\'urgence autonome',
    'Système de navigation'
  ];

  const EQUIPMENT_FEATURES = [
    'Alarme',
    'Bluetooth',
    'Caméra de recul',
    'Climatisation',
    'Démarrage sans clé',
    'Feux LED',
    'GPS',
    'Jantes alliage',
    'Radar de recul',
    'Radio/CD',
    'Rétroviseurs électriques',
    'Sièges cuir',
    'Toit ouvrant',
    'Vitres électriques'
  ];

  // Filter options to only include those present in the data
  const ALL_TECHNICAL_FEATURES = TECHNICAL_FEATURES.filter(feature => 
    ALL_OPTIONS.some(option => option.toLowerCase() === feature.toLowerCase())
  );

  const ALL_EQUIPMENT_FEATURES = EQUIPMENT_FEATURES.filter(feature => 
    ALL_OPTIONS.some(option => option.toLowerCase() === feature.toLowerCase())
  );

  // State for filters
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [location, setLocation] = useState('');
  const [yearMin, setYearMin] = useState<string>('');
  const [yearMax, setYearMax] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);
  const [showAllTechnical, setShowAllTechnical] = useState(false);
  const [showAllEquipment, setShowAllEquipment] = useState(false);
  
  // Technical specifications filters
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [mileageRange, setMileageRange] = useState<[number, number]>([0, 200000]);
  
  // Debounced values for search inputs
  const [debouncedMarque] = useDebounce(marque, 1000);
  const [debouncedModele] = useDebounce(modele, 1000);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Apply filters from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    setMarque(params.get('marque') || '');
    setModele(params.get('modele') || '');
    setLocation(params.get('location') || '');
    setYearMin(params.get('yearMin') || '');
    setYearMax(params.get('yearMax') || '');
    setSelectedTypes(params.get('type')?.split(',').filter(Boolean) || []);
    setSelectedOptions(params.get('options')?.split(',').filter(Boolean) || []);
    setSelectedVendors(params.get('vendors')?.split(',').filter(Boolean) || []);
  }, [searchParams]);
  
  // Update URL with current filters
  const updateUrlFilters = useCallback(() => {
    setIsFiltering(true);
    const params = new URLSearchParams();
    
    if (marque) params.set('marque', marque);
    if (modele) params.set('modele', modele);
    if (location) params.set('location', location);
    if (yearMin) params.set('yearMin', yearMin);
    if (yearMax) params.set('yearMax', yearMax);
    if (selectedTypes.length > 0) params.set('type', selectedTypes.join(','));
    if (selectedOptions.length > 0) params.set('options', selectedOptions.join(','));
    if (selectedVendors.length > 0) params.set('vendors', selectedVendors.join(','));
    
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    // Use replace instead of push to avoid adding to browser history for each filter change
    router.replace(newUrl, { scroll: false });
    
    // Small delay to ensure smooth UI update
    setTimeout(() => setIsFiltering(false), 500);
  }, [marque, modele, location, yearMin, yearMax, selectedTypes, selectedOptions, selectedVendors, pathname, router]);
  
  // Update URL when debounced values change
  useEffect(() => {
    updateUrlFilters();
  }, [debouncedMarque, debouncedModele, location, yearMin, yearMax, selectedTypes, selectedOptions, selectedVendors, updateUrlFilters]);
  
  // Filter cars based on selected filters
  const filteredCars = useMemo(() => {
    setIsFiltering(true);
    const result = cars.filter((car: Cars) => {
      try {
        // Filter by marque (case insensitive)
        if (marque && typeof marque === 'string' && 
            car.marque && typeof car.marque === 'string' && 
            !car.marque.toLowerCase().includes(marque.toLowerCase())) {
          return false;
        }
        
        // Filter by modele (case insensitive)
        if (modele && typeof modele === 'string' && 
            car.modele && typeof car.modele === 'string' && 
            !car.modele.toLowerCase().includes(modele.toLowerCase())) {
          return false;
        }
        
        // Filter by location
        if (location && car.location !== location) {
          return false;
        }
        
        // Filter by year range
        const minYear = yearMin ? parseInt(yearMin, 10) : 0;
        const maxYear = yearMax ? parseInt(yearMax, 10) : Number.MAX_SAFE_INTEGER;
        
        if (isNaN(minYear) || isNaN(maxYear) || 
            typeof car.annee !== 'number' || 
            car.annee < minYear || 
            car.annee > maxYear) {
          return false;
        }
        
        // Filter by car type
        if (selectedTypes.length > 0 && car.type && !selectedTypes.includes(car.type)) {
          return false;
        }
        
        // Filter by options (all selected options must be present in car.options)
        if (selectedOptions.length > 0 && Array.isArray(car.options)) {
          if (!selectedOptions.every(option => 
            typeof option === 'string' && car.options?.includes(option))) {
            return false;
          }
        }
        
        // Filter by vendor
        if (selectedVendors.length > 0 && car.vendorId && !selectedVendors.includes(car.vendorId)) {
          return false;
        }
        
        // Filter by fuel type
        if (selectedFuels.length > 0 && car.carburant && !selectedFuels.includes(car.carburant)) {
          return false;
        }
        
        // Filter by transmission
        if (selectedTransmissions.length > 0 && car.transmission && 
            !selectedTransmissions.includes(car.transmission)) {
          return false;
        }
        
        // Filter by number of seats
        if (selectedSeats.length > 0 && car.places) {
          // For 8+ seats, check if places is 8 or more
          const hasMatchingSeats = selectedSeats.some(seats => 
            seats === 8 ? car.places >= 8 : car.places === seats
          );
          if (!hasMatchingSeats) {
            return false;
          }
        }
        
        return true;
      } catch (error) {
        console.error('Error filtering cars:', error);
        return false;
      }
    });
    
    // Small delay to show loading state for better UX
    setTimeout(() => setIsFiltering(false), 100);
    return result;
  }, [cars, marque, modele, location, yearMin, yearMax, selectedTypes, selectedOptions, selectedVendors, selectedFuels, selectedTransmissions, selectedSeats, mileageRange]);
  
  // Handle filter changes (no longer needed with debounced updates)
  const handleFilterChange = useCallback(() => {
    // No-op as we're using debounced updates
  }, []);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    setMarque('');
    setModele('');
    setLocation('');
    setYearMin('');
    setYearMax('');
    setSelectedTypes([]);
    setSelectedOptions([]);
    setSelectedVendors([]);
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);
  
  // Toggle car type selection with memoization
  const toggleType = useCallback((type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }, []);
  
  // Handle adding a vendor tag
  const handleAddVendor = useCallback((vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) ? prev : [...prev, vendorId]
    );
  }, []);
  
  // Handle removing a vendor tag
  const handleRemoveVendor = useCallback((vendorId: string) => {
    setSelectedVendors(prev => prev.filter(id => id !== vendorId));
  }, []);
  
  // Toggle option selection with memoization
  const toggleOption = useCallback((option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option)
        ? prev.filter(opt => opt !== option)
        : [...prev, option]
    );
  }, []);
  
  // Check if any filter is active
  const hasActiveFilters = 
    marque !== '' || 
    modele !== '' || 
    location !== '' || 
    yearMin !== '' || 
    yearMax !== '' || 
    selectedTypes.length > 0 || 
    selectedOptions.length > 0 || 
    selectedVendors.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Subtle loading indicator */}
        <div className={`fixed top-4 right-4 z-50 transition-opacity duration-300 ${isFiltering ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="bg-white p-2 rounded-full shadow-md flex items-center space-x-2 border border-gray-200">
            <Loader2 className="h-4 w-4 text-primary-600 animate-spin" />
            <span className="text-sm font-medium text-gray-700">Mise à jour...</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filtres</h2>
                {hasActiveFilters && (
                  <button 
                    onClick={resetFilters}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {/* Marque Filter */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-all duration-200 group-focus-within:text-primary-600">Marque</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={marque}
                      onChange={(e) => setMarque(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                      placeholder="Ex: Renault"
                    />
                  </div>
                </div>
                
                {/* Modèle Filter */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-all duration-200 group-focus-within:text-primary-600">Modèle</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={modele}
                      onChange={(e) => setModele(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                      placeholder="Ex: Clio 5"
                    />
                  </div>
                </div>
                
                {/* Location Filter */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-all duration-200 group-focus-within:text-primary-600">Wilaya</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <select
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        handleFilterChange();
                      }}
                      className="appearance-none w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                    >
                      <option value="">Toutes les wilayas</option>
                      {WILAYAS.map(wilaya => (
                        <option key={wilaya} value={wilaya}>
                          {wilaya}
                        </option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Year Range Filter */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Année</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">De</span>
                      <input
                        type="number"
                        value={yearMin}
                        onChange={(e) => setYearMin(e.target.value)}
                        onBlur={handleFilterChange}
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                      />
                    </div>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">À</span>
                      <input
                        type="number"
                        value={yearMax}
                        onChange={(e) => setYearMax(e.target.value)}
                        onBlur={handleFilterChange}
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Technical Specifications Section */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Caractéristiques techniques</h3>
                  
                  {/* Fuel Type Filter */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Carburant</h4>
                      {selectedFuels.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedFuels([]);
                            handleFilterChange();
                          }}
                          className="text-xs text-primary-600 hover:text-primary-800"
                        >
                          Tout effacer
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {['Essence', 'Diesel', 'Hybride', 'Electrique'].map((fuel) => (
                        <div key={fuel} className="flex items-center">
                          <input
                            id={`fuel-${fuel}`}
                            type="checkbox"
                            checked={selectedFuels.includes(fuel)}
                            onChange={() => {
                              setSelectedFuels(prev => 
                                prev.includes(fuel)
                                  ? prev.filter(f => f !== fuel)
                                  : [...prev, fuel]
                              );
                              handleFilterChange();
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <label htmlFor={`fuel-${fuel}`} className="ml-2 text-sm text-gray-700">
                            {fuel}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Transmission Filter */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Transmission</h4>
                      {selectedTransmissions.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedTransmissions([]);
                            handleFilterChange();
                          }}
                          className="text-xs text-primary-600 hover:text-primary-800"
                        >
                          Tout effacer
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {['Manuelle', 'Automatique'].map((transmission) => (
                        <div key={transmission} className="flex items-center">
                          <input
                            id={`transmission-${transmission}`}
                            type="checkbox"
                            checked={selectedTransmissions.includes(transmission)}
                            onChange={() => {
                              setSelectedTransmissions(prev => 
                                prev.includes(transmission)
                                  ? prev.filter(t => t !== transmission)
                                  : [...prev, transmission]
                              );
                              handleFilterChange();
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <label htmlFor={`transmission-${transmission}`} className="ml-2 text-sm text-gray-700">
                            {transmission}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Number of Seats Filter */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Nombre de places</h4>
                      {selectedSeats.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedSeats([]);
                            handleFilterChange();
                          }}
                          className="text-xs text-primary-600 hover:text-primary-800"
                        >
                          Tout effacer
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[2, 4, 5, 7, 8].map((seats) => (
                        <div key={seats} className="flex items-center">
                          <input
                            id={`seats-${seats}`}
                            type="checkbox"
                            checked={selectedSeats.includes(seats)}
                            onChange={() => {
                              setSelectedSeats(prev => 
                                prev.includes(seats)
                                  ? prev.filter(s => s !== seats)
                                  : [...prev, seats]
                              );
                              handleFilterChange();
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <label htmlFor={`seats-${seats}`} className="ml-2 text-sm text-gray-700">
                            {seats} {seats === 8 ? '+ places' : 'places'}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Mileage Range Filter */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Kilométrage (km)</h4>
                    <div className="px-2">
                      <div className="relative h-1 bg-gray-200 rounded-full mb-6">
                        <div 
                          className="absolute h-full bg-primary-600 rounded-full"
                          style={{ 
                            left: `${(mileageRange[0] / 200000) * 100}%`, 
                            right: `${100 - (mileageRange[1] / 200000) * 100}%` 
                          }}
                        ></div>
                        <input
                          type="range"
                          min="0"
                          max="200000"
                          step="1000"
                          value={mileageRange[0]}
                          onChange={(e) => {
                            const value = Math.min(Number(e.target.value), mileageRange[1] - 1000);
                            setMileageRange([value, mileageRange[1]]);
                            handleFilterChange();
                          }}
                          className="absolute w-full h-1 opacity-0 cursor-pointer"
                        />
                        <input
                          type="range"
                          min="0"
                          max="200000"
                          step="1000"
                          value={mileageRange[1]}
                          onChange={(e) => {
                            const value = Math.max(Number(e.target.value), mileageRange[0] + 1000);
                            setMileageRange([mileageRange[0], value]);
                            handleFilterChange();
                          }}
                          className="absolute w-full h-1 opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{mileageRange[0].toLocaleString()} km</span>
                        <span>{mileageRange[1].toLocaleString()} km</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Vehicle Type Filter */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Type de véhicule</h3>
                    {selectedTypes.length > 0 && (
                      <button
                        onClick={() => {
                          setSelectedTypes([]);
                          handleFilterChange();
                        }}
                        className="text-xs text-primary-600 hover:text-primary-800"
                      >
                        Tout effacer
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {CAR_TYPES.slice(0, showAllTypes ? CAR_TYPES.length : 5).map(type => (
                      <div key={type} className="flex items-center">
                        <input
                          id={`type-${type}`}
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => {
                            toggleType(type);
                            handleFilterChange();
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label 
                          htmlFor={`type-${type}`} 
                          className="ml-2 text-sm text-gray-700 flex-1 truncate"
                          title={type}
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                    {CAR_TYPES.length > 5 && (
                      <button
                        onClick={() => setShowAllTypes(!showAllTypes)}
                        className="text-xs text-primary-600 hover:text-primary-800 mt-1 block w-full text-left"
                      >
                        {showAllTypes ? 'Voir moins' : `Voir plus (${CAR_TYPES.length - 5} autres)`}
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Vendor Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Vendeurs</h3>
                  <TagInput
                    tags={selectedVendors}
                    suggestions={[]} // Removed vendors prop
                    onAdd={(vendorId) => {
                      handleAddVendor(vendorId);
                      handleFilterChange();
                    }}
                    onRemove={(vendorId) => {
                      handleRemoveVendor(vendorId);
                      handleFilterChange();
                    }}
                    placeholder="Rechercher un vendeur..."
                  />
                </div>
                
                {/* Technical Features Filter */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Caractéristiques techniques</h3>
                    {selectedOptions.some(opt => ALL_TECHNICAL_FEATURES.includes(opt)) && (
                      <button
                        onClick={() => {
                          const newSelected = selectedOptions.filter(opt => !ALL_TECHNICAL_FEATURES.includes(opt));
                          setSelectedOptions(newSelected);
                          handleFilterChange();
                        }}
                        className="text-xs text-primary-600 hover:text-primary-800"
                      >
                        Tout effacer
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {ALL_TECHNICAL_FEATURES.slice(0, showAllTechnical ? ALL_TECHNICAL_FEATURES.length : 5).map(option => (
                      <div key={option} className="flex items-center">
                        <input
                          id={`tech-${option}`}
                          type="checkbox"
                          checked={selectedOptions.includes(option)}
                          onChange={() => {
                            toggleOption(option);
                            handleFilterChange();
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label 
                          htmlFor={`tech-${option}`}
                          className="ml-2 text-sm text-gray-700 flex-1 truncate"
                          title={option}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                    {ALL_TECHNICAL_FEATURES.length > 5 && (
                      <button
                        onClick={() => setShowAllTechnical(!showAllTechnical)}
                        className="text-xs text-primary-600 hover:text-primary-800 mt-1 block w-full text-left"
                      >
                        {showAllTechnical ? 'Voir moins' : `Voir plus (${ALL_TECHNICAL_FEATURES.length - 5} autres)`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Equipment Features Filter */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700">Options et équipements</h3>
                    {selectedOptions.some(opt => ALL_EQUIPMENT_FEATURES.includes(opt)) && (
                      <button
                        onClick={() => {
                          const newSelected = selectedOptions.filter(opt => !ALL_EQUIPMENT_FEATURES.includes(opt));
                          setSelectedOptions(newSelected);
                          handleFilterChange();
                        }}
                        className="text-xs text-primary-600 hover:text-primary-800"
                      >
                        Tout effacer
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {ALL_EQUIPMENT_FEATURES.slice(0, showAllEquipment ? ALL_EQUIPMENT_FEATURES.length : 5).map(option => (
                      <div key={option} className="flex items-center">
                        <input
                          id={`equip-${option}`}
                          type="checkbox"
                          checked={selectedOptions.includes(option)}
                          onChange={() => {
                            toggleOption(option);
                            handleFilterChange();
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label 
                          htmlFor={`equip-${option}`}
                          className="ml-2 text-sm text-gray-700 flex-1 truncate"
                          title={option}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                    {ALL_EQUIPMENT_FEATURES.length > 5 && (
                      <button
                        onClick={() => setShowAllEquipment(!showAllEquipment)}
                        className="text-xs text-primary-600 hover:text-primary-800 mt-1 block w-full text-left"
                      >
                        {showAllEquipment ? 'Voir moins' : `Voir plus (${ALL_EQUIPMENT_FEATURES.length - 5} autres)`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="md:hidden flex justify-end mb-4">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </button>
            </div>
            
            {/* Mobile Filters Panel */}
            {showMobileFilters && (
              <div className="md:hidden bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Filtres</h2>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Marque Filter */}
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-all duration-200 group-focus-within:text-primary-600">Marque</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={marque}
                        onChange={(e) => setMarque(e.target.value)}
                        onBlur={handleFilterChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                        placeholder="Ex: Renault"
                      />
                    </div>
                  </div>
                  
                  {/* Modèle Filter */}
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-all duration-200 group-focus-within:text-primary-600">Modèle</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={modele}
                        onChange={(e) => setModele(e.target.value)}
                        onBlur={handleFilterChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                        placeholder="Ex: Clio 5"
                      />
                    </div>
                  </div>
                  
                  {/* Location Filter */}
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 transition-all duration-200 group-focus-within:text-primary-600">Wilaya</label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <select
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          handleFilterChange();
                        }}
                        className="appearance-none w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                      >
                        <option value="">Toutes les wilayas</option>
                        {WILAYAS.map(wilaya => (
                          <option key={wilaya} value={wilaya}>
                            {wilaya}
                          </option>
                        ))}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Year Range Filter */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Année</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">De</span>
                        <input
                          type="number"
                          value={yearMin}
                          onChange={(e) => setYearMin(e.target.value)}
                          onBlur={handleFilterChange}
                          min="1900"
                          max={new Date().getFullYear()}
                          className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                        />
                      </div>
                      <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">À</span>
                        <input
                          type="number"
                          value={yearMax}
                          onChange={(e) => setYearMax(e.target.value)}
                          onBlur={handleFilterChange}
                          min="1900"
                          max={new Date().getFullYear()}
                          className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Car Types Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Type de véhicule</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {CAR_TYPES.map(type => (
                        <div key={type} className="flex items-center">
                          <input
                            id={`mobile-type-${type}`}
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => {
                              toggleType(type);
                              handleFilterChange();
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <label htmlFor={`mobile-type-${type}`} className="ml-2 text-sm text-gray-700">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Vendor Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Vendeurs</h3>
                    <TagInput
                      tags={selectedVendors}
                      suggestions={[]} // Removed vendors prop
                      onAdd={(vendorId) => {
                        handleAddVendor(vendorId);
                        handleFilterChange();
                      }}
                      onRemove={(vendorId) => {
                        handleRemoveVendor(vendorId);
                        handleFilterChange();
                      }}
                      placeholder="Rechercher un vendeur..."
                    />
                  </div>
                  
                  {/* Options Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Options</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {ALL_OPTIONS.map(option => (
                        <div key={option} className="flex items-center">
                          <input
                            id={`mobile-option-${option}`}
                            type="checkbox"
                            checked={selectedOptions.includes(option)}
                            onChange={() => {
                              toggleOption(option);
                              handleFilterChange();
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <label htmlFor={`mobile-option-${option}`} className="ml-2 text-sm text-gray-700">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Appliquer les filtres
                  </button>
                </div>
              </div>
            )}
            
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {filteredCars.length} véhicule{filteredCars.length !== 1 ? 's' : ''} trouvé{filteredCars.length !== 1 ? 's' : ''}
              </h1>
              
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
                  Trier par :
                </label>
                <select
                  id="sort"
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                  onChange={(e) => {
                    // Implement sorting logic here
                  }}
                >
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="year-desc">Plus récent</option>
                  <option value="year-asc">Plus ancien</option>
                </select>
              </div>
            </div>
            
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {marque && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Marque: {marque}
                    <button 
                      onClick={() => {
                        setMarque('');
                        handleFilterChange();
                      }}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary-300 hover:bg-primary-400"
                    >
                      <span className="sr-only">Supprimer</span>
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                )}
                
                {modele && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Modèle: {modele}
                    <button 
                      onClick={() => {
                        setModele('');
                        handleFilterChange();
                      }}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary-300 hover:bg-primary-400"
                    >
                      <span className="sr-only">Supprimer</span>
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                )}
                
                {location && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {location}
                    <button 
                      onClick={() => {
                        setLocation('');
                        handleFilterChange();
                      }}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary-300 hover:bg-primary-400"
                    >
                      <span className="sr-only">Supprimer</span>
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                )}
                
                {selectedTypes.map(type => (
                  <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {type}
                    <button 
                      onClick={() => {
                        setSelectedTypes(prev => prev.filter(t => t !== type));
                        handleFilterChange();
                      }}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary-300 hover:bg-primary-400"
                    >
                      <span className="sr-only">Supprimer</span>
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                
                {selectedOptions.map(option => (
                  <span key={option} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {option}
                    <button 
                      onClick={() => {
                        setSelectedOptions(prev => prev.filter(o => o !== option));
                        handleFilterChange();
                      }}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary-300 hover:bg-primary-400"
                    >
                      <span className="sr-only">Supprimer</span>
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
                

              </div>
            )}
            
            {/* Cars Grid */}
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <VoitureCard
                    key={car.id}
                    id={car.id.toString()}
                    marque={car.marque}
                    modele={car.modele}
                    annee={car.annee}
                    prix={car.prix}
                    ville={car.location}
                    image={car.image}
                    type={car.type}
                    options={car.options}
                    disponible={car.disponible}
                    vendorId={car.vendorId}
                    vendors={[]} // Removed vendors prop
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule trouvé</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
