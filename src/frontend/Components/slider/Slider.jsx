import './slider.scss';
import { useEffect, useState } from 'react';
import { KeyboardArrowLeftIcon, KeyboardArrowRightIcon } from '../../assets/index';
import { noData } from '../../assets/index';
const Slider = ({ slides }) => {

    const [currentImageIndex, setCurrentImageIndex] = useState(0);



    

    const nextSlide = () => {
        if (slides.length === 0)
            return;
        const lastIndex = slides.length - 1;
        const shouldResetIndex = currentImageIndex === lastIndex;
        const index = shouldResetIndex ? 0 : currentImageIndex + 1;
        setCurrentImageIndex(index);
        
    }

    const prevSlide = () => {
        if (slides.length === 0)
            return;
        const lastIndex = slides.length - 1;
        const shouldResetIndex = currentImageIndex === 0;
        const index = shouldResetIndex ? lastIndex : currentImageIndex - 1;
    
        setCurrentImageIndex(index);
    }

   

    const moveToSlideWithIndex = (index) => {
        setCurrentImageIndex(index);
       
    }

    const highlightCurrentSlide = () => {
        const images = document.querySelectorAll('.slider__image_shows__item img');
        images.forEach((image, index) => {
            if (index === currentImageIndex) {
                image.classList.add('active');
            }
            else {
                image.classList.remove('active');
            }
        })
    }
    const updateIndicatorAnimation = () => {
        const indicator = document.querySelector('.slider__navigation__indicator');
        if (indicator) {
            indicator.style.animation = 'none'; // Disable the animation temporarily
            void indicator.offsetWidth; // Force reflow to reset the width
            indicator.style.animation = 'loading 5s ease-in-out forwards'; // Re-enable the animation
          }
      };
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [[],currentImageIndex])

    useEffect(() => {
        highlightCurrentSlide();
        updateIndicatorAnimation();   
    }, [])
    useEffect (() => {
        highlightCurrentSlide();
        updateIndicatorAnimation(); 
    }, [currentImageIndex])
    return (
        <div className="slider">
            <div
                className="slider__inner"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
                {
                    slides.length === 0 ?
                        <div className='slider__inner__slide'>
                            <img src={noData} alt="" />
                        </div>
                        :
                        slides.map((slide, index) => (

                            <div
                                key={index}
                                className='slider__inner__slide'

                            >
                                <img src={slide.image} alt="" />
                                <div className="slider__inner__slide__description">
                                    <span>{slide.title || "No Data"}</span>
                                </div>
                            </div>))
                }
            </div>
            <div className="slider__navigation">
                <KeyboardArrowLeftIcon
                    className='slider__navigation__prev navigation__icon'
                    onClick={prevSlide} />
                <KeyboardArrowRightIcon
                    className='slider__navigation__next navigation__icon'
                    onClick={nextSlide} />
            </div>
            <div className="slider__image__shows">
                {
                    slides.map((slide, index) => (
                        
                        <div className='slider__image_shows__item' key={index}>
                            <img src={slide.image} alt="" onClick={()=>moveToSlideWithIndex(index)} />
                        </div>

                    ))
                }
            </div>
            <div className="slider__navigation__indicator">

            </div>
        </div>
    )
}


export default Slider;