'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MapPin, Phone, Mail, Car as CarIcon, Users, Fuel, Settings } from 'lucide-react'
import { mockCars, Car } from '@/data/mockCars'

// Vendeur par défaut pour les démos
const defaultSeller = {
  nom: 'Auto Premium Alger',
  telephone: '+213 123 456 789',
  email: 'contact@autopremium.dz',

}

export default function VoitureDetail() {
  // Hooks at the top level
  const router = useRouter()
  const params = useParams()
  const voitureId = params.id as string
  
  const [voiture, setVoiture] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    dateDebut: '',
    dateFin: '',
    message: ''
  })
  
  // Fetch car data based on ID
  useEffect(() => {
    const foundCar = mockCars.find(car => car.id.toString() === voitureId)
    if (foundCar) {
      setVoiture(foundCar)
    }
    setLoading(false)
  }, [voitureId])
  
  // Redirect to 404 if car not found
  useEffect(() => {
    if (!loading && !voiture) {
      router.push('/404')
    }
  }, [loading, voiture, router])
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="h-96 bg-gray-200 rounded-xl"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // If no car found, return null (will be redirected by useEffect)
  if (!voiture) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Demande de réservation:', formData)
    alert('Votre demande de réservation a été envoyée avec succès !')
  }

  // Format price with thousands separator
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }
  
  // Generate car characteristics
  const carCharacteristics = {
    carburant: voiture.carburant || 'Non spécifié',
    transmission: voiture.transmission || 'Non spécifiée',
    places: voiture.places || 0,
    climatisation: voiture.options?.includes('Climatisation') || false,
    gps: voiture.options?.includes('GPS') || false,
    bluetooth: voiture.options?.includes('Bluetooth') || false
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><a href="/" className="hover:text-primary-600">Accueil</a></li>
            <li>/</li>
            <li><a href="/listings" className="hover:text-primary-600">Voitures</a></li>
            <li>/</li>
            <li className="text-gray-900">{voiture.marque} {voiture.modele}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-8">
              <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden">
                <img
                  src={voiture.image || '/placeholder-car.jpg'}
                  alt={`${voiture.marque} ${voiture.modele}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-car.jpg';
                  }}
                />
                {!voiture.disponible && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">Indisponible</span>
                  </div>
                )}
              </div>
            </div>

            {/* Informations principales */}
            <div className="card p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {voiture.marque} {voiture.modele}
                  </h1>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {voiture.type && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {voiture.type}
                      </span>
                    )}
                    {voiture.options?.slice(0, 3).map((option, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full truncate max-w-[150px]"
                        title={option}
                      >
                        {option}
                      </span>
                    ))}
                    {voiture.options && voiture.options.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                        +{voiture.options.length - 3} plus
                      </span>
                    )}
                  </div>
                  <p className="text-xl text-gray-600 mb-2">{voiture.annee}</p>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{voiture.location || 'Non spécifiée'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    {formatPrice(voiture.prix)} DA
                  </div>
                  <div className="text-gray-600">par jour</div>
                  <div className="mt-2 text-right">
                    <span className="text-sm text-gray-600">
                      {voiture.disponible ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {voiture.description || 'Aucune description disponible pour ce véhicule.'}
                </p>
              </div>

              {/* Caractéristiques */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{carCharacteristics.carburant}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">{carCharacteristics.transmission}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {carCharacteristics.places} place{carCharacteristics.places > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CarIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {carCharacteristics.climatisation ? 'Climatisation' : 'Sans climatisation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations vendeur */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">À propos du vendeur</h3>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{defaultSeller.nom}</h4>

                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-1" />
                    <a href={`tel:${defaultSeller.telephone.replace(/\s/g, '')}`} className="hover:text-primary-600">
                      {defaultSeller.telephone}
                    </a>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-1" />
                    <a href={`mailto:${defaultSeller.email}`} className="hover:text-primary-600">
                      {defaultSeller.email}
                    </a>
                  </div>
                </div>
                <button className="btn-secondary">
                  Contacter le vendeur
                </button>
              </div>
            </div>
          </div>

          {/* Colonne de réservation */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Réserver cette voiture
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Votre nom complet"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="+213 XXX XXX XXX"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date début *
                    </label>
                    <input
                      type="date"
                      name="dateDebut"
                      value={formData.dateDebut}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date fin *
                    </label>
                    <input
                      type="date"
                      name="dateFin"
                      value={formData.dateFin}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (optionnel)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="input-field"
                    placeholder="Informations supplémentaires..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!voiture.disponible}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {voiture.disponible ? 'Réserver maintenant' : 'Indisponible'}
                </button>
              </form>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Informations importantes</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Permis de conduire obligatoire</li>
                  <li>• Âge minimum : 21 ans</li>
                  <li>• Carte d'identité requise</li>
                  <li>• Caution demandée</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 