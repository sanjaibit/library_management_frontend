import React from 'react';
import { FaBook, FaLink, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const LearningCentre = () => {
  return (
    <div className="min-h-screen ">
    
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-purple-900 mb-6">
            Welcome to the Learning Centre
          </h2>
          <p className="text-purple-800 mb-2 font-medium">
            The central support services of BITS
          </p>

          {/* Images Grid */}
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="relative group overflow-hidden rounded-xl shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80"
                alt="Library Building"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="relative group overflow-hidden rounded-xl shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80"
                alt="Students Studying"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-purple max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              The Learning Centre of our Institute stands as an epitome of intellectual excellence and knowledge dissemination. With an expansive collection of books, journals, and digital resources, it serves as the nerve centre of academic pursuits. The Learning Centre goes beyond traditional boundaries, playing a pivotal role in the process of promoting and disseminating a quest for information among the students and research scholars, and enabling the
              research and teaching community.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Apart from the conventional resources, the Learning Centre has an enviable collection of e-journals, e-books, databases, CD-ROMs, video cassettes, audio cassettes, faculty, researchers, and staff in all facets of their pursuit to shape, teach, create, and share knowledge and provides access to a wide array of information resources and services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The Learning Centre encourages innovation, capabilities in information technologies, fosters effective scholarship and unexpectedly promotes intellectual and personal growth, thereby enriching the academic excellence and research activities of the institute.
            </p>
          </div>
        </div>
      </div>

      {/* Library Hours */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400 to-yellow-500 transform rotate-45 translate-x-16 -translate-y-16"></div>
          <div className="relative p-8">
            <h3 className="text-2xl font-bold text-purple-900 mb-6 flex items-center gap-3">
              <FaBook className="text-amber-500" />
              LIBRARY HOURS
            </h3>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-3">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                <span><strong>Monday to Saturday:</strong> 8:30 am - 9 pm</span>
              </p>
              <p className="flex items-center gap-3">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                <span><strong>Sundays and Holidays:</strong> 8:30 am - 5 pm</span>
              </p>
            </div>
          </div>
        </div>
      </div>
{/* 
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-400 to-yellow-500 transform rotate-45 translate-x-16 translate-y-16"></div>
          <div className="relative p-8">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">
              KOHA INTEGRATED LIBRARY SYSTEM (ILS)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              BITS is an Integrated Library System with all the facilities including Online Public Access Catalogue (OPAC) module which provides a simple and user-interface for library users to perform basic search operations on our library collection.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-purple-700 hover:text-amber-600 font-semibold transition-colors group"
            >
              <FaLink className="group-hover:rotate-12 transition-transform" />
              Library Online Public Access Catalogue (OPAC)
            </a>
            <p className="text-gray-600 text-sm mt-4">
              In case of any clarifications, contact Libraries through email to{' '}
              <a href="mailto:library@bits.ac.in" className="text-purple-700 hover:text-amber-600 font-medium">
                library@bits.ac.in
              </a>
            </p>
          </div>
        </div>
      </div>

     
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400 to-yellow-500 transform rotate-45 translate-x-16 -translate-y-16"></div>
          <div className="relative p-8">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">
              USEFUL LINKS
            </h3>
            <ul className="space-y-3">
              {[
                'NPTEL',
                'INFLIBNET (Govt. Libraries)',
                'National Digital Library',
                'Resource Archives',
                'DELNET',
                'IIT Shodhgram Magazine'
              ].map((link, index) => (
                <li key={index} className="group">
                  <a
                    href="#"
                    className="flex items-center gap-3 text-gray-700 hover:text-purple-700 transition-colors"
                  >
                    <span className="w-2 h-2 bg-purple-600 rounded-full group-hover:bg-amber-500 transition-colors"></span>
                    <span className="group-hover:translate-x-2 transition-transform">{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-amber-400 to-yellow-500 transform rotate-45 translate-x-16 translate-y-16"></div>
          <div className="relative p-8">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">
              E-JOURNALS SUBSCRIBED
            </h3>
            <ul className="space-y-3">
              {[
                'ASCE',
                'IEEE (ASPP) & IEL',
                'SPRINGER',
                'ELSEVIER(SCIENCE DIRECT)'
              ].map((journal, index) => (
                <li key={index} className="group">
                  <a
                    href="#"
                    className="flex items-center gap-3 text-gray-700 hover:text-purple-700 transition-colors"
                  >
                    <span className="w-2 h-2 bg-purple-600 rounded-full group-hover:bg-amber-500 transition-colors"></span>
                    <span className="group-hover:translate-x-2 transition-transform">{journal}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div> 
*/}

    </div>
  );
};

export default LearningCentre;