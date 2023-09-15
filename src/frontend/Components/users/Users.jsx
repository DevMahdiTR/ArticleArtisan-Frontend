import './users.scss'
import { Table, Button, message, Input, Modal } from 'antd';
import { useEffect, useState } from 'react'
import {fetchAllUsers, searchUser, enableUserById } from '../../service/user/UserService'

const Users = () => {

  const [dataSource, setDataSource] = useState([])
  const [filtredData, setFiltredData] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [SearchOpen, setSearchOpen] = useState(false);
  const [searchData, setSearchData] = useState([]);



  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', render: (text) => <strong>{text}</strong> },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Phone', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: 'Enabled', dataIndex: 'enabled', key: 'enabled' , sorter: (a,b) => a.enabled.localeCompare(b.enabled)},
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <Button
          className="btn btn-primary"
          type="primary"
          onClick={() => record.enabled === 'Yes' ? enableOrDisableUser(record.key, false) : enableOrDisableUser(record.key, true)}
          {...(record.enabled === 'Yes' ? { danger: true } : {})}
        >
          {record.enabled === 'Yes' ? 'Disable' : 'Enable'}
        </Button>

      ),
    }
  ];

  const fetchAllUserData = async (pageNumber) => {
    try {
      const res = await fetchAllUsers(pageNumber);
      const newData = res.data.map((item, index) => ({
        key: item.id,
        id: (index + 1) + ((pagination.current - 1) * pagination.pageSize),
        fullName: item.fullName,
        email: item.email,
        address: item.address,
        phoneNumber: item.phoneNumber,
        enabled: item.isEnabled === true ? 'Yes' : 'No'
      }))
      setDataSource(newData)
      setPagination({ ...pagination, total: res.total })
    } catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  }

  const enableOrDisableUser = async (id, state) => {
    try {
      const res = await enableUserById(id, state);
      setDataSource(
        dataSource.map(
          (item) => item.key === id ?
            {
              ...item,
              enabled: state ? 'Yes' : 'No'

            } : item

        )
      )
      message.success(`User ${state ? 'enabled' : 'disabled'} successfully`);
    }
    catch (error) {
      console.log(error);
      message.error('Something went wrong');
    }
  }

  const searchUsersData = async (query) => {

    try {
      const res = await searchUser(query);
      const newData = res.data.map((item, index) => ({
        key: item.id,
        id: (index + 1) + ((pagination.current - 1) * pagination.pageSize),
        fullName: item.fullName,
        email: item.email,
        address: item.address,
        phoneNumber: item.phoneNumber,
        enabled: item.isEnabled === true ? 'Yes' : 'No'
      }))
      setFiltredData(newData)
      if (newData.length === 0) {
        message.warning('No data found');
      } else {
        message.success(`${newData.length} results found`);
      }
    }
    catch (err) {
      console.log(err);
      message.error('Something went wrong');
    }
  }
  const handTableChange = (pagination) => {
    setPagination(pagination);
  }
  const onCancleSearchModal = () => {
    setSearchOpen(false);
    setSearchData([]);

  }
  const onClearSearchModal = () => {
    if(filtredData.length > 0)
    {
      setFiltredData([]);
      message.success('Search cleared successfully');
    }
    else
    {
      message.warning('No search data found');
    }
  }
  const onOpenSearchModal = () => {
    setSearchOpen(true);
  }
  const onOkSearchData = () => {

    const queryParams = new URLSearchParams();
    if (searchData.name)
      queryParams.append('fullName', searchData.name);
    if (searchData.email)
      queryParams.append('email', searchData.email);
    if (searchData.address)
      queryParams.append('address', searchData.address);
    if (searchData.phoneNumber)
      queryParams.append('phoneNumber', searchData.phoneNumber);

    const query = queryParams.toString();
    searchUsersData(query);
  }


  useEffect(() => {
    fetchAllUserData(pagination.current);
  }, [pagination.current])

  return (
    <div className='users'>
      <div className="users__container">
        <div className="users__container__header">
          <h1>Users</h1>
        </div>
        <div className="users__container__btns">
          <Button
            className="btn btn-primary"
            type="primary"
            
            style={{ backgroundColor: '#00FF00' }}
            onClick={onOpenSearchModal}
          >
            Search
          </Button>
          <Button
            className="btn btn-primary"
            type="primary"
            onClick={onClearSearchModal}
            danger
          >
            Clear Search
          </Button>

        </div>
        <div className="users__container__body">
          <Table
            dataSource={dataSource && filtredData.length === 0 ? dataSource : filtredData}
            columns={columns}
            pagination={pagination}
            onChange={handTableChange}
          />


        </div>
        <div className="users__container__search">
          <Modal
            title="Search User"
            open={SearchOpen}
            onCancel={onCancleSearchModal}
            okText="Search"
            cancelText="Cancel"
            onOk={onOkSearchData}
          >
            <div className="users__container__search__name">
              <label htmlFor="name">Name</label>
              <Input
                type="text"
                name="name"
                placeholder="Enter Full name"
                value={searchData?.name}
                onChange={(e) => setSearchData({ ...searchData, name: e.target.value })}
              />
            </div>
            <div className="users__container__search__email">
              <label htmlFor="email">Email</label>
              <Input
                type="text"
                name="email"
                placeholder="Enter email"
                value={searchData?.email}
                onChange={(e) => setSearchData({ ...searchData, email: e.target.value })}
              />
            </div>
            <div className="users__container__search__address">
              <label htmlFor="address">Address</label>
              <Input
                type="text"
                name="address"
                placeholder="Enter address"
                value={searchData?.address}
                onChange={(e) => setSearchData({ ...searchData, address: e.target.value })}
              />
            </div>
            <div className="users__container__search__phoneNumber">
              <label htmlFor="phoneNumber">Phone number</label>
              <Input
                type="text"
                name="phoneNumber"
                placeholder="Enter phone number"
                value={searchData?.phoneNumber}
                onChange={(e) => setSearchData({ ...searchData, phoneNumber: e.target.value })}
              />
            </div>
          </Modal>
        </div>
        
      </div>
    </div>
  )
}

export default Users
