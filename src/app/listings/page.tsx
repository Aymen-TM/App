'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, X, Filter, Loader2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import VoitureCard from '@/components/VoitureCard';
import { mockCars, Car } from '@/data/mockCars';

// List of available car types and options for filters
const CAR_TYPES = [...new Set(mockCars.map(car => car.type))].sort();
const ALL_OPTIONS = Array.from(new Set(mockCars.flatMap(car => car.options))).sort();
const WILAYAS = [...new Set(mockCars.map(car => car.location))].sort();

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State for filters
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [location, setLocation] = useState('');
  const [yearMin, setYearMin] = useState<string>('');
  const [yearMax, setYearMax] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Debounced values for search inputs
  const [debouncedMarque] = useDebounce(marque, 1000);
  const [debouncedModele] = useDebounce(modele, 1000);
  const [isFiltering, setIsFiltering] = useState(false);
  const pathname = usePathname();
  
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
    
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    
    // Use replace instead of push to avoid adding to browser history for each filter change
    router.replace(newUrl, { scroll: false });
    
    // Small delay to ensure smooth UI update
    setTimeout(() => setIsFiltering(false), 500);
  }, [marque, modele, location, yearMin, yearMax, selectedTypes, selectedOptions, pathname, router]);
  
  // Update URL when debounced values change
  useEffect(() => {
    updateUrlFilters();
  }, [debouncedMarque, debouncedModele, location, yearMin, yearMax, selectedTypes, selectedOptions, updateUrlFilters]);
  
  // Filter cars based on selected filters
  const filteredCars = useMemo(() => {
    setIsFiltering(true);
    const result = mockCars.filter((car: Car) => {
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
      
      return true;
    } catch (error) {
      console.error('Error filtering cars:', error);
      return false;
    }
    });
    
    // Small delay to show loading state for better UX
    setTimeout(() => setIsFiltering(false), 100);
    return result;
  }, [marque, modele, location, yearMin, yearMax, selectedTypes, selectedOptions]);
  
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
    selectedOptions.length > 0;

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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                  <input
                    type="text"
                    value={marque}
                    onChange={(e) => setMarque(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                    placeholder="Ex: Renault"
                  />
                </div>
                
                {/* Modèle Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                  <input
                    type="text"
                    value={modele}
                    onChange={(e) => setModele(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                    placeholder="Ex: Clio 5"
                  />
                </div>
                
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
                  <select
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                  >
                    <option value="">Toutes les wilayas</option>
                    {WILAYAS.map(wilaya => (
                      <option key={wilaya} value={wilaya}>
                        {wilaya}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Year Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={yearMin}
                      onChange={(e) => setYearMin(e.target.value)}
                      onBlur={handleFilterChange}
                      placeholder="Min"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                    />
                    <input
                      type="number"
                      value={yearMax}
                      onChange={(e) => setYearMax(e.target.value)}
                      onBlur={handleFilterChange}
                      placeholder="Max"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                    />
                  </div>
                </div>
                
                {/* Car Types Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Type de véhicule</h3>
                  <div className="space-y-2">
                    {CAR_TYPES.map(type => (
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
                        <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Options Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Options</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {ALL_OPTIONS.map(option => (
                      <div key={option} className="flex items-center">
                        <input
                          id={`option-${option}`}
                          type="checkbox"
                          checked={selectedOptions.includes(option)}
                          onChange={() => {
                            toggleOption(option);
                            handleFilterChange();
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor={`option-${option}`} className="ml-2 text-sm text-gray-700">
                          {option}
                        </label>
                      </div>
                    ))}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                    <input
                      type="text"
                      value={marque}
                      onChange={(e) => setMarque(e.target.value)}
                      onBlur={handleFilterChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                      placeholder="Ex: Renault"
                    />
                  </div>
                  
                  {/* Modèle Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                    <input
                      type="text"
                      value={modele}
                      onChange={(e) => setModele(e.target.value)}
                      onBlur={handleFilterChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                      placeholder="Ex: Clio 5"
                    />
                  </div>
                  
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
                    <select
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        handleFilterChange();
                      }}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                    >
                      <option value="">Toutes les wilayas</option>
                      {WILAYAS.map(wilaya => (
                        <option key={wilaya} value={wilaya}>
                          {wilaya}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Year Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={yearMin}
                        onChange={(e) => setYearMin(e.target.value)}
                        onBlur={handleFilterChange}
                        placeholder="Min"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                      />
                      <input
                        type="number"
                        value={yearMax}
                        onChange={(e) => setYearMax(e.target.value)}
                        onBlur={handleFilterChange}
                        placeholder="Max"
                        min="1900"
                        max={new Date().getFullYear()}
                        className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                      />
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
                  
                  {/* Options Filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Options</h3>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
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
