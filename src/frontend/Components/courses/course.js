import {fetchAllCategories} from '../../service/categorie/CategorieService'
import {fetchAllArticlesByCategorie} from '../../service/article/ArticleService'
import {useState , useEffect } from 'react'
import {noData} from '../../assets/index'
import "./course.scss"

import { Card } from '../index';
const Course = () => {

  const [courses, setCourses] = useState([]);

  const fetchCategories = async (pageNumber) => {
    try {
      const res = await fetchAllCategories(pageNumber);
      const categories = res.data;
      const coursePromises = categories.map((category) =>
        fetchArticlesByCategory(category)
      );
      await Promise.all(coursePromises);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchArticlesByCategory = async (category) => {
    try {
      const res = await fetchAllArticlesByCategorie(category.id);
      const course = (
        <div className='menu__container__category__container' key={category.id}>
          <div className='menu__container__categoriy__container__title'>
            <h1>{category.name}</h1>
          </div>
          <div className='menu__container__categoriy__container__card'>
            {res.data.map((article) => (
              <Card key={article.id} article={article} />
            ))}
          </div>
        </div>
      );
      setCourses((prevCourses) => [...prevCourses, course]);
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(() => {
    fetchCategories(1);
  }, []); // Add an empty dependency array to run once on component mount.

  return (
    <div className='menu'>
      <div className='menu__container'>
        <div className='menu__container__categories'>
            {courses.length === 0 ? <img src = {noData} /> : courses}
        </div>
      </div>
      
    </div>
  )
}

export default Course;
