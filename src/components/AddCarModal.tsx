'use client'

import { useState } from 'react'
import { X, Upload, Car, Settings } from 'lucide-react'

interface CarOption {
  id: string
  name: string
  category: string
}

interface AddCarModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (carData: any) => void
  car?: any // Pour l'édition
}

const carTypes = [
  { value: 'familiale', label: 'Familiale' },
  { value: 'citadine', label: 'Citadine' },
  { value: 'berline', label: 'Berline' },
  { value: 'suv', label: 'SUV' },
  { value: 'break', label: 'Break' },
  { value: 'cabriolet', label: 'Cabriolet' },
  { value: 'utilitaire', label: 'Utilitaire' }
]

const availableOptions: CarOption[] = [
  // Confort
  { id: 'climatisation', name: 'Climatisation', category: 'Confort' },
  { id: 'gps', name: 'GPS', category: 'Confort' },
  { id: 'bluetooth', name: 'Bluetooth', category: 'Confort' },
  { id: 'radio', name: 'Radio/CD', category: 'Confort' },
  { id: 'sieges_cuir', name: 'Sièges cuir', category: 'Confort' },
  { id: 'toit_ouvrant', name: 'Toit ouvrant', category: 'Confort' },
  
  // Sécurité
  { id: 'camera_recul', name: 'Caméra de recul', category: 'Sécurité' },
  { id: 'radar_recul', name: 'Radar de recul', category: 'Sécurité' },
  { id: 'abs', name: 'ABS', category: 'Sécurité' },
  { id: 'esp', name: 'ESP', category: 'Sécurité' },
  { id: 'airbags', name: 'Airbags', category: 'Sécurité' },
  { id: 'alarme', name: 'Alarme', category: 'Sécurité' },
  
  // Technique
  { id: 'direction_assistee', name: 'Direction assistée', category: 'Technique' },
  { id: 'vitres_electriques', name: 'Vitres électriques', category: 'Technique' },
  { id: 'retroviseurs_electriques', name: 'Rétroviseurs électriques', category: 'Technique' },
  { id: 'demarrage_sans_cle', name: 'Démarrage sans clé', category: 'Technique' },
  { id: 'feux_led', name: 'Feux LED', category: 'Technique' },
  { id: 'jantes_alliage', name: 'Jantes alliage', category: 'Technique' }
]

export default function AddCarModal({ isOpen, onClose, onSubmit, car }: AddCarModalProps) {
  const [formData, setFormData] = useState({
    marque: car?.marque || '',
    modele: car?.modele || '',
    annee: car?.annee || '',
    prix: car?.prix || '',
    ville: car?.ville || '',
    type: car?.type || 'citadine',
    carburant: car?.carburant || 'essence',
    transmission: car?.transmission || 'manuelle',
    places: car?.places || 5,
    kilometrage: car?.kilometrage || '',
    description: car?.description || '',
    disponible: car?.disponible ?? true
  })

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    car?.options || []
  )

  const [images, setImages] = useState<File[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const carData = {
      ...formData,
      options: selectedOptions,
      images: images,
      id: car?.id || Date.now().toString()
    }
    onSubmit(carData)
    onClose()
  }

  const groupedOptions = availableOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = []
    }
    acc[option.category].push(option)
    return acc
  }, {} as Record<string, CarOption[]>)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {car ? 'Modifier la voiture' : 'Ajouter une voiture'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations de base */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Informations de base
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque *
                </label>
                <input
                  type="text"
                  name="marque"
                  value={formData.marque}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Ex: Renault"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle *
                </label>
                <input
                  type="text"
                  name="modele"
                  value={formData.modele}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Ex: Clio"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année *
                </label>
                <input
                  type="number"
                  name="annee"
                  value={formData.annee}
                  onChange={handleInputChange}
                  required
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix par jour (DA) *
                </label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Ex: Alger"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de voiture *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  {carTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Caractéristiques techniques */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Caractéristiques techniques
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carburant
                </label>
                <select
                  name="carburant"
                  value={formData.carburant}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="essence">Essence</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybride">Hybride</option>
                  <option value="electrique">Électrique</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="manuelle">Manuelle</option>
                  <option value="automatique">Automatique</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de places
                </label>
                <select
                  name="places"
                  value={formData.places}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value={2}>2 places</option>
                  <option value={4}>4 places</option>
                  <option value={5}>5 places</option>
                  <option value={7}>7 places</option>
                  <option value={8}>8+ places</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilométrage
                </label>
                <input
                  type="number"
                  name="kilometrage"
                  value={formData.kilometrage}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Ex: 50000"
                />
              </div>
            </div>
          </div>

          {/* Options et équipements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Options et équipements
            </h3>
            
            <div className="space-y-4">
              {Object.entries(groupedOptions).map(([category, options]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {options.map(option => (
                      <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedOptions.includes(option.id)}
                          onChange={() => handleOptionToggle(option.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{option.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Photos de la voiture
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="car-images"
              />
              <label htmlFor="car-images" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Cliquez pour ajouter des photos (max 5 images)
                </p>
              </label>
            </div>
            
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {images.length} image(s) sélectionnée(s)
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="input-field"
              placeholder="Décrivez votre voiture, ses avantages, conditions de location..."
            />
          </div>

          {/* Statut */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.disponible}
                onChange={(e) => setFormData(prev => ({ ...prev, disponible: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Voiture disponible à la location
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {car ? 'Modifier la voiture' : 'Ajouter la voiture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 