import { fetchAllCategories, deleteCategorieById, updateCategorieById, addCategorie, searchCategories } from '../../service/categorie/CategorieService';
import { notification, Table, Button, Modal, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { HighlightOffIcon } from '../../assets/index'
import TextArea from 'antd/es/input/TextArea';

import './categorie.scss';


function Categorie() {

    const [dataSource, setDataSource] = useState([]);
    const [filtredData, setFiltredData] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [editingCategorie, setEditingCategorie] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id, render: (text) => <strong>{text}</strong> },
        { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <>
                    <Button
                        className="btn btn-primary"
                        type="primary"
                        style={{ marginRight: '1em' }}
                        onClick={() => onEditCategorie(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => onDeleteCategorie(record)}
                        className="btn btn-danger"
                        type="primary"
                        danger
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    const fetchAllCategoriesData = (page) => {
        fetchAllCategories(page)
            .then((res) => {
                const newData = res.data.map((item, index) => ({
                    key: item.id,
                    id: (index + 1) + ((pagination.current - 1) * pagination.pageSize),
                    name: item.name,
                    description: item.description,
                }));
                setDataSource(newData);
                setPagination({ ...pagination, total: res.total })
            })
            .catch((err) => {
                console.log(err);
            })
    };
    const addCategorieData = (categorie) => {
        if (categorie.name.trim() === "" || categorie.description.trim() === "") {
            message.error("Please fill all fields");
            return;
        }
        addCategorie(categorie).then((res) => {
            message.success("Categorie has been added successfully");
            setDataSource(
                [...dataSource, {
                    key: res.data.id,
                    id: dataSource.length + 1,
                    name: res.data.name,
                    description: res.data.description,
                }]
            )
            setFiltredData([]);
            resetEditingAndAdding();
        })
            .catch((err) => {
                message.error("Something went wrong");
            });
    }
    const updateCategorieByIdData = (id, categorie) => {
        updateCategorieById(id, categorie).then((res) => {
            const newData = dataSource.map((item) => {
                if (item.key === id) {
                    return {
                        ...item,
                        name: categorie.name,
                        description: categorie.description,
                    };
                }
                return item;
            });
            const newFiltredData = filtredData.map((item) => {
                if (item.key === id) {
                    return {
                        ...item,
                        name: categorie.name,
                        description: categorie.description,
                    };
                }
                return item;
            });
            notification.success({
                message: `Categorie with id ${id} has been updated successfully`,
                placement: "bottomRight",
            });
            setDataSource(newData)
            setFiltredData(newFiltredData);
            resetEditingAndAdding();
        })
            .catch((err) => {
                console.log(err);
            })

    };
    const searchCategorie = async (value) => {
        try {
            const res = await searchCategories(value);
            const filtredData = res.data.map((item, index) => ({
                key: item.id,
                id: (index + 1) + ((pagination.current - 1) * 10),
                name: item.name,
                description: item.description,
            }));
            setFiltredData(filtredData);

            if (filtredData.length === 0) {
                message.warning('No results found');
            }
            else {
                message.success(`${filtredData.length} results found`);
            }
        }
        catch (err) {
            message.error('Something went wrong');
            console.log(err);
        }
    }
    const onDeleteCategorie = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this Categorie?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                deleteCategorieById(record.key).then((res) => {
                    setDataSource(dataSource.filter(item => item.key !== record.key));
                    setFiltredData(filtredData.filter(item => item.key !== record.key));
                    notification.success({ message: `Categorie with id ${record.key} has been deleted successfully`, placement: "bottomRight", });
                    fetchAllCategoriesData(pagination.current);
                }).catch((err) => console.log(err));
            },
        });
    };

    const onEditCategorie = (record) => {
        setIsEditing(true);
        setEditingCategorie({ name: record.name, description: record.description, key: record.key });
    }
    const onAddCategory = () => {
        setIsAdding(true);
        setEditingCategorie({ name: "", description: "" });
    };
    const resetEditingAndAdding = () => {
        setIsEditing(false);
        setIsAdding(false);
    }
    const handleTableChange = (pagination) => {
        setPagination(pagination);
    }
    const handleOnSearch = (value) => {

        if (value.trim() === '') {
            message.warning('Please enter a search value');
            setFiltredData([]);
            return;
        }
        searchCategorie(value);
    }

    const handleOnClearSearch = () => {
        if (searchValue.trim() === '') {
            message.warning('Search field is already empty');
            return;
        }
        setSearchValue('');
        setFiltredData([]);
        message.success('Clear search successfully');
    }

    useEffect(() => {
        fetchAllCategoriesData(pagination.current);
    }, [pagination.current]);


    return (

        <div className="categorie">
            <div className="categorie__container">
                <div className="top_side">
                    <h1>Categories</h1>
                </div>
                <div className="search_side">
                    <div className="btn_side">
                        <Button
                            className="btn btn-primary"
                            type="primary"
                            onClick={onAddCategory}
                            loading={isAdding}
                        >
                            Add Category
                        </Button>
                    </div>
                    <Input.Search className="search_input"
                        suffix={(
                            <span className="ant-input-suffix">
                                <span className="ant-input-clear-icon" onClick={() => handleOnClearSearch()}>
                                    <HighlightOffIcon />
                                </span>
                            </span>
                        )
                        }
                        placeholder="Search by name or description"
                        enterButton="Search"
                        size="large"
                        value={searchValue}
                        onSearch={(value) => handleOnSearch(value)}
                        onChange={(e) => { setSearchValue(e.target.value) }}

                    >

                    </Input.Search>
                </div>
                <div className="table_side">
                    <Table
                        dataSource={dataSource && filtredData.length === 0 ? dataSource : filtredData}
                        columns={columns}
                        pagination={pagination}
                        onChange={handleTableChange}

                    />
                </div>


                <Modal
                    title={isEditing ? 'Edit Category' : 'Add a Category'}
                    open={isEditing || isAdding}
                    okText="Save"
                    cancelText="Cancel"
                    onCancel={() => resetEditingAndAdding()}
                    onOk={() => {
                        isAdding ?
                            addCategorieData(editingCategorie) :
                            updateCategorieByIdData(editingCategorie.key, editingCategorie);

                    }
                    }
                >


                    <label>Name</label>
                    <Input
                        value={editingCategorie?.name}
                        onChange={(e) => setEditingCategorie({ ...editingCategorie, name: e.target.value })}
                        required={editingCategorie?.name === ''}
                    />

                    <label>Description</label>
                    <TextArea
                        value={editingCategorie?.description}
                        onChange={(e) =>
                            setEditingCategorie({ ...editingCategorie, description: e.target.value })
                        }
                        required={editingCategorie?.description === ''}

                    />
                </Modal>

            </div>
        </div>

    );
}

export default Categorie;