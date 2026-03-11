import { useScrollAnimation, useStaggerAnimation } from '../../../hooks/useScrollAnimation';

export default function Locations() {
  const locations = [
    {
      city: 'Accra',
      address: 'Darkuman Circle Station, Accra',
      phone: '+233 24 450 6301',
      email: 'accra@safinstitute.com',
      hours: 'Mon-Sat: 8:00 AM - 6:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.4!2d-0.2527!3d5.6200!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b8e5e5e5e5e5%3A0x0!2sDarkuman%20Circle%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1700000000001',
      image: 'https://readdy.ai/api/search-image?query=Modern%20educational%20building%20exterior%20in%20Accra%20Ghana%20near%20Darkuman%20Circle%2C%20contemporary%20architecture%20with%20glass%20windows%2C%20clean%20white%20facade%2C%20green%20landscaping%2C%20professional%20photography%2C%20bright%20daylight%2C%20welcoming%20entrance%2C%20urban%20setting&width=600&height=400&seq=location-accra-002&orientation=landscape',
    },
    {
      city: 'Kumasi',
      address: 'Behind Tech Police Station, Kumasi',
      phone: '+233 24 450 6301',
      email: 'kumasi@safinstitute.com',
      hours: 'Mon-Sat: 8:00 AM - 6:00 PM',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.5!2d-1.6163!3d6.6885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdb96e4e4e4e4e4e%3A0x0!2sTech%20Police%20Station%2C%20Kumasi%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1700000000002',
      image: 'https://readdy.ai/api/search-image?query=Modern%20educational%20center%20building%20in%20Kumasi%20Ghana%20near%20Tech%20Police%20Station%2C%20contemporary%20design%20with%20large%20windows%2C%20clean%20architecture%2C%20green%20surroundings%2C%20professional%20photography%2C%20natural%20daylight%2C%20inviting%20entrance%2C%20well-maintained%20exterior&width=600&height=400&seq=location-kumasi-002&orientation=landscape',
    },
  ];

  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: cardsRef, visibleItems } = useStaggerAnimation(locations.length);

  return (
    <section id="locations" className="py-24 bg-[#F6F9F3] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7F000]/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="inline-block bg-[#0F6B3E]/10 text-[#0F6B3E] px-4 py-2 rounded-full text-sm font-semibold mb-4 whitespace-nowrap">
            Our Locations
          </div>
          <h2 className="font-['Poppins'] text-4xl md:text-5xl font-bold text-[#1E1E1E] mb-4">
            Visit Us in <span className="text-[#0F6B3E]">Accra or Kumasi</span>
          </h2>
          <p className="text-lg text-[#1E1E1E]/70 max-w-2xl mx-auto">
            Choose the location that's most convenient for you. Both centers offer the same high-quality instruction and modern facilities.
          </p>
        </div>

        {/* Locations Grid */}
        <div
          ref={cardsRef as React.RefObject<HTMLDivElement>}
          className="grid lg:grid-cols-2 gap-12"
        >
          {locations.map((location, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Location Image */}
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={location.image}
                  alt={`SAF Institute ${location.city}`}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#0F6B3E] text-white px-4 py-2 rounded-full font-semibold whitespace-nowrap">
                  {location.city}
                </div>
              </div>

              {/* Location Details */}
              <div className="p-8">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F6F9F3] flex items-center justify-center flex-shrink-0">
                      <i className="ri-map-pin-line text-[#0F6B3E] text-xl"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-[#1E1E1E] mb-1">Address</div>
                      <div className="text-[#1E1E1E]/70">{location.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F6F9F3] flex items-center justify-center flex-shrink-0">
                      <i className="ri-phone-line text-[#0F6B3E] text-xl"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-[#1E1E1E] mb-1">Phone</div>
                      <a href={`tel:${location.phone}`} className="text-[#0F6B3E] hover:underline whitespace-nowrap">
                        {location.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F6F9F3] flex items-center justify-center flex-shrink-0">
                      <i className="ri-mail-line text-[#0F6B3E] text-xl"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-[#1E1E1E] mb-1">Email</div>
                      <a href={`mailto:${location.email}`} className="text-[#0F6B3E] hover:underline whitespace-nowrap">
                        {location.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F6F9F3] flex items-center justify-center flex-shrink-0">
                      <i className="ri-time-line text-[#0F6B3E] text-xl"></i>
                    </div>
                    <div>
                      <div className="font-semibold text-[#1E1E1E] mb-1">Hours</div>
                      <div className="text-[#1E1E1E]/70 whitespace-nowrap">{location.hours}</div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="rounded-2xl overflow-hidden h-64 mb-6">
                  <iframe
                    src={location.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${location.city} Location Map`}
                  ></iframe>
                </div>

                <a
                  href="#contact"
                  className="block w-full text-center bg-[#0F6B3E] text-white py-3 rounded-full font-semibold hover:bg-[#0d5a33] transition-colors duration-200 whitespace-nowrap cursor-pointer"
                >
                  Visit This Location
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
