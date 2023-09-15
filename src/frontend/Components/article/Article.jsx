import './article.scss';
import { Modal, Input, Button, DatePicker, Switch, Select, message, Upload, Form, Table, List, notification } from 'antd';
import { useState, useEffect } from 'react';
import { addArticle, fetchArticleImageById, searchArticle, fetchAllArticles, updateArticleById, deleteArticleById } from '../../service/article/ArticleService';
import { fetchAllCategories } from '../../service/categorie/CategorieService';
import dayjs from 'dayjs';





const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });


const Article = () => {


    const [filtredData, setFiltredData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [searchedData, setSearchedData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [selectedArticle, setSelectedArticle] = useState({
        startingDate: null,
        endingDate: null,
        key: null,
        id: null,
        name: null,
        image: null,
        certification: null,
        timePeriod: null,
        price: null,
        description: null,
        subscribedUsers: [],
    });

    const [chapters, setChapters] = useState([]);
    const [newChapter, setNewChapter] = useState({ title: '', description: '' });
    const [editingChapterIndex, setEditingChapterIndex] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
    const [selectArtcleChapters, setSelectArtcleChapters] = useState([]);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [selectedCategorie, setSelecterCategorie] = useState(null);
    const { RangePicker } = DatePicker;


    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id, render: (text) => <strong>{text}</strong> },
        {
            title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name),


        },
        { title: 'Start Date', dataIndex: 'startingDate', key: 'startingDate', sorter: (a, b) => a.startingDate.localeCompare(b.startingDate) },
        { title: 'End Date', dataIndex: 'endingDate', key: 'endingDate', sorter: (a, b) => a.endingDate.localeCompare(b.endingDate) },
        { title: 'Certificate', dataIndex: 'certification', key: 'certification', sorter: (a, b) => a.certification.localeCompare(b.certification) },
        { title: 'Price', dataIndex: 'price', key: 'price', sorter: (a, b) => a.price - b.price },
        { title: 'Period', dataIndex: 'timePeriod', key: 'timePeriod', sorter: (a, b) => a.timePeriod - b.timePeriod },
        { title: 'Category', dataIndex: 'category', key: 'category', sorter: (a, b) => a.category.localeCompare(b.category) },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (imageSrc) => (
                <img src={imageSrc} alt="Image" style={{ width: '100px', borderRadius: '5px' }} />
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Chapters',
            dataIndex: 'chapters',
            key: 'chapters',
            render: (_, record) => (
                <Button
                    className="btn btn-primary"
                    type="primary"
                    style={{ marginRight: '1em' }}
                    onClick={() => { onLoadArtcileChapters(record.key) }}
                >
                    Chapters
                </Button>
            )
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <>
                   

                    <Button
                        className="btn btn-danger"
                        type="primary"
                        danger
                        onClick={() => { onDeleteArticle(record) }}
                    >
                        Delete
                    </Button>
                    <Button
                        className="btn btn-primary"
                        type="primary"
                        style={{ marginRight: '1em' }}
                        onClick={() => { onEditArticle(record) }}
                    >
                        Edit
                    </Button>
                    <Button
                        className="btn btn-danger btn-green"
                        type="primary"

                        onClick={() => { onDetailArticle(record) }}
                    >
                        Details
                    </Button>
                </>
            ),
        }
    ]
    const fetchAllCategoriesData = async () => {
        try {
            const res = await fetchAllCategories(1);
            const newData = res.data.map((item) => ({
                key: item.id,
                id: item.id,
                name: item.name,
            }));
            setCategories(newData);
        }
        catch (err) {
            console.log(err);
        }
    }
    const fetchAllArticlesData = async (pageNumber) => {
        try {
            const res = await fetchAllArticles(pageNumber);
            const imagePromises = res.data.map((item) => fetchArticleImageById(item.id));
            const imageResponses = await Promise.all(imagePromises);
            const imageUrls = imageResponses.map((response) => URL.createObjectURL(response));
            console.log(res.data);
            const newData = res.data.map((item, index) => ({
                key: item.id,
                id: (index + 1) + ((pagination.current - 1) * 10),
                name: item.name,
                price: item.price,
                startingDate: item.statingDate.substring(0, 10),
                endingDate: item.endingDate.substring(0, 10),
                certification: item.certification === false ? 'No' : 'Yes',
                timePeriod: item.timePeriod,
                category: item.categorieDTO.name,
                image: imageUrls[index],
                chapters: item.chapterDTOList,
                description: item.description,
                subscribedUsers: item.subscribedUsers
            }));
            setDataSource(newData);
            console.log(newData);
            setPagination({ ...pagination, total: res.total });
        }
        catch (err) {
            console.log(err);
        }

    }
    const searchArticleData = async (queryParams) => {
        try {
            const res = await searchArticle(queryParams.toString());
            const imagePromises = res.data.map((item) => fetchArticleImageById(item.id));
            const imageResponses = await Promise.all(imagePromises);
            const imageUrls = imageResponses.map((response) => URL.createObjectURL(response));

            const newData = res.data.map((item, index) => ({
                key: item.id,
                id: (index + 1) + ((pagination.current - 1) * 10),
                name: item.name,
                price: item.price,
                startingDate: item.statingDate.substring(0, 10),
                endingDate: item.endingDate.substring(0, 10),
                certification: item.certification === false ? 'No' : 'Yes',
                timePeriod: item.timePeriod,
                category: item.categorieDTO.name,
                image: imageUrls[index],
                chapters: item.chapterDTOList,
                description: item.description,
                subscribedUsers: item.subscribedUsers
            }));
            setFiltredData(newData);
            if (newData.length === 0) { message.warning('No article found'); }
            else {
                message.success(`${newData.length} results found`);
            }
            console.log(newData)
        }
        catch (err) {
            console.log(err);
            message.error('Error while searching article');
        }
    }
    const addArticleData = async (image, jsonArticle, categorieId) => {

        const formatData = new FormData();
        formatData.append('image', image);
        formatData.append('jsonArticle', JSON.stringify(jsonArticle))
        formatData.append('categorieId', categorieId);

        try {
            const res = await addArticle(formatData);
            setFiltredData([]);
            setDataSource([
                ...dataSource, {
                    key: res.data.id,
                    id: res.data.id,
                    price: jsonArticle.price,
                    name: jsonArticle.name,
                    startingDate: jsonArticle.startingDate,
                    endingDate: jsonArticle.endingDate,
                    certification: jsonArticle.certification === false ? 'No' : 'Yes',
                    timePeriod: jsonArticle.timePeriod,
                    category: selectedCategorie.label,
                    image: URL.createObjectURL(image),
                    chapters: jsonArticle.chapters,
                    description: jsonArticle.description

                }
            ]);

            setIsAdding(false);
            fetchAllArticlesData(pagination.current);
            message.success('Article added successfully');

        } catch (err) {
            console.log(err);
            setIsAdding(false);
            message.error('Error while adding article');
        }

    }
    const updateArtcleByIdData = async (id, iamge, jsonArticle, categorieId) => {

        const formatData = new FormData();
        formatData.append('image', iamge);
        formatData.append('jsonArticle', JSON.stringify(jsonArticle));
        formatData.append('categorieId', categorieId);
        try {
            const res = await updateArticleById(id, formatData);
            setDataSource(
                dataSource.map(
                    item => item.key === id ?
                        {
                            ...item,
                            name: jsonArticle.name,
                            startingDate: jsonArticle.startingDate,
                            endingDate: jsonArticle.endingDate,
                            certification: jsonArticle.certification === false ? 'No' : 'Yes',
                            timePeriod: jsonArticle.timePeriod,
                            category: selectedCategorie.label,
                            image: URL.createObjectURL(iamge),
                            price: jsonArticle.price,
                        } : item

                )
            )
            setFiltredData(
                filtredData.map(
                    item => item.key === id ?
                        {
                            ...item,
                            name: jsonArticle.name,
                            startingDate: jsonArticle.startingDate,
                            endingDate: jsonArticle.endingDate,
                            certification: jsonArticle.certification === false ? 'No' : 'Yes',
                            timePeriod: jsonArticle.timePeriod,
                            category: selectedCategorie.label,
                            image: URL.createObjectURL(iamge),
                            price: jsonArticle.price,
                        } : item
                )

            )
            setIsEditing(false);
            fetchAllArticlesData(pagination.current);
            message.success('Article updated successfully');
        }
        catch (err) {
            console.log(err);
            setIsEditing(false);
            message.error('Error while updating article');
        }
    }
    const deleteArticleByIdData = async (id) => {
        const res = await deleteArticleById(id)
            .then((res) => {
                setDataSource(
                    dataSource.filter((item) => item.key !== id)
                );
                setFiltredData(
                    filtredData.filter((item) => item.key !== id)
                );
                fetchAllArticlesData(pagination.current);
                message.success('Article deleted successfully');

            })
            .catch((err) => {
                console.log(err);
                message.error('Error while deleting article');
            })
    }
    const onEditArticle = (record) => {
        setIsEditing(true);

        setSelectedArticle(
            {
                id: record.key,
                name: record.name,
                image: record.image,
                startingDate: (record.startingDate),
                endingDate: (record.endingDate),
                certification: record.certification === 'Yes' ? true : false,
                timePeriod: record.timePeriod,
                price: record.price,
                chapters: record.chapterDTOList,
                description: record.description,


            }

        );
        setChapters(record.chapters);
        const currentCategorie = categories.find((item) => item.name === record.category);
        setSelecterCategorie({ label: currentCategorie.name, value: currentCategorie.id });
        fetch(record.image)
            .then(response => response.blob())
            .then(blob => {
                const originFileObj = new File([blob], 'image.png', { type: blob.type });
                setFileList([
                    {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: record.image,
                        originFileObj
                    }
                ]);
            })
            .catch(error => {
                console.error("Error fetching image blob:", error);
            });
    }
    const onCancelModal = () => {
        setIsAdding(false);
        setIsEditing(false);
        setSelectedArticle(null);
    }
    const onOkEditModal = () => {
        if (
            !selectedArticle?.name ||
            !selectedArticle?.startingDate ||
            !selectedArticle?.endingDate ||
            !selectedArticle?.timePeriod ||
            !selectedArticle?.price ||
            !selectedCategorie?.value ||
            !selectedArticle?.description ||
            chapters.length === 0 ||
            fileList.length === 0
        ) {
            message.error('Please fill all fields');
            return;
        }
        const jsonArticle = {
            name: selectedArticle.name,
            startingDate: selectedArticle.startingDate,
            endingDate: selectedArticle.endingDate,
            certification: selectedArticle.certification,
            timePeriod: selectedArticle.timePeriod,
            price: selectedArticle.price,
            description: selectedArticle.description,
            chapters: chapters,
        }
        updateArtcleByIdData(selectedArticle.id, fileList[0].originFileObj, jsonArticle, selectedCategorie.value);

    }
    const onOkSearchModal = () => {
        const queryParams = new URLSearchParams();

        if (searchedData.name)
            queryParams.append('name', searchedData.name);
        if (searchedData.startingDate)
            queryParams.append('startingDate', searchedData.startingDate);
        if (searchedData.endingDate)
            queryParams.append('endingDate', searchedData.endingDate);
        if (searchedData.period)
            queryParams.append('period', searchedData.period);
        if (searchedData.price)
            queryParams.append('price', searchedData.price);
        if (searchedData.certification)
            queryParams.append('certified', searchedData.certification);
        if (selectedCategorie?.value)
            queryParams.append('categorie', selectedCategorie.label);

        searchArticleData(queryParams);
    }


    const onLoadArtcileChapters = (id) => {
        const articleChapters = dataSource.find((item) => item.key === id).chapters;
        setIsChapterModalOpen(true);
        setSelectArtcleChapters(articleChapters);

    }
    const onAddArticle = () => {
        setIsAdding(true);
        setSelectedArticle({
            startingDate: null,
            endingDate: null,
            key: null,
            id: null,
            name: null,
            image: null,
            certification: false,
            timePeriod: null,
            price: null,
        });
        setChapters([]);
        setFileList([]);
    }
    const onDetailArticle = (record) => {
        setDetailsVisible(true);
        setSelectedArticle(
            {
                id: record.key,
                name: record.name,
                image: record.image,
                startingDate: (record.startingDate),
                endingDate: (record.endingDate),
                certification: record.certification === 'Yes' ? true : false,
                timePeriod: record.timePeriod,
                price: record.price,
                chapters: record.chapterDTOList,
                description: record.description,
                subscribedUsers: record.subscribedUsers

            }
        )
    }
    const onOkAddModal = () => {
        if (
            !selectedArticle?.name ||
            !selectedArticle?.startingDate ||
            !selectedArticle?.endingDate ||
            !selectedArticle?.timePeriod ||
            !selectedCategorie?.value ||
            !selectedArticle?.price ||
            !selectedArticle?.description ||
            chapters.length === 0 ||
            fileList.length === 0
        ) {
            message.error('Please fill all fields');
            return;
        }
        const jsonArticle = {
            name: selectedArticle.name,
            startingDate: selectedArticle.startingDate,
            endingDate: selectedArticle.endingDate,
            certification: selectedArticle.certification,
            timePeriod: selectedArticle.timePeriod,
            price: selectedArticle.price,
            description: selectedArticle.description,
            chapters: chapters,
        }
        addArticleData(fileList[0].originFileObj, jsonArticle, selectedCategorie.value);
    }
    const onDeleteArticle = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this article?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                deleteArticleByIdData(record.key);
            }
        })
    }
    const onBeforeUpload = (file) => {
        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            message.error(`${file.name} is not a png or jpeg file`);
        }
        return file.type === 'image/png' || file.type === 'image/jpeg' ? false : Upload.LIST_IGNORE;
    }
    const onCancelSearch = () => {
        setIsSearching(false);
    }
    const onCancelSearchButton = () => {
        setFiltredData([]);
        if (filtredData.length !== 0) {
            message.success('Search cleared successfully');
        }
        else {
            message.warning('No search to clear');
        }
    }
    const onSearchArticle = () => {
        setSearchedData([])
        setIsSearching(true);
    }
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };
    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };
    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };
    const handlePreviewCancel = () => {
        setPreviewVisible(false);
        setPreviewImage(null);
    }

    const handleOnDateChange = (date) => {
        if (date) {
            setSelectedArticle((prevSelectedArticle) => ({
                ...prevSelectedArticle,
                startingDate: date[0].format('YYYY-MM-DD'),
                endingDate: date[1].format('YYYY-MM-DD'),
            }));
        }
    };

    const handleAddChapter = () => {
        if (newChapter.title && newChapter.description) {
            setChapters([...chapters, newChapter]);
            setNewChapter({ title: '', description: '' });
        }
    };

    // Function to handle editing a chapter
    const handleEditChapter = (chapter, index) => {
        setEditingChapterIndex(index);
        setNewChapter(chapter)
        setIsModalVisible(true);
    };

    // Function to save changes after editing a chapter
    const handleSaveEdit = () => {
        if (!newChapter.title || !newChapter.description) {
            message.warning('Please fill all fields');
            return;
        }
        const updatedChapters = [...chapters];
        updatedChapters[editingChapterIndex] = newChapter;
        setChapters(updatedChapters);
        setNewChapter({ title: '', description: '' });
        setIsModalVisible(false);
        console.log(chapters);
    };

    // Function to delete a chapter
    const handleDeleteChapter = (index) => {
        const updatedChapters = chapters.filter((_, i) => i !== index);
        setChapters(updatedChapters);
    };
    const handleChapterCancel = () => {
        setIsChapterModalOpen(false);
    }
    useEffect(() => {
        fetchAllCategoriesData();
        fetchAllArticlesData(pagination.current);

    }, [pagination.current]);


    return (
        <div className='article'>
            <div className="article__container">
                <div className="article__header">
                    <h1 className="article__title">Articles</h1>
                </div>
                <div className="poster__container__btn" >
                    <div className="poster__container__btn_search"
                        style={{ display: 'flex', flexDirection: 'row', gap: '0.5em' }}
                    >
                        <Button
                            className="btn btn-primary"
                            type="primary"

                            onClick={onAddArticle}
                            loading={isAdding}
                        >
                            Add Article
                        </Button>
                        <Button
                            className="btn btn-primary"
                            type="primary"
                            style={{ backgroundColor: '#00FF00' }}
                            onClick={onSearchArticle}
                            loading={isSearching}
                        >
                            Search
                        </Button>
                        <Button
                            className="btn btn-primary"
                            type="primary"
                            danger
                            onClick={onCancelSearchButton}
                        >
                            Clear Search
                        </Button>
                    </div>
                </div>
                <div className="article__container__body">
                    <Table
                        dataSource={dataSource && filtredData.length === 0 ? dataSource : filtredData}
                        columns={columns}
                        pagination={pagination}
                        onChange={handleTableChange}
                    />
                    <Modal
                        title={isEditing ? "Edit Article" : "Add Article"}
                        open={isEditing || isAdding}
                        okText="Save"
                        cancelText="Cancel"
                        onCancel={() => onCancelModal()}
                        onOk={() => {
                            isAdding ? onOkAddModal() : onOkEditModal();
                        }}
                    >

                        <Form
                            layout="vertical"
                            name="basic"
                            style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}
                        >
                            <div className="article__container__body_name"
                                style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}
                            >
                                <label>Name</label>
                                <Input
                                    placeholder="Name"
                                    name="name"
                                    value={selectedArticle?.name}
                                    onChange={(e) => setSelectedArticle({ ...selectedArticle, name: e.target.value })}
                                />
                            </div>
                            <div className="article__container__body_description">
                                <label>Description</label>
                                <Input.TextArea
                                    placeholder="Description"
                                    name="description"
                                    value={selectedArticle?.description}
                                    onChange={(e) => setSelectedArticle({ ...selectedArticle, description: e.target.value })}
                                />
                            </div>

                            <div className="article__container__body_time"
                                style={{ display: 'flex', gap: '1em' }}
                            >
                                <div className="artcile__container__body_time_start-time"

                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}
                                >

                                    <label>
                                        Chose you time
                                    </label>
                                    <RangePicker


                                        value={[
                                            selectedArticle?.startingDate ? dayjs(selectedArticle?.startingDate) : null,
                                            selectedArticle?.endingDate ? dayjs(selectedArticle?.endingDate) : null
                                        ]}
                                        onChange={handleOnDateChange}
                                        format="YYYY-MM-DD"
                                        startPlaceholder="Start Date"
                                        endPlaceholder="End Date"
                                    />
                                </div>
                                <div className="artcile__container__body_time_period"
                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}
                                >
                                    <label>Period</label>
                                    <Input
                                        type='number'
                                        placeholder="Period"
                                        name="period"
                                        value={selectedArticle?.timePeriod}
                                        onChange={(e) => setSelectedArticle({ ...selectedArticle, timePeriod: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="article__container__body_category-certificate"

                                style={{ display: 'flex', gap: '1em' }}
                            >
                                <div className="article__container__body_category"
                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}
                                >
                                    <label>Category</label>
                                    <Select
                                        placeholder="Category"
                                        name="category"
                                        options={categories.map((item) => {
                                            return { label: item.name, value: item.id }
                                        })}
                                        value={selectedCategorie?.value}
                                        onChange={(e, t) => setSelecterCategorie({ ...selectedArticle, label: t.label, value: e })}
                                    ></Select>
                                </div>
                                <div className="article__container__body_price"
                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}
                                >

                                    <label>Price</label>
                                    <Input
                                        type='number'
                                        placeholder="Price"
                                        name="price"
                                        value={selectedArticle?.price}
                                        onChange={(e) => setSelectedArticle({ ...selectedArticle, price: e.target.value })}
                                    />
                                </div>
                                <div className="article__container__body_certificate"
                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}
                                >

                                    <label>Certificate</label>
                                    <Switch
                                        name="certificate"
                                        style={{ width: '5%' }}
                                        defaultChecked={false}
                                        checked={selectedArticle?.certification}
                                        onChange={(e) => setSelectedArticle({ ...selectedArticle, certification: e })}
                                    />
                                </div>


                            </div>

                            <div className="article__container__body_image"

                                style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}

                            >
                                <label>Image</label>
                                <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    maxCount={1}
                                    onPreview={handlePreview}
                                    onChange={handleUploadChange}
                                    beforeUpload={(file) => onBeforeUpload(file)}

                                >
                                    <Button>Upload</Button>
                                </Upload>

                            </div>

                            <div className="article__container__body__chapters"
                                style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
                                    <Input
                                        placeholder="Chapter Title"
                                        value={newChapter.title}
                                        onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                                    />
                                    <Input.TextArea
                                        placeholder="Chapter Description"
                                        value={newChapter.description}
                                        onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
                                    />
                                    <Button onClick={handleAddChapter} type="primary" >
                                        Add Chapter
                                    </Button>
                                </div>

                                <List
                                    dataSource={chapters}
                                    renderItem={(chapter, index) => (
                                        <List.Item
                                            actions={[
                                                <div 
                                                    style={{ display: 'flex', flexDirection: 'column' }}
                                                 >
                                                    <Button type='primary' onClick={() => handleEditChapter(chapter, index)}>Edit</Button>,
                                                    <Button danger onClick={() => handleDeleteChapter(index)}>Delete</Button>
                                                </div>
                                                ,
                                            ]}
                                        >
                                            <div
                                                style={{ display: 'flex', flexDirection: 'column' }}
                                            >

                                                <h3>{chapter.title}</h3>
                                                <p>{chapter.description}</p>
                                            </div>
                                        </List.Item>
                                    )}
                                />

                                <Modal
                                    title="Edit Chapter"
                                    open={isModalVisible}
                                    onOk={handleSaveEdit}
                                    onCancel={() => setIsModalVisible(false)}
                                >
                                    <label>Chapter Title</label>
                                    <Input
                                        placeholder="Chapter Title"
                                        value={newChapter.title}
                                        onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                                    />
                                    <label>Chapter Description</label>
                                    <Input.TextArea
                                        placeholder="Chapter Description"
                                        value={newChapter.description}
                                        onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
                                    />
                                </Modal>
                            </div>


                            <Modal
                                title="Preview Image"
                                open={previewVisible}
                                onCancel={handlePreviewCancel}
                                footer={null}

                            >
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                        </Form>
                    </Modal>
                </div>

                <div className="poster__container__modal__search">
                    <Modal
                        title="Search Article"
                        open={isSearching}
                        okText="Search"
                        cancelText="Cancel"
                        onCancel={onCancelSearch}
                        onOk={() => onOkSearchModal()}
                    >
                        <div className="poster__container__search"
                            style={{ display: 'flex', flexDirection: 'column', gap: '1em' }}

                        >


                            <div className="poster__container__modal__search_name"
                                style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}
                            >
                                <label>Name</label>
                                <Input
                                    placeholder="Name"
                                    name="name"
                                    value={searchedData?.name}
                                    onChange={(e) => setSearchedData({ ...searchedData, name: e.target.value })}
                                />
                            </div>
                            <div className="poster__container__modal__search_time"
                                style={{ display: 'flex', flexDirection: 'row', gap: '0.5em' }}
                            >
                                <div className="poster__container__modal__search__time__start"
                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}
                                >
                                    <label>Start At</label>
                                    <DatePicker
                                        placeholder="Starts At"
                                        name="startAt"
                                        value={searchArticle?.startingDate}
                                        onChange={(e) => {
                                            if (e)
                                                setSearchedData({ ...searchedData, startingDate: e.format('YYYY-MM-DD') })
                                        }
                                        }
                                    />
                                </div>
                                <div className="poster__container__modal__search__time__end"
                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}
                                >
                                    <label>Start At</label>
                                    <DatePicker
                                        placeholder="Ends before"
                                        name="endBefore"
                                        value={searchArticle?.endingDate}
                                        onChange={(e) => { if (e) setSearchedData({ ...searchedData, endingDate: e?.format('YYYY-MM-DD') }) }
                                        }
                                    />
                                </div>
                                <div className="poster__container__modal__search__time__period"
                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
                                    <label>Period</label>
                                    <Input
                                        type='number'
                                        placeholder="Period"
                                        name="period"
                                        value={searchArticle?.period}
                                        onChange={(e) => setSearchedData({ ...searchedData, period: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="poster__container__modal__search_bottom"
                                style={{ display: 'flex', flexDirection: 'row', gap: '1em' }}

                            >
                                <div className="poster__container__modal__search_bottom__category"

                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}


                                >
                                    <label>Category</label>
                                    <Select
                                        placeholder="Category"
                                        name="category"
                                        value={searchedData?.category}
                                        options={categories.map((item) => {
                                            return { label: item.name, value: item.id }
                                        })}
                                        onChange={(e, t) => setSelecterCategorie({ ...selectedArticle, label: t.label, value: e })}
                                    ></Select>


                                </div>
                                <div className="poster__container__modal__search_bottom__price"
                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}

                                >
                                    <label>Price</label>
                                    <Input
                                        type='number'
                                        placeholder="Price"
                                        name="price"
                                        value={searchedData?.price}
                                        onChange={(e) => setSearchedData({ ...searchedData, price: e.target.value })}
                                    />
                                </div>
                                <div className="poster__container__modal__search_bottom__certificate"
                                    style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}

                                >
                                    <label>Certificate</label>
                                    <Switch
                                        name="certificate"
                                        style={{ width: '5%' }}
                                        defaultChecked={false}

                                        onChange={(e) => setSearchedData({ ...searchedData, certification: e })}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        title="User subscribed"
                        open={detailsVisible}
                        onCancel={() => setDetailsVisible(false)}
                        footer={null}

                    >

                        <h3>Subscribed user Number : {selectedArticle?.subscribedUsers?.length}</h3>
                        <List
                            dataSource={selectedArticle?.subscribedUsers}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <h3>{index + 1} - {item.email}</h3>
                                </List.Item>
                            )}


                        >

                        </List>



                    </Modal>
                </div>
                <div className="poster__container__modal__chapters">
                    <Modal
                        title="Article Chapters"
                        open={isChapterModalOpen}
                        footer={null}
                        onCancel={handleChapterCancel}
                    >
                        <List
                            dataSource={selectArtcleChapters}
                            renderItem={(chapter, index) => (
                                <List.Item

                                >
                                    <div className="chapter"
                                        style={{ display: 'flex', flexDirection: 'column' }}
                                    >
                                        <div className="chapter__number">
                                            <h3
                                                style={{ margin: '0' }}
                                            >Chapter {index + 1}</h3>
                                        </div>
                                        <div className="chapter__details"
                                            style={{ marginLeft: '1em', marginTop: '-1em' }}
                                        >
                                            <p><strong>Chapter title: </strong>{chapter.title}</p>
                                            <p
                                                style={{ marginTop: '-1em' }}><strong>Chapter description: </strong>{chapter.description}</p>
                                        </div>
                                    </div>

                                </List.Item>
                            )}
                        />
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export default Article;
