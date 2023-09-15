import React, { useEffect } from 'react';
import "./home.css";
import { fetchAllAffiche, fetchAfficheImageById } from '../../service/poster/PosterService';
import { Slider } from '../../Components/index';

function Home() {

  const [slides, setSlides] = React.useState([]);

  const fetchAllPoster = async (pageNumber) => {
    try {
      const res = await fetchAllAffiche(pageNumber);
      const imagePromises = res.data.map((item) => fetchAfficheImageById(item.id));
      const imageResponses = await Promise.all(imagePromises);
      const imageUrls = imageResponses.map((response) => URL.createObjectURL(response));
      
      setSlides(imageUrls.map((item, index) => {
        return{
          image: item,
          title: res.data[index].title

        }
      }));
    }
    catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchAllPoster(1);
  }, []);

  return (
    <div className='home' >
      <Slider slides={slides} />
    </div>
  );
}

export default Home;
