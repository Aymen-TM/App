'use client'

import { useState } from 'react'
import AddCarModal from '@/components/AddCarModal'
import BookingDetailsModal, { BookingStatus } from '@/components/BookingDetailsModal'

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
import { Car, Users, Settings, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Tag, Fuel, Settings as SettingsIcon } from 'lucide-react'

// Données de test améliorées
const voituresTest = [
  {
    id: '1',
    marque: 'Renault',
    modele: 'Clio',
    annee: 2020,
    prix: 2500,
    disponible: true,
    image: '/placeholder-car.jpg',
    type: 'citadine',
    carburant: 'essence',
    transmission: 'manuelle',
    places: 5,
    kilometrage: '45000',
    description: 'Voiture économique et fiable, parfaite pour la ville',
    options: ['climatisation', 'gps', 'bluetooth', 'camera_recul', 'abs']
  },
  {
    id: '2',
    marque: 'Peugeot',
    modele: '208',
    annee: 2021,
    prix: 2800,
    disponible: false,
    image: '/placeholder-car.jpg',
    type: 'citadine',
    carburant: 'essence',
    transmission: 'automatique',
    places: 5,
    kilometrage: '32000',
    description: 'Voiture moderne avec toutes les options',
    options: ['climatisation', 'gps', 'bluetooth', 'camera_recul', 'radar_recul', 'sieges_cuir']
  },
  {
    id: '3',
    marque: 'Dacia',
    modele: 'Logan',
    annee: 2019,
    prix: 2000,
    disponible: true,
    image: '/placeholder-car.jpg',
    type: 'familiale',
    carburant: 'diesel',
    transmission: 'manuelle',
    places: 5,
    kilometrage: '78000',
    description: 'Voiture spacieuse et économique',
    options: ['climatisation', 'radio', 'abs', 'esp']
  }
]

const demandesTest = [
  {
    id: '1',
    nom: 'Ahmed Benali',
    email: 'ahmed@email.com',
    telephone: '+213 123 456 789',
    dateDemande: '2024-01-15',
    voiture: 'Renault Clio',
    prix: 2500,
    dateDebut: '2024-01-20',
    dateFin: '2024-01-25',
    message: 'Bonjour, je souhaite louer cette voiture pour un voyage d\'affaires. J\'ai un permis de conduire valide et je peux fournir tous les documents nécessaires.',
    statut: 'en_attente'
  },
  {
    id: '2',
    nom: 'Fatima Zohra',
    email: 'fatima@email.com',
    telephone: '+213 987 654 321',
    dateDemande: '2024-01-14',
    voiture: 'Peugeot 208',
    prix: 2800,
    dateDebut: '2024-01-18',
    dateFin: '2024-01-22',
    message: 'Salut ! J\'ai besoin d\'une voiture pour aller à Oran ce weekend. Cette voiture me semble parfaite.',
    statut: 'approuvee'
  },
  {
    id: '3',
    nom: 'Karim Boudiaf',
    email: 'karim@email.com',
    telephone: '+213 555 123 456',
    dateDemande: '2024-01-13',
    voiture: 'Dacia Logan',
    prix: 2000,
    dateDebut: '2024-01-25',
    dateFin: '2024-01-30',
    message: 'Je recherche une voiture familiale pour des vacances. Cette voiture correspond parfaitement à mes besoins.',
    statut: 'refusee'
  }
]

export default function DashboardVendeur() {
  const [activeTab, setActiveTab] = useState('voitures')
  const [voitures, setVoitures] = useState(voituresTest)
  const [demandes, setDemandes] = useState(demandesTest)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<any>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const toggleDisponibilite = (id: string) => {
    setVoitures(prev => prev.map(voiture => 
      voiture.id === id 
        ? { ...voiture, disponible: !voiture.disponible }
        : voiture
    ))
  }

  const supprimerVoiture = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
      setVoitures(prev => prev.filter(voiture => voiture.id !== id))
    }
  }

  const ouvrirModalAjout = () => {
    setEditingCar(null)
    setIsModalOpen(true)
  }

  const ouvrirModalEdition = (voiture: any) => {
    setEditingCar(voiture)
    setIsModalOpen(true)
  }

  const handleCarSubmit = (carData: any) => {
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
            setVoitures((prevVoitures: Array<{
              id: string;
              marque: string;
              modele: string;
              annee: number;
              prix: number;
              disponible: boolean;
              image: string;
              type: string;
              carburant: string;
              transmission: string;
              places: number;
              kilometrage: string;
              description: string;
              options: string[];
            }>) => 
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
                <div key={voiture.id} className="card overflow-hidden">
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={voiture.image}
                      alt={`${voiture.marque} ${voiture.modele}`}
                      className="w-full h-full object-cover"
                    />
                    {!voiture.disponible && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Indisponible</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                        {getTypeLabel(voiture.type)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {voiture.marque} {voiture.modele}
                        </h3>
                        <p className="text-gray-600">{voiture.annee}</p>
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
                      <div className="flex items-center space-x-1">
                        <Fuel className="h-4 w-4" />
                        <span className="capitalize">{voiture.carburant}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <SettingsIcon className="h-4 w-4" />
                        <span className="capitalize">{voiture.transmission}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{voiture.places} places</span>
                      </div>
                    </div>

                    {/* Options principales */}
                    {voiture.options && voiture.options.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Options principales :</p>
                        <div className="flex flex-wrap gap-1">
                          {voiture.options.slice(0, 3).map((option: string) => (
                            <span key={option} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {getOptionLabel(option)}
                            </span>
                          ))}
                          {voiture.options.length > 3 && (
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              +{voiture.options.length - 3} autres
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
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
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => supprimerVoiture(voiture.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg"
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