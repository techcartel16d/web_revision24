import React, { useEffect, useState } from 'react'
import TestPackageCollection from '../components/savecollection/TestPackageCollection'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/free-mode'

import { FreeMode } from 'swiper/modules'

const MySavedCollectionPage = () => {
  const [selectedItems, setSelectedItems] = useState('')
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const SaveCollectionsItem = [
    "Save Packages",
    // "Save Videos",
    // "Save Articles",
    // "Save Notes",
    // "Save Tests",
  ]

  useEffect(() => {
    setSelectedItems(SaveCollectionsItem[0])
  }, [])

  return (
    <div>


      {/* <div className="p-4 border-b">
     
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          freeMode={true}
          breakpoints={{
            0: { slidesPerView: 1 },      // ✅ mobile & tablet
            1024: { slidesPerView: 5 }    // ✅ desktop
          }}
          modules={[FreeMode]}
        >
          {SaveCollectionsItem.map((item, index) => (
            <SwiperSlide className='py-3 px-3 ' onClick={() => setSelectedItems(item)} key={index}>
              <div className={`text-center rounded-xl py-2 px-2 shadow cursor-pointer ${selectedItems == item ? 'bg-blue-600 text-white' : 'bg-gray-100'} transition`}>
                <p className="text-xs sm:text-sm md:text-base lg:text-md font-normal">
                  {item}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

    
      </div> */}

      {
        selectedItems === "Save-Packages" ? (

          <TestPackageCollection />
        ) : (
          <div className="flex items-center justify-center h-screen">
            <h3>You haven't saved anything yet!</h3>
          </div>

        )
      }

    </div>
  )
}

export default MySavedCollectionPage
