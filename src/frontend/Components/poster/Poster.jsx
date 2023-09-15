import './poster.scss'
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message } from 'antd';

import { HighlightOffIcon } from '../../assets/index'
import { fetchAllAffiche, fetchAfficheImageById, searchAffiche, updateAfficheById, deleteAfficheById, addAffiche } from '../../service/poster/PosterService'
import { Label } from '@mui/icons-material';


const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });



const Poster = () => {

    const [dataSource, setDataSource] = useState([]);
    const [filtredData, setFiltredData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [currentPoster, setCurrentPoster] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id, render: (text) => <strong>{text}</strong> },
        { title: 'Title', dataIndex: 'title', key: 'title', sorter: (a, b) => a.title.localeCompare(b.title) },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (imageSrc) => (
                <img src={imageSrc} alt="Image" style={{ width: '150px', borderRadius: '5px' }} />
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <>
                    <Button
                        className="btn btn-primary"
                        type="primary"
                        style={{ marginRight: '1em' }}
                        onClick={() => onEditPoster(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        className="btn btn-danger"
                        type="primary"
                        onClick={() => { onDeletePoster(record) }}
                        danger
                    >
                        Delete
                    </Button>
                </>
            ),
        }
    ];

    const fetchAllAfficheData = async (page) => {
        try {
            const res = await fetchAllAffiche(page);
            const imagePromises = res.data.map((item) => fetchAfficheImageById(item.id));
            const imageResponses = await Promise.all(imagePromises);
            const imageUrls = imageResponses.map(response => URL.createObjectURL(response));

            const newData = res.data.map((item, index) => ({
                key: item.id,
                id: (index + 1) + ((pagination.current - 1) * 10),
                title: item.title,
                image: imageUrls[index]
            }));
            setDataSource(newData);
            setPagination({ ...pagination, total: res.total });
        } catch (err) {
            console.log(err);
        }
    };

    const updatePostereById = async (id, image, jsonAfficheDetails) => {

        const formatData = new FormData();
        formatData.append('image', image);
        formatData.append('jsonAfficheDetails', JSON.stringify(jsonAfficheDetails));
        try {
            const res = await updateAfficheById(id, formatData);
            setDataSource(
                dataSource.map(
                    item => item.key === id ?
                        {
                            ...item,
                            title: jsonAfficheDetails.title,
                            image: URL.createObjectURL(image)
                        } : item));

            setFiltredData(
                filtredData.map(
                    item => item.key === id ?
                        {
                            ...item,
                            title: jsonAfficheDetails.title,
                            image: URL.createObjectURL(image)
                        } : item));

            message.success('Update successfully');
            setIsModalVisible(false);

        }
        catch (err) {
            console.log(err);
            message.error('Update failed');
            setIsModalVisible(false);

        }
    }
    const deletePosterById = async (id) => {
        const res = await deleteAfficheById(id)
            .then((res) => {
                setDataSource(dataSource.filter(item => item.id !== id));
                setFiltredData(filtredData.filter(item => item.id !== id));

                fetchAllAfficheData(pagination.current);
                message.success('Delete successfully');
            })
            .catch((err) => {
                console.log(err);

                message.error('Delete failed');
            });

    }
    const addPoster = async (image, jsonAfficheDetails) => {

        const formatData = new FormData();
        formatData.append('image', image);
        formatData.append('jsonAffiche', JSON.stringify(jsonAfficheDetails));
        try {
            const res = await addAffiche(formatData);
            setFiltredData([])
            setDataSource([...dataSource, {
                key: res.data.id,
                id: res.data.id,
                title: jsonAfficheDetails.title,
                image: URL.createObjectURL(image)
            }]);
            setIsModalVisible(false);
            setIsAdding(false);
            message.success('Add successfully');

        } catch (err) {
            console.log(err);
            setIsAdding(false);
            message.error('Adding poster failed');
        }
    }
    const searchPosterByTilte = async (title) => {
        try {
            const res = await searchAffiche(title);
            const imagePromises = res.data.map((item) => fetchAfficheImageById(item.id));
            const imageResponses = await Promise.all(imagePromises);
            const imageUrls = imageResponses.map(response => URL.createObjectURL(response));

            const newData = res.data.map((item, index) => ({
                key: item.id,
                id: (index + 1) + ((pagination.current - 1) * 10),
                title: item.title,
                image: imageUrls[index]
            }));
            setFiltredData(newData);
            if (newData.length === 0) {
                message.warning('No results found');
            }
            else {
                message.success(`${newData.length} results found`);
            }
        }
        catch (err) {
            console.log(err);
            message.error('Search failed');
        }
    }
    const handleTableChange = (pagination) => {
        setPagination(pagination);
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
    }
    const handleOnSearch = (value) => {
        if (value.trim() === '') {
            message.warning('Please enter a search value');
            setFiltredData([]);
            return;
        }
        searchPosterByTilte(value);
    }
    const onEditPoster = (record) => {
        setIsModalVisible(true);
        setCurrentPoster({ ...record, id: record.key, image: record.image, title: record.title });
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
    const onDeletePoster = (record) => {
        Modal.confirm({
            title: 'Are you sure delete this poster?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                deletePosterById(record.key)
            }
        })
    }
    const onCancelModal = () => {
        setIsModalVisible(false);
        setIsAdding(false);
        setCurrentPoster(null);
    }
    const onAddPoster = () => {
        setIsAdding(true);
        setCurrentPoster(null);
        setFileList([]);
    }
    const onBeforeUpload = (file) => {
        if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            message.error(`${file.name} is not a png or jpeg file`);
        }
        return file.type === 'image/png' || file.type === 'image/jpeg' ? false : Upload.LIST_IGNORE;
    }
    const onClearSearch = () => {
        if (searchValue.trim() === '') {
            message.warning('Search value is empty');
            return;
        }
        setSearchValue('');
        setFiltredData([]);
        message.success('Clear search successfully');
    }
    const handlePreviewCancel = () => {
        setPreviewVisible(false);
        setPreviewImage(null);
    }

    const onOkEditModal = () => {
        if (currentPoster.title.trim() === '' || fileList.length < 1) {
            message.error('Please fill in all fields');
            return;
        }
        console.log(fileList[0])
        updatePostereById(
            currentPoster.id,
            fileList[0].originFileObj,
            { title: currentPoster.title }
        );
    };
    const onOkAddModal = () => {
        if (currentPoster?.title && fileList[0]?.originFileObj) {
            addPoster(fileList[0].originFileObj, { title: currentPoster?.title });
        } else
            message.error('Please fill in all fields');
    }
    useEffect(() => {
        fetchAllAfficheData(pagination.current);
    }, [pagination.current])
    return (
        <div className='poster'>
            <div className='poster__container'>
                <div className='poster__container__header'>
                    <h1>Poster</h1>
                </div>
                <div className="search_side">
                    <div className="poster__container__btn">
                        <Button
                            className="btn btn-primary"
                            type="primary"
                            onClick={onAddPoster}
                            loading={isAdding}
                        >
                            Add Poster
                        </Button>
                    </div>
                    <Input.Search className='search_side__input'
                        suffix={(
                            <span className="ant-input-suffix">
                                <span className="ant-input-clear-icon" onClick={() => onClearSearch()}>
                                    <HighlightOffIcon />
                                </span>
                            </span>
                        )}
                        enterButton="Search"
                        placeholder="Search by title"
                        size='large'
                        value={searchValue}
                        onSearch={(value) => handleOnSearch(value)}
                        onChange={(e) => setSearchValue(e.target.value)}
                    >

                    </Input.Search>
                </div>
                <div className='poster__container__body'>
                    <Table
                        dataSource={dataSource && filtredData.length === 0 ? dataSource : filtredData}
                        columns={columns}
                        pagination={pagination}
                        onChange={handleTableChange}
                    />
                    <Modal
                        title={isAdding ? 'Add Poster' : 'Edit Poster'}
                        open={isModalVisible || isAdding}
                        okText="Save"
                        cancelText="Cancel"
                        onCancel={() => onCancelModal()}
                        onOk={() => { isAdding ? onOkAddModal() : onOkEditModal() }}
                    >

                        <Form>
                            <div className="form-item">
                                <label>Title</label>


                                <Input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={currentPoster?.title}
                                    onChange={(e) => setCurrentPoster({ ...currentPoster, title: e.target.value })}
                                />

                            </div>

                            <div className="form-item"
                                style={{ marginTop: '1em' }}
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

            </div>
        </div>
    )
}

export default Poster
