'use client'

import { useState, useEffect } from 'react'
import AddCarModal from '@/components/AddCarModal'
import BookingDetailsModal, { BookingStatus } from '@/components/BookingDetailsModal'
import { Cars } from '@/types';
import { fetchCars, fetchBookings } from '@/lib/api';

interface Booking {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  dateDemande: string;
  voiture: string;
  prix: number;
  dateDebut: string;
  dateFin: string;
  message: string;
  statut: BookingStatus;
}
import { Users, Settings, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Tag, Car, Fuel, Settings as SettingsIcon } from 'lucide-react'

export default function DashboardVendeur() {
  const [activeTab, setActiveTab] = useState('voitures')
  const [voitures, setVoitures] = useState<Cars[]>([])
  const [demandes, setDemandes] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<Cars | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedCars = await fetchCars();
        setVoitures(fetchedCars);

        const fetchedBookings = await fetchBookings();
        setDemandes(fetchedBookings);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleDisponibilite = (id: number) => {
    setVoitures(prev => prev.map(voiture => 
      voiture.id === id 
        ? { ...voiture, disponible: !voiture.disponible }
        : voiture
    ))
  }

  const supprimerVoiture = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
      setVoitures(prev => prev.filter(voiture => voiture.id !== id))
    }
  }

  const ouvrirModalAjout = () => {
    setEditingCar(null)
    setIsModalOpen(true)
  }

  const ouvrirModalEdition = (voiture: Cars) => {
    setEditingCar(voiture)
    setIsModalOpen(true)
  }

  const handleCarSubmit = (carData: Cars) => {
    if (editingCar) {
      // Modification
      setVoitures(prev => prev.map(voiture => 
        voiture.id === editingCar.id 
          ? { ...carData, id: editingCar.id }
          : voiture
      ))
    } else {
      // Ajout
      setVoitures(prev => [...prev, carData])
    }
  }

  const changerStatutDemande = (id: string, nouveauStatut: string) => {
    setDemandes((prev: Array<{
      id: string;
      nom: string;
      email: string;
      telephone: string;
      dateDemande: string;
      voiture: string;
      prix: number;
      dateDebut: string;
      dateFin: string;
      message: string;
      statut: string;
    }>) => {
      const updatedDemandes = prev.map(demande => {
        if (demande.id === id) {
          // If the request is being approved, update the car's availability
          if (nouveauStatut === 'approuvee') {
            // Find the car by name (this is a simple match, in a real app you'd use an ID)
            setVoitures((prevVoitures: Cars[]) => 
              prevVoitures.map(voiture => 
                `${voiture.marque} ${voiture.modele}` === demande.voiture
                  ? { ...voiture, disponible: false }
                  : voiture
              )
            );
          }
          return { ...demande, statut: nouveauStatut };
        }
        return demande;
      });
      return updatedDemandes;
    });
  }

  const ouvrirModalDemande = (demande: any) => {
    setSelectedBooking(demande)
    setIsBookingModalOpen(true)
  }

  const handleStatusChange = (nouveauStatut: BookingStatus) => {
    if (selectedBooking) {
      changerStatutDemande(selectedBooking.id, nouveauStatut)
      setSelectedBooking(prev => ({
        ...prev,
        statut: nouveauStatut
      } as Booking))
    }
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'familiale': 'Familiale',
      'citadine': 'Citadine',
      'berline': 'Berline',
      'suv': 'SUV',
      'break': 'Break',
      'cabriolet': 'Cabriolet',
      'utilitaire': 'Utilitaire'
    }
    return types[type] || type
  }

  const getOptionLabel = (optionId: string) => {
    const options: Record<string, string> = {
      'climatisation': 'Climatisation',
      'gps': 'GPS',
      'bluetooth': 'Bluetooth',
      'radio': 'Radio/CD',
      'sieges_cuir': 'Sièges cuir',
      'toit_ouvrant': 'Toit ouvrant',
      'camera_recul': 'Caméra de recul',
      'radar_recul': 'Radar de recul',
      'abs': 'ABS',
      'esp': 'ESP',
      'airbags': 'Airbags',
      'alarme': 'Alarme',
      'direction_assistee': 'Direction assistée',
      'vitres_electriques': 'Vitres électriques',
      'retroviseurs_electriques': 'Rétroviseurs électriques',
      'demarrage_sans_cle': 'Démarrage sans clé',
      'feux_led': 'Feux LED',
      'jantes_alliage': 'Jantes alliage'
    }
    return options[optionId] || optionId
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de Bord Vendeur
          </h1>
          <p className="text-gray-600">
            Gérez vos voitures et suivez vos demandes de location
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-lg">
              <Car className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Voitures</p>
                <p className="text-2xl font-bold text-gray-900">{voitures.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Demandes</p>
                <p className="text-2xl font-bold text-gray-900">{demandes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {voitures.filter(v => v.disponible).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('voitures')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'voitures'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mes Voitures
              </button>
              <button
                onClick={() => setActiveTab('demandes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'demandes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Demandes Reçues
              </button>
            </nav>
          </div>
        </div>

        {/* Contenu des tabs */}
        {activeTab === 'voitures' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Mes Voitures</h2>
              <button 
                onClick={ouvrirModalAjout}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter une voiture</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {voitures.map((voiture) => (
                <div key={voiture.id} className="card overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={voiture.image || '/placeholder-car.jpg'}
                      alt={`${voiture.marque} ${voiture.modele}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {!voiture.disponible && (
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
                            {voiture.marque} {voiture.modele}
                          </h3>
                          <p className="text-gray-600 text-sm">{voiture.annee}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary-600">
                            {voiture.prix} DA
                          </p>
                          <p className="text-xs text-gray-500">/jour</p>
                        </div>
                      </div>

                      {/* Caractéristiques */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        {voiture.carburant && (
                          <div className="flex items-center space-x-1">
                            <Fuel className="h-4 w-4 text-gray-500" />
                            <span className="capitalize">{voiture.carburant}</span>
                          </div>
                        )}
                        {voiture.transmission && (
                          <div className="flex items-center space-x-1">
                            <SettingsIcon className="h-4 w-4 text-gray-500" />
                            <span className="capitalize">{voiture.transmission}</span>
                          </div>
                        )}
                        {voiture.places > 0 && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>{voiture.places} {voiture.places === 1 ? 'place' : 'places'}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {voiture.options && voiture.options.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <div className="flex flex-wrap gap-2">
                            {voiture.options.slice(0, 3).map((option: string, index: number) => (
                              <span 
                                key={`${option}-${index}`}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {getOptionLabel(option)}
                              </span>
                            ))}
                            {voiture.options.length > 3 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{voiture.options.length - 3} autres
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => toggleDisponibilite(voiture.id)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                          voiture.disponible
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {voiture.disponible ? 'Disponible' : 'Indisponible'}
                      </button>
                      <button 
                        onClick={() => ouvrirModalEdition(voiture)}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => supprimerVoiture(voiture.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'demandes' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Demandes Reçues</h2>
            
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Voiture
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {demandes.map((demande) => (
                      <tr key={demande.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {demande.nom}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{demande.email}</div>
                          <div className="text-sm text-gray-500">{demande.telephone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {demande.voiture}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {demande.dateDemande}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            demande.statut === 'approuvee'
                              ? 'bg-green-100 text-green-800'
                              : demande.statut === 'refusee'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {demande.statut === 'approuvee' ? 'Approuvée' :
                             demande.statut === 'refusee' ? 'Refusée' : 'En attente'}
                          </span>
                        </td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                           <div className="flex space-x-2">
                             <button 
                               onClick={() => ouvrirModalDemande(demande)}
                               className="text-primary-600 hover:text-primary-900"
                             >
                               <Eye className="h-4 w-4" />
                             </button>
                             {demande.statut === 'en_attente' && (
                               <>
                                 <button 
                                   onClick={() => changerStatutDemande(demande.id, 'approuvee')}
                                   className="text-green-600 hover:text-green-900"
                                 >
                                   <CheckCircle className="h-4 w-4" />
                                 </button>
                                 <button 
                                   onClick={() => changerStatutDemande(demande.id, 'refusee')}
                                   className="text-red-600 hover:text-red-900"
                                 >
                                   <XCircle className="h-4 w-4" />
                                 </button>
                               </>
                             )}
                           </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'ajout/modification de voiture */}
      <AddCarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCarSubmit}
        car={editingCar}
      />

      {/* Modal de détails de demande */}
      <BookingDetailsModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        booking={selectedBooking}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
} 