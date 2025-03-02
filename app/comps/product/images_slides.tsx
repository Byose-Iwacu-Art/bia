"use client";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
interface NProrps{
  image : string;
  images: string [];
}
const ProductGallery = ({image,images } : NProrps) => {
  const allImages = [image, ...images]; // Include main image in slideshow
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="album flex flex-col items-center">
      {/* Main Image Slideshow */}
      <Swiper
        modules={[Navigation, Autoplay, Thumbs]}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        loop={true}
        speed={1000}
        onSlideChange={(swiper) => setSelectedIndex(swiper.realIndex)} // Sync active image
        className="main-pic p-4 h-[60vh] my-3 w-full shadow-sm rounded-md bg-zinc-100 text-white"
      >
        {allImages.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-full flex justify-center items-center">
              <img src={src} alt={`Slide ${index}`} className="w-full h-full object-contain rounded-md" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails Row */}
      {allImages.length > 2 && (
      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        slidesPerView={5}
        spaceBetween={10}
        watchSlidesProgress
        className="w-[50vw] p-2 mt-4"
      >
        {allImages.map((src, index) => (
          <SwiperSlide key={index} onClick={() => setSelectedIndex(index)}>
            <div
              className={`w-full h-[15vh] p-1 rounded-md cursor-pointer ${
                selectedIndex === index ? "border-2 border-red-500" : "bg-zinc-100"
              }`}
            >
              <img src={src} alt={`Thumbnail ${index}`} className="w-full h-full object-cover rounded-md" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      )}
    </div>
  );
};

export default ProductGallery;
