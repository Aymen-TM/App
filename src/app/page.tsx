'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SearchBar from '@/components/SearchBar'
import VendorCard from '@/components/VendorCard'

export default function Home() {
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (filters: any) => {
    setIsSearching(true)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">
              Trouvez la voiture parfaite pour votre voyage
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Réservez en quelques clics parmi notre large sélection de véhicules
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mt-8">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Most Trusted and Popular Choice Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choix des Vendeurs les Plus Populaires</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Découvrez nos vendeurs les mieux notés et les plus fiables de la plateforme</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Vendor 1 */}
            <VendorCard
              name="Auto Premium"
              imageUrl="/vendors/auto-premium.jpg"
              verified={true}
              speciality="Voitures de luxe et premium"
            />
            
            {/* Vendor 2 */}
            <VendorCard
              name="Eco Location"
              imageUrl="/vendors/eco-location.jpg"
              verified={true}
              speciality="Véhicules économiques et écologiques"
            />
            
            {/* Vendor 3 */}
            <VendorCard
              name="Family Cars"
              imageUrl="/vendors/family-cars.jpg"
              verified={true}
              speciality="Véhicules familiaux spacieux"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Vendeurs Vérifiés</h3>
              <p className="text-gray-600">Tous nos vendeurs sont vérifiés et certifiés</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Prix Transparents</h3>
              <p className="text-gray-600">Pas de frais cachés, prix clairs et compétitifs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Service 24/7</h3>
              <p className="text-gray-600">Support client disponible à tout moment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}