import './articledetails.scss';

import {
    LocalOfferOutlinedIcon,
    CalendarTodayOutlinedIcon,
    AccessTimeOutlinedIcon,
    WorkspacePremiumOutlinedIcon,
    ArrowRightAltOutlinedIcon,
    PersonOutlineOutlinedIcon,
} from '../../assets/index'

import { Chapter } from '../index';

import { subscribeToArticle, unsubscribeToArticle, fetchArticleImageById, fetchArticleById } from '../../service/article/ArticleService'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';
const ArticleDetails = () => {

    const { articleId } = useParams();
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);
    const [article, setArticle] = useState({});
    const [subscribed, setSubscribed] = useState(false);
    const [image, setImage] = useState(null);

    const enrollToCourse = () => {
        if (auth.isAuthenticated) {
            if (subscribed === false) {
                subscribe(article.id);
                setSubscribed(true);
            }
            else {
                unsubscribe(article.id);
                setSubscribed(false);
            }
        }
        else {
            navigate('/login');
        }

    };


    const subscribe = async (articleId) => {
        try {
            const response = await subscribeToArticle(articleId);
            message.success(`You have successfully subscribed to ${article.name} course.`);
            console.log(response);
        }
        catch (error) {
            console.log(error);
            message.error('Something went wrong, please try again later.');
        }
    }

    const unsubscribe = async (articleId) => {

        try {
            const response = await unsubscribeToArticle(articleId);
            message.success(`You have successfully unsubscribed from ${article.name} course.`);
            console.log(response);
        }
        catch (error) {
            console.log(error);
            message.error('Something went wrong, please try again later.');
        }
    }

    const isUserSubscribed = (article) => {

        for (let i = 0; i < article.subscribedUsers.length; i++) {
            if (article.subscribedUsers[i].id === auth.user.id) {
                return true;
            }
        }
        return false;

    }

    const fetchArticle = async (articleId) => {
        try {
            const response = await fetchArticleById(articleId);
            const imagePromise = await fetchArticleImageById(articleId);
            const imageResponse = await Promise.resolve(imagePromise);
            const imageUrl = URL.createObjectURL(imageResponse);
            setImage(imageUrl);
            setArticle(response.data);
            console.log(response.data);
            if (response.data) {
                setSubscribed(isUserSubscribed(response.data));
            }
        }
        catch (error) {
                console.log(error);
            }
        }
    useEffect(() => {

            fetchArticle(articleId);

        }, [articleId]);
        return (
            <div className='article-details'>
                <div className='article-details__container'>
                    <div className='article-details__container__left'>
                        <div className='article-details__container__left__title'>
                            <h2>{article.name}</h2>
                        </div>
                        <div className='article-details__container__left__image'>
                            <img src={image} alt="" />
                        </div>
                        <div className='article-details__container__left__content'>
                            <h3>Description</h3>
                            <p>
                                {article.description}
                            </p>
                        </div>
                        <div className='article-details__container__left__chapters'>
                            <h3 className='article-details__container__left__chapter__title'>Chapters</h3>
                            {
                                article.chapterDTOList && article.chapterDTOList.map((chapter, index) => {
                                    return <Chapter key={index} chapter={{
                                        title: `${(index + 1 < 10) ? `0${index + 1}` : `${index + 1}`} ${chapter.title} `,
                                        description: chapter.description
                                    }} />
                                })
                            }

                        </div>
                    </div>
                    <div className='article-details__container__right'>
                        <div className='article-details__container__right__inner'>
                            <h3>Course Features</h3>
                            <ul className='article-info'>
                                <li>
                                    <LocalOfferOutlinedIcon className='article-info-icon' />
                                    <strong>Price: </strong>
                                    <span>{article.price && article.price} Dtn</span>
                                </li>
                                <li>
                                    <CalendarTodayOutlinedIcon className='article-info-icon' />
                                    <strong>Starts: </strong>
                                    <span>{article.statingDate && (article.statingDate).slice(0, 10)}</span>
                                </li>
                                <li>
                                    <CalendarTodayOutlinedIcon className='article-info-icon' />
                                    <strong>Ends: </strong>
                                    <span>{article.endingDate && (article.endingDate).slice(0, 10)}</span>
                                </li>
                                <li>
                                    <AccessTimeOutlinedIcon className='article-info-icon' />
                                    <strong>Duration: </strong>
                                    <span>{article.timePeriod && article.timePeriod} months</span>
                                </li>
                                <li>
                                    <PersonOutlineOutlinedIcon className='article-info-icon' />
                                    <strong>Enrolled: </strong>
                                    <span>{article.subscribedUsers && article.subscribedUsers.length} students</span>
                                </li>
                                <li>
                                    <WorkspacePremiumOutlinedIcon className='article-info-icon' />
                                    <strong>Certification: </strong>
                                    <span>{article.certification && article.certification ? "yes" : "no"}</span>
                                </li>
                                <li className='article-info__btn'>
                                    <button onClick={enrollToCourse}>
                                        {!subscribed ? "subscribe" : "unsubscribe"}
                                        <ArrowRightAltOutlinedIcon className='article-info__btn__icon' />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    export default ArticleDetails;
