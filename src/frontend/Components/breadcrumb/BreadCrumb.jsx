import './breadcrumb.scss';
import {cours__bg} from '../../assets/index';
import { Link } from 'react-router-dom';
const  BreadCrumb  = () => {


    return (
        <section className="breadcrumb">
            <div 
                className="breadcrumb__container"
                style={{backgroundImage: `url(${cours__bg})`}}
            >
                <div className="breadcrumb__container__title">
                    <h2>Course Details</h2>
                </div>
                <div className="breadcrumb__container__breadcrumb-wrap2">
                    <div className="breadcrumb__container__breadcrumb-wrap2__breadcrumb">
                        <Link to={'/'} className='home__link'>Home</Link>
                        <span className="breadcrumb__container__breadcrumb-wrap2__breadcrumb__arrow"></span>
                        <a href="#" className='courses__link'>Course Details</a>
                    </div>
                </div>
            </div>
        </section>
    )
}


export default BreadCrumb;