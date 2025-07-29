'use client'

import { X, User, Mail, Phone, Calendar, Car, FileText } from 'lucide-react'

interface BookingDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  booking: any
  onStatusChange: (status: string) => void
}

export default function BookingDetailsModal({ 
  isOpen, 
  onClose, 
  booking, 
  onStatusChange 
}: BookingDetailsModalProps) {
  if (!isOpen || !booking) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approuvee':
        return 'bg-green-100 text-green-800'
      case 'refusee':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approuvee':
        return 'Approuvée'
      case 'refusee':
        return 'Refusée'
      default:
        return 'En attente'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Détails de la demande
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Statut */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Statut</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.statut)}`}>
              {getStatusLabel(booking.statut)}
            </span>
          </div>

          {/* Informations client */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Informations client
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <p className="text-gray-900">{booking.nom}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${booking.email}`} className="text-primary-600 hover:text-primary-800">
                    {booking.email}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${booking.telephone}`} className="text-primary-600 hover:text-primary-800">
                    {booking.telephone}
                  </a>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de demande
                </label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{booking.dateDemande}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations voiture */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Voiture demandée
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-lg font-medium text-gray-900">{booking.voiture}</p>
              {booking.prix && (
                <p className="text-primary-600 font-semibold mt-1">
                  {booking.prix} DA/jour
                </p>
              )}
            </div>
          </div>

          {/* Période de location */}
          {booking.dateDebut && booking.dateFin && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Période de location
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début
                  </label>
                  <p className="text-gray-900">{booking.dateDebut}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <p className="text-gray-900">{booking.dateFin}</p>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {booking.message && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Message du client
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{booking.message}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {booking.statut === 'en_attente' && (
            <div className="flex space-x-4 pt-6 border-t">
              <button
                onClick={() => onStatusChange('approuvee')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Approuver
              </button>
              <button
                onClick={() => onStatusChange('refusee')}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Refuser
              </button>
            </div>
          )}

          {/* Actions secondaires */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                // Ici on pourrait ouvrir un modal de contact ou envoyer un email
                window.open(`mailto:${booking.email}?subject=Demande de réservation - ${booking.voiture}`)
              }}
              className="btn-primary"
            >
              Contacter le client
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 