import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SwiperSlider = ({ banner }) => {
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="rounded-xl overflow-hidden shadow-lg"
      >
        {banner.map((item, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={item.image}
              alt={`Slide ${idx + 1}`}
              className="w-full 
                         h-45 sm:h-56 md:h-72 lg:h-80 xl:h-[350px] 
                         object-cover rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperSlider;
