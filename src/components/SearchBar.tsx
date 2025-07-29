'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Car, ChevronDown, Filter } from 'lucide-react'
import TagInput from './TagInput'

interface SearchFilters {
  location?: string
  startDate?: string
  endDate?: string
  marque?: string
  modele?: string
  yearMin?: string
  yearMax?: string
  type?: string[]
  options?: string[]
  vendors?: string[]
}

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void
}

// List of Algerian wilayas for the dropdown
const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra',
  'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret',
  'Tizi Ouzou', 'Algiers', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda',
  'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem',
  'MSila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arridj',
  'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
  'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal',
  'Béni Abbès', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair',
  'El Meniaa'
].sort()

// Car types and options
const CAR_TYPES = [
  'Berline', 'SUV', '4x4', 'Utilitaire', 'Minibus', 'Camion', 'Luxe', 'Sport'
].sort()

const CAR_OPTIONS = [
  'Climatisation', 'GPS', 'Boite automatique', 'Sieges bebe', 'Telephone mains libres',
  'Bluetooth', 'Regulateur de vitesse', 'Camera de recul', 'Detecteur d\'angle mort',
  'Toit ouvrant', 'Cuir', 'Système audio premium'
].sort()

export default function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter()
  // Basic filters
  const [location, setLocation] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')
  
  // New filters
  const [marque, setMarque] = useState('')
  const [modele, setModele] = useState('')
  const [anneeMin, setAnneeMin] = useState('')
  const [anneeMax, setAnneeMax] = useState('')
  const [type, setType] = useState('')
  const [options, setOptions] = useState<string[]>([])
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  
  // UI states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const filters: SearchFilters = {
      location: location || undefined,
      marque: marque || undefined,
      modele: modele || undefined,
      yearMin: anneeMin || undefined,
      yearMax: anneeMax || undefined,
      startDate: dateDebut || undefined,
      endDate: dateFin || undefined,
      type: type ? [type] : undefined,
      options: options.length > 0 ? options : undefined,
      vendors: selectedVendors.length > 0 ? selectedVendors : undefined
    }
    
    if (onSearch) {
      onSearch(filters)
    } else {
      // Fallback to default behavior if onSearch is not provided
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','))
        } else if (value) {
          params.set(key, value.toString())
        }
      })
      router.push(`/listings?${params.toString()}`)
    }
  }
  
  const toggleOption = (option: string) => {
    setOptions(prev => 
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Marque */}
          <div className="relative">
            <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Marque (ex: Renault)"
              value={marque}
              onChange={(e) => setMarque(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Modèle */}
          <div className="relative">
            <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 opacity-0" />
            <input
              type="text"
              placeholder="Modèle (ex: Clio)"
              value={modele}
              onChange={(e) => setModele(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Localisation (Wilaya) */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field pl-10 appearance-none"
            >
              <option value="">Toutes les wilayas</option>
              {WILAYAS.map(wilaya => (
                <option key={wilaya} value={wilaya}>{wilaya}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Filtres avancés */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center text-sm text-primary-600 hover:text-primary-800"
          >
            <Filter className="h-4 w-4 mr-1" />
            {showAdvancedFilters ? 'Masquer les filtres' : 'Plus de filtres'}
          </button>

          {showAdvancedFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Année Min */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année min
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={anneeMin}
                    onChange={(e) => setAnneeMin(e.target.value)}
                    placeholder="Année min"
                    className="input-field"
                  />
                </div>

                {/* Année Max */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Année max
                  </label>
                  <input
                    type="number"
                    min={anneeMin || '1900'}
                    max={new Date().getFullYear()}
                    value={anneeMax}
                    onChange={(e) => setAnneeMax(e.target.value)}
                    placeholder="Année max"
                    className="input-field"
                  />
                </div>

                {/* Type de voiture */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de voiture
                  </label>
                  <div className="relative">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="input-field appearance-none pr-8"
                    >
                      <option value="">Tous les types</option>
                      {CAR_TYPES.map(carType => (
                        <option key={carType} value={carType}>{carType}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Vendor Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendeurs
                </label>
                <TagInput
                  tags={selectedVendors}
                  suggestions={[]} // Removed vendors import, so pass an empty array for now
                  onAdd={(vendorId) => setSelectedVendors(prev => 
                    prev.includes(vendorId) ? prev : [...prev, vendorId]
                  )}
                  onRemove={(vendorId) => 
                    setSelectedVendors(prev => prev.filter(id => id !== vendorId))
                  }
                  placeholder="Rechercher un vendeur..."
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Options
                </label>
                <div className="flex flex-wrap gap-2">
                  {CAR_OPTIONS.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleOption(option)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        options.includes(option)
                          ? 'bg-primary-100 text-primary-800 border border-primary-200'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bouton de recherche */}
        <div className="pt-2">
          <button 
            type="submit" 
            className="btn-primary w-full py-3 text-lg font-medium flex items-center justify-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Rechercher
          </button>
        </div>
      </form>
    </div>
  )
}