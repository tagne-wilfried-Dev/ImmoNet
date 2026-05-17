import { ChevronDown, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Logo from '../../assets/micone.svg'
import './header.css'

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="shrink-0">
            <div className="flex items-center">
              <div className="w-11 h-11 bg-teal-500 rounded-lg mr-2">
                <img src={Logo} alt="ImmoNetlogo" className='w-10' />
              </div>
              <span className='text-3xl font-stretch-50% font-extrabold slide-in-from-end-translate-full'>Immo</span>
              <span className=" logf text-3xl font-bold text-teal-500">Net</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="pl-10 text-gray-700 hover:rounded-b-lg hover:bg-gray-200 p-1.5 hover:text-teal-500 transition text-sm font-medium">
              Acheter
            </a>
            <a href="#" className="text-gray-700 hover:rounded-b-lg hover:bg-gray-200 p-1.5 hover:text-teal-500 transition text-sm font-medium">
              Vendre
            </a>
            <a href="#" className="text-gray-700 hover:rounded-b-lg hover:bg-gray-200 p-1.5 hover:text-teal-500 transition text-sm font-medium">
              Louer
            </a>
            <a href="#" className="text-gray-700 hover:rounded-b-lg hover:bg-gray-200 p-1.5 hover:text-teal-500 transition text-sm font-medium">
              Estimer
            </a>
            <a href="#" className="text-gray-700 hover:rounded-b-lg hover:bg-gray-200 p-1.5 hover:text-teal-500 transition text-sm font-medium">
              Trouver un conseiller
            </a>
            <a href="#" className="text-gray-700 hover:rounded-b-lg hover:bg-gray-200 p-1.5 hover:text-teal-500 transition text-sm font-medium">
              Favoris
            </a>

            {/* Dropdown Menu */}
            <div className="relative">
              <button
                onClick={
                  () => setIsDropdownOpen(!isDropdownOpen)
                }
                className= "flex items-center text-gray-900 hover:text-teal-500 transition font-serif text-md font-medium"
              >
                ImmoNet
                <ChevronDown size={16} className="ml-1" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-100 text-sm">
                    Nos services
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-100 text-sm">
                    A propos
                  </a>
                  <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-100 text-sm">
                    Nous Contacter
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Hamburger Menu Button */}
          <button 
            className="md:hidden text-gray-700 hover:text-teal-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* CTA Button */}
          <div className="hidden md:block shrink-0">
            <button
              type="button"
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium transition"
            >
              Ouvrir mon park immobilier
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200 w-screen -ml-4 sm:-ml-6 lg:-ml-8 pl-4 sm:pl-6 lg:pl-8">
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-100 hover:text-teal-500 transition text-sm font-medium">
              Acheter
            </a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-100 hover:text-teal-500 transition text-sm font-medium">
              Vendre
            </a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-100 hover:text-teal-500 transition text-sm font-medium">
              Louer
            </a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-100 hover:text-teal-500 transition text-sm font-medium">
              Estimer
            </a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-100 hover:text-teal-500 transition text-sm font-medium">
              Trouver un conseiller
            </a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-teal-100 hover:text-teal-500 transition text-sm font-medium">
              Favoris
            </a>
            
            {/* Mobile Dropdown */}
            <div className="border-t border-gray-200 mt-2">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-100 hover:text-teal-500 transition text-sm font-medium flex items-center justify-between"
              >
                ImmoNet
                <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="bg-gray-50">
                  <a href="#" className="block px-8 py-2 text-gray-700 hover:bg-teal-100 text-sm">
                    Nos services
                  </a>
                  <a href="#" className="block px-8 py-2 text-gray-700 hover:bg-teal-100 text-sm">
                    A propos
                  </a>
                  <a href="#" className="block px-8 py-2 text-gray-700 hover:bg-teal-100 text-sm">
                    Nous Contacter
                  </a>
                </div>
              )}
            </div>

            {/* Mobile CTA Button */}
            <div className="px-4 py-2 border-t border-gray-200 mt-2">
              <button
                type="button"
                className="w-full px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-sm font-medium transition"
              >
                Ouvrir mon park immobilier
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
