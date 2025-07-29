'use client'

import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Vendor } from '@/types';

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
  carburant?: string
  transmission?: string
  places?: number
  puissance?: string
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
  vendors = [],
  carburant = '',
  transmission = '',
  places = 0,
  puissance = ''
}: VoitureCardProps) {
  const router = useRouter()

  // Handle tag click
  const handleTagClick = (e: React.MouseEvent, type: 'type' | 'option' | 'spec', value: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Only allow filtering by type and option tags, not spec tags
    if (type === 'spec') return
    
    const params = new URLSearchParams()
    params.set(type === 'type' ? 'type' : 'options', value)
    
    router.push(`/listings?${params.toString()}`)
  }

  // State for expanded tags
  const [expanded, setExpanded] = useState(false)
  
  // Get current URL search params to check for active filters
  const searchParams = useSearchParams()
  const activeType = searchParams?.get('type')
  const activeOptions = searchParams?.get('options')?.split(',') || []
  
  // Define tag type
  type TagType = 'type' | 'option' | 'spec'
  
  interface Tag {
    value: string
    type: TagType
    label?: string
  }
  
  // Separate active and inactive tags
  const activeTags: Tag[] = []
  const inactiveTags: Tag[] = []
  
  // Add type to active tags if it matches the filter
  if (type) {
    if (activeType === type) {
      activeTags.push({ value: type, type: 'type' as const })
    } else {
      inactiveTags.push({ value: type, type: 'type' as const })
    }
  }
  
  // Add options to active or inactive tags
  options?.forEach(option => {
    if (activeOptions.includes(option)) {
      activeTags.push({ value: option, type: 'option' as const })
    } else {
      inactiveTags.push({ value: option, type: 'option' as const })
    }
  })
  
  // Add technical specifications as tags
  const technicalSpecs = [
    { value: carburant, label: carburant, type: 'spec' as const },
    { value: transmission, label: transmission, type: 'spec' as const },
    { value: `places-${places}`, label: `${places} ${places === 1 ? 'place' : 'places'}`, type: 'spec' as const },
    { value: puissance, label: puissance, type: 'spec' as const }
  ].filter(spec => spec.value) as Tag[]
  
  // Add technical specs to inactive tags (they're not filterable)
  technicalSpecs.forEach(spec => {
    inactiveTags.push(spec)
  })
  
  // Determine visible tags based on expanded state
  // Show all active tags + some inactive ones
  const maxInitialTags = 3
  const allTags = [...activeTags, ...inactiveTags]
  const visibleActiveTags = activeTags
  const visibleInactiveTags = expanded 
    ? inactiveTags 
    : inactiveTags.slice(0, Math.max(0, maxInitialTags - activeTags.length))
  const visibleTags = [...visibleActiveTags, ...visibleInactiveTags]
  const hasMoreTags = allTags.length > visibleActiveTags.length + visibleInactiveTags.length

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
          <div className="space-y-2 mb-4">
            <div className="flex flex-wrap gap-2">
              {visibleTags.map((tag, index) => {
                const isActive = activeTags.some(t => t.value === tag.value && t.type === tag.type)
                const isSpec = tag.type === 'spec'
                
                return (
                  <button
                    key={`${tag.type}-${tag.value}-${index}`}
                    onClick={(e) => handleTagClick(e, tag.type, tag.value)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isActive
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : isSpec
                          ? 'bg-green-50 text-green-800 border border-green-100'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    title={isSpec ? 'Spécification technique' : ''}
                  >
                    {tag.label || tag.value}
                    {isSpec && (
                      <svg className="ml-1 w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                )
              })}
              {hasMoreTags && !expanded && (
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    setExpanded(true)
                  }}
                  className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full hover:bg-gray-100 transition-colors"
                >
                  +{allTags.length - maxInitialTags} plus
                </button>
              )}
              {expanded && (
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    setExpanded(false)
                  }}
                  className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full hover:bg-gray-100 transition-colors"
                >
                  Voir moins
                </button>
              )}
            </div>
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