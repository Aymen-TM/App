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
    <div className="card overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={image || '/placeholder-car.jpg'}
          alt={`${marque} ${modele}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {!disponible && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
            <span className="text-white font-semibold bg-red-600 px-3 py-1.5 rounded-md text-sm">Indisponible</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {marque} {modele}
              </h3>
              <p className="text-gray-600 text-sm">{annee}</p>
            </div>
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1.5 text-gray-500 flex-shrink-0" />
            <span>{ville}</span>
          </div>
          
          {/* Vendor Info */}
          {vendorId && vendors.length > 0 && (
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span className="text-gray-600">Vendeur: </span>
              <span className="font-medium text-gray-800 ml-1">
                {vendors.find(v => v.id === vendorId)?.name || 'Inconnu'}
              </span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {type && (
              <Link 
                href={`/listings?type=${type}`}
                className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-100 transition-colors"
                onClick={(e) => handleTagClick(e, 'type', type)}
              >
                {type}
              </Link>
            )}
            {visibleOptions.map((option, index) => (
              <Link 
                key={index}
                href={`/listings?options=${option}`}
                className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-100 transition-colors truncate"
                onClick={(e) => handleTagClick(e, 'option', option)}
                title={option}
              >
                {option}
              </Link>
            ))}
            {remainingOptions > 0 && (
              <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full">
                +{remainingOptions} plus
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-primary-600">{prix.toLocaleString()}</span>
            <span className="text-sm text-gray-500 ml-1">DA/jour</span>
          </div>
          
          <div className="relative">
            <Link 
              href={`/voiture/${id}`}
              className={`inline-block px-4 py-2.5 bg-primary-600 text-white font-medium text-sm rounded-md transition-colors ${
                !disponible 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-primary-700'
              }`}
              onClick={(e) => !disponible && e.preventDefault()}
            >
              Voir détails
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 