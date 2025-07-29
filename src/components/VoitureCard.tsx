'use client'

import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Vendor } from '@/data/mockCars'

interface VoitureCardProps {
  id: string
  marque: string
  modele: string
  annee: number
  prix: number
  ville: string
  image: string
  disponible: boolean
  type?: string
  options?: string[]
  vendorId?: string
  vendors?: Vendor[]
}

export default function VoitureCard({
  id,
  marque,
  modele,
  annee,
  prix,
  ville,
  image,
  disponible,

  type,
  options = [],
  vendorId,
  vendors = []
}: VoitureCardProps) {
  const router = useRouter()

  // Handle tag click
  const handleTagClick = (e: React.MouseEvent, type: 'type' | 'option', value: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    const params = new URLSearchParams()
    params.set(type === 'type' ? 'type' : 'options', value)
    
    router.push(`/listings?${params.toString()}`)
  }

  // Display up to 2 options with a +X more indicator if there are more
  const visibleOptions = options?.slice(0, 2) || []
  const remainingOptions = Math.max(0, (options?.length || 0) - 2)

  return (
    <div className="card overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={image || '/placeholder-car.jpg'}
          alt={`${marque} ${modele}`}
          className="w-full h-full object-cover"
        />
        {!disponible && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <span className="text-white font-semibold bg-red-500 px-2 py-1 rounded">Indisponible</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {marque} {modele}
            </h3>
            <p className="text-gray-600">{annee}</p>
          </div>

        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm">{ville}</span>
        </div>
        
        {/* Vendor Info */}
        {vendorId && vendors.length > 0 && (
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <span>Vendeur: </span>
            <span className="font-medium text-gray-700 ml-1">
              {vendors.find(v => v.id === vendorId)?.name || 'Inconnu'}
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {type && (
            <Link 
              href={`/listings?type=${type}`}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
              onClick={(e) => handleTagClick(e, 'type', type)}
            >
              {type}
            </Link>
          )}
          {visibleOptions.map((option, index) => (
            <Link 
              key={index}
              href={`/listings?options=${option}`}
              className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full truncate"
              onClick={(e) => handleTagClick(e, 'option', option)}
              title={option}
            >
              {option}
            </Link>
          ))}
          {remainingOptions > 0 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{remainingOptions} plus
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary-600">{prix} DA</span>
            <span className="text-sm text-gray-600">/jour</span>
          </div>
          
          <div className="relative">
            <Link 
              href={`/voiture/${id}`}
              className={`btn-primary ${!disponible ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'}`}
              onClick={(e) => !disponible && e.preventDefault()}
            >
              Voir détails
            </Link>
            {!disponible && (
              <div className="absolute inset-0 bg-gray-200 bg-opacity-30 rounded-md" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 