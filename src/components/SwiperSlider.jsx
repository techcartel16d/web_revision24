import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const SwiperSlider = ({ banner }) => {
  // console.log("banner", banner)
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        // navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="rounded-xl overflow-hidden shadow-lg"
      >
        {
          banner.map((item, idx) => {
            return (
              <SwiperSlide key={idx}>
                <img
                  src={item.image}
                  alt="Slide 1"
                  className="w-full h-[350px] object-cover"
                />
              </SwiperSlide>
            )

          })
        }

      </Swiper>
    </div>
  );
};

export default SwiperSlider;
