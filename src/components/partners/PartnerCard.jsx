import { useState } from 'react';
import { formatDistance, formatStudyTimes, formatProgrammingLevel } from '../../utils/locationUtils';
import Modal from '../common/Modal';

const PartnerCard = ({ partner }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Format WhatsApp number for link
  const whatsappLink = `https://wa.me/${partner.whatsapp.replace(/\D/g, '')}`;
  
  // Extract first name for greeting
  const firstName = partner.name.split(' ')[0];
  
  // Format level for display
  const level = formatProgrammingLevel(partner.level);
  
  // Format study times for display
  const studyTimes = formatStudyTimes(partner.studyTimes);
  
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <img
              src={partner.avatarUrl}
              alt={`Avatar de ${partner.name}`}
              className="h-14 w-14 rounded-full border-2 border-indigo-500"
            />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                {partner.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {level}
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <svg className="h-5 w-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {studyTimes}
            </div>
            
            {partner.distance !== undefined && (
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <svg className="h-5 w-5 text-indigo-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {formatDistance(partner.distance)}
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 h-10 overflow-hidden">
            {partner.about}
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setShowDetailsModal(true)}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ver Detalhes
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.267-.465-2.414-1.485-.893-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.134-.135.301-.345.451-.52.146-.174.194-.3.3-.5.099-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.221-.24-.6-.487-.51-.673-.51-.172 0-.372-.015-.572-.015-.2 0-.523.074-.797.365-.273.3-1.045 1.02-1.045 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.16 5.1 4.43.714.306 1.27.489 1.704.625.714.227 1.365.195 1.88.118.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885a9.865 9.865 0 017.021 2.91 9.788 9.788 0 012.909 6.99c-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
              </svg>
              Contato
            </a>
          </div>
        </div>
      </div>
      
      {/* Details Modal */}
      {showDetailsModal && (
        <Modal
          title={`Perfil de ${partner.name}`}
          onClose={() => setShowDetailsModal(false)}
        >
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src={partner.avatarUrl}
                alt={`Avatar de ${partner.name}`}
                className="h-20 w-20 rounded-full border-2 border-indigo-500"
              />
              <div className="ml-4">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  {partner.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {level}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sobre</h4>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {partner.about}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Horários de Estudo</h4>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {studyTimes}
                </p>
              </div>
              
              {partner.distance !== undefined && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Distância</h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {formatDistance(partner.distance)}
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.267-.465-2.414-1.485-.893-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.134-.135.301-.345.451-.52.146-.174.194-.3.3-.5.099-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.221-.24-.6-.487-.51-.673-.51-.172 0-.372-.015-.572-.015-.2 0-.523.074-.797.365-.273.3-1.045 1.02-1.045 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.16 5.1 4.43.714.306 1.27.489 1.704.625.714.227 1.365.195 1.88.118.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885a9.865 9.865 0 017.021 2.91 9.788 9.788 0 012.909 6.99c-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
                </svg>
                Entrar em contato com {firstName} pelo WhatsApp
              </a>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                Lembre-se: o contato deve ser apenas para fins de estudo e networking.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PartnerCard;