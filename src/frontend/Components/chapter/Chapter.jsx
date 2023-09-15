import './chapter.scss';
import { ArrowBackIosOutlinedIcon } from '../../assets/index';
import { useState } from 'react';
const Chapter = ({chapter}) => {

    const [isContentVisible, setContentVisible] = useState(false);

    const toggleContent = () => {
        setContentVisible(!isContentVisible);
    };
    return (
        <div className='chapter'>
            <div className='chapter__container'>
                <div className={`chapter__container__header ${isContentVisible ? 'chapter__visible':'chapter__hidden'}`}onClick={toggleContent}>
                    <h2>
                        {chapter.title}
                    </h2>
                    <ArrowBackIosOutlinedIcon className='chapter__arrow__icon '  />
                </div>
                <div className={`chapter__container__content ${isContentVisible ? 'visible' : 'hidden'}`}>
                    <p>
                        {chapter.description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Chapter;
