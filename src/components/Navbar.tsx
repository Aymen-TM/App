'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Car, User, FileText, Menu, X, Home, Car as CarIcon, PlusCircle, LogIn } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])
  
  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])
  
  const navLinks = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Nos véhicules', href: '/listings', icon: CarIcon },
    { name: 'Devenir Vendeur', href: '/demande-vendeur', icon: PlusCircle },
    { name: 'Espace Vendeur', href: '/dashboard-vendeur', icon: User },
  ]
  
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">AutoLoc</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.href) 
                    ? link.name === 'Espace Vendeur' 
                      ? 'bg-green-50 border border-green-500 text-green-700' 
                      : 'bg-primary-100 text-primary-700'
                    : link.name === 'Espace Vendeur'
                    ? 'border border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <link.icon className={`h-4 w-4 ${link.name === 'Espace Vendeur' ? 'text-green-600' : ''}`} />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-4 py-3 text-base font-medium ${
                  isActive(link.href)
                    ? link.name === 'Espace Vendeur'
                      ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
                      : 'bg-primary-50 border-l-4 border-primary-500 text-primary-700'
                    : link.name === 'Espace Vendeur'
                    ? 'text-green-600 hover:bg-green-50 hover:text-green-700 border-l-4 border-green-100'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <link.icon className={`h-5 w-5 ${link.name === 'Espace Vendeur' ? 'text-green-600' : ''}`} />
                <span>{link.name}</span>
              </Link>
            ))}
            <div className="px-4 py-3">
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}