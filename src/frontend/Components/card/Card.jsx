import { subscribeToArticle, unsubscribeToArticle , fetchArticleImageById} from '../../service/article/ArticleService'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './card.scss';
import { useEffect , useState} from 'react';
import { message } from 'antd';

const Card = ({article}) => {



    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);
    const [image, setImage] = useState(null);
    const [subscribed , setSubscribed] = useState(false);


    const enrollToCourse = () => {
       if(auth.isAuthenticated)
       {
            if(subscribed === false)
            {
                subscribe(article.id);
                setSubscribed(true);
            }
            else{
                unsubscribe(article.id);
                setSubscribed(false);
            }
       }
       else{
        navigate('/login');
       }
        
    };

    const subscribe = async (articleId) => {
        try{
            const response = await subscribeToArticle(articleId);
            message.success(`You have successfully subscribed to ${article.name} course.`);	
            console.log(response);
        }
        catch(error){
            console.log(error);
            message.error('Something went wrong, please try again later.');
        }
    }

    const unsubscribe = async (articleId) => {
        
        try{
            const response = await unsubscribeToArticle(articleId);
            message.success(`You have successfully unsubscribed from ${article.name} course.`);	
            console.log(response);
        }
        catch(error){
            console.log(error);
            message.error('Something went wrong, please try again later.');
        }
    }

    const isUserSubscribed = (article) => {
        for(let i = 0; i < article.subscribedUsers.length; i++) {
            if(article.subscribedUsers[i].id === auth.user.id) {
                return true;
            }
        }
        return false;
       
    }

    useEffect(() => {
        const fetchImage = async () => {
            const imagePromise = await fetchArticleImageById(article.id);
            const imageResponse = await Promise.resolve(imagePromise);
            const imageUrl = URL.createObjectURL(imageResponse);
            setImage(imageUrl);
        }
        fetchImage();
        setSubscribed(isUserSubscribed(article));
    }, [article]);

    return (
       
        <div className='card'>
            <div className='card__header'>
                <img src={image} alt="" />
            </div>
            <div className='card__body'>
                <h2>{article &&article.name}</h2>
                <p  className='ellipsis'>{article && article.description}</p>
            </div>
            <div className='card__footer'>
                <div className='card__footer__info'>
                    <p>Period: {article && article.timePeriod} days</p>
                    <p >Price: {article && article.price}dtn</p>
                </div>

                <div className='card__btns'>
                    <button
                        className='btn__enroll'
                        onClick={enrollToCourse}
                    >{!subscribed? "subscribe" : "unsubscribe"}</button>
                    <button
                        className='btn__enroll'
                        onClick={() => navigate(`/article/${article.id}`)}
                    >Details</button>
                </div>
            </div>
        </div>
    )
}

export default Card;

