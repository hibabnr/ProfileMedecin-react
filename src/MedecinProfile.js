
import React,{ useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// ant design imports
import { Layout, Menu, Avatar, Divider, Select, Form, Input, Button, Descriptions, Upload, Skeleton, Typography, Card, Flex, Image, Modal, Table, Popover, message, List } from 'antd';
import {
    MessageOutlined,
    SearchOutlined,
    InfoCircleOutlined,
    UserOutlined,
    ScheduleOutlined,
    EllipsisOutlined,
    UploadOutlined,
    CloseCircleOutlined,
    SettingOutlined,
} from '@ant-design/icons';

import axios from 'axios';
//declaring consts

const { Search } = Input;
const { Option } = Select;
const { Content, Sider } = Layout;
const { Meta } = Card;
const {Title} = Typography;

const Profile = () => {

    const [loading, setLoading] = useState(true); // Initialize loading state
    const [form] = Form.useForm(); // Initialize the form
    const [userData, setUserData] = useState({});
    const [dataSource, setDataSource] = useState([]);
    const userId = 1;


    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/utilisateurs/medecins/${userId}`);
            const data = response.data;
            setUserData(data.utilisateur);
            setDataSource([
               
                { field: 'Nom', value: data.utilisateur.Nom },
                { field: 'Prénom', value: data.utilisateur.Prenom },
                { field: 'Genre', value: data.utilisateur.Genre },
                { field: 'Date de Naissance', value: data.utilisateur.Date_Naissance },
                { field: 'Specialité', value: data.utilisateur.medecin.Specialite },
                { field: 'Adresse Email', value: data.utilisateur.Adresse_Email },
                { field: 'Mot de Passe', value: data.utilisateur.Mot_de_passe }
            ]);
            setLoading(false);
        } catch (error) {
            console.error('There was a problem fetching the data:', error);
        }
    };
    

    useEffect(() => {
        fetchData();
    }, []);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
        form.setFieldsValue(userData); // Populate form fields with fetched data
        form.setFieldsValue({Specialite:userData.medecin.Specialite});
    };
    const handleOk = () => {
        setIsModalOpen(false);
        message.success('Changed successfully');
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
    
            const response = await axios.put(`http://localhost:8000/api/utilisateurs/medecins/${userId}`, values, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.data.ok) {
                throw new Error('Network response was not ok');
            }
            handleOk();
            fetchData();
        } catch (error) {
            console.error('There was a problem updating the data:', error);
            // Handle error scenarios, display error messages, etc.
        }
    };

    
    return (
        <>
            <Modal title="Mes Informations" open={isModalOpen} width={'80%'} okText='Sauvegarder' cancelText='Annuler' onOk={ handleSave} onCancel={handleCancel} style={{ top: 20 }}>
                <Form layout="vertical" form={form}>
                    <Form.Item label="Nom" name="Nom">
                        <Input placeholder="Entrez votre nom" />
                    </Form.Item>
                    <Form.Item label="Prénom" name="Prenom">
                        <Input placeholder="Entrez votre prénom" />
                    </Form.Item>
                    <Form.Item label="Genre" name="Genre">
                        <Select placeholder="Sélectionnez le genre">
                            <Option value="Homme">Homme</Option> 
                            <Option value="Femme">Femme</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Date de Naissance" name="Date_Naissance">
                        <Input type="date" placeholder="Sélectionnez votre date de naissance" />
                    </Form.Item>
                    <Form.Item label="Specialité" name="Specialite">
                        <Input placeholder="Entrez votre Specialité" />
                    </Form.Item>
                    <Form.Item label="Adresse Email" name="Adresse_Email">
                        <Input type="email" placeholder="Entrez votre adresse email" />
                    </Form.Item>
                    <Form.Item label="Mot de passe" name="Mot_de_passe">
                        <Input.Password placeholder="Entrez votre mot de passe" />
                    </Form.Item>
                
                </Form>
            </Modal>
            <Flex wrap='wrap' gap={30} align='center'>
            <Card
                    style={{ width: '100%' }}
                    title='Details'
                    extra={[
                        <SettingOutlined key="setting" onClick={showModal} />,
                    ]}
                    bordered={false} hoverable
                >
                    <Skeleton loading={loading} active>
                        <Descriptions column={{ sm: 1, md: 2, lg: 2, xl: 3 }}>
                            {dataSource.map(item => (
                                <Descriptions.Item key={item.field} label={item.field}>{item.value}</Descriptions.Item>
                            ))}
                        </Descriptions>
                    </Skeleton>
                </Card>
                <Card title="Stats" style={{ width: '100%'}} bordered={false} hoverable>
                    <Title level={4}>Stats</Title>
                </Card>
            </Flex>
        </>
    );

}
//patients page 

const PatientProfile = ({ match }) => {
    // Use match.params.id to fetch and display the profile of the selected patient
    return <div>{`Patient Profile for ID ${match.params.ID_Utilisateur}`}</div>;
  };

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/utilisateurs/patients');
        const data = response.data;
        setPatients(data.utilisateurs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div>
      <h2>Liste des Patients</h2>
      <List
                itemLayout="horizontal"
                dataSource={patients}
                loading={loading}
                renderItem={(patient) => (
                    <List.Item>
                        <Skeleton loading={loading} active>
                            <List.Item.Meta
                                avatar={<Avatar src={patient.photo} />}
                                title={<Link to={`/patients/${patient.ID_Utilisateur}`}>{`${patient.Nom} ${patient.Prenom}`}</Link>}
                                
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
    </div>
  );
};



  



//appointments page

const Appointments = () => {
    const dataSource = [
        {
            key: '1',
            patientName: 'John Doe',
            doctorName: 'Dr. Smith',
            date: '2023-12-05',
            time: '10:00 AM',
        },
        {
            key: '2',
            patientName: 'Alice Johnson',
            doctorName: 'Dr. Brown',
            date: '2023-12-07',
            time: '02:30 PM',
        },
    ];

    // Define columns for the table
    const columns = [
        {
            title: 'Patient Name',
            dataIndex: 'patientName',
            key: 'patientName',
        },
        {
            title: 'Doctor Name',
            dataIndex: 'doctorName',
            key: 'doctorName',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
    ];
    return (
        <Flex justify='flex-start' wrap='wrap' gap={'large'} >
            <Table dataSource={dataSource} columns={columns} pagination={false} scroll={{ x: true }} size='middle' />
        </Flex>
    );
}

//message page

const Messages = () => {
    return (
        <></>
    );
}

//notifictaion page

const Notifications = () => <div>
</div>;

//main doctor page



const Medecin = () => {
    //menu side bar
    const menuItems = [
        {
            key: '1',
            icon: <UserOutlined />,
            label: 'Profile',
            link: '/',
            component: <Profile />,
        },
        {
            key: '2',
            icon: <SearchOutlined />,
            label: 'Patients',
            link: '/Patients',
            component: <Patients />,
        },
        {
            key: '3',
            icon: <ScheduleOutlined />,
            label: 'Appointments',
            link: '/Appointments',
            component: <Appointments />,
        },
        {
            key: '4',
            icon: <MessageOutlined />,
            label: 'Messages',
            link: '/Messages',
            component: <Messages />,
        },
        {
            key: '5',
            icon: <InfoCircleOutlined />,
            label: 'Notifications',
            link: '/Notifications',
            component: <Notifications />,
        },
    ];
    return (
        <Router>
            <Layout>
                <Sider width={'200'}
                    style={{ background: '#fff' }}
                    breakpoint='sm'
                    collapsedWidth={'18%'}>
                    <Menu
                        mode="inline"
                        style={{ height: '100%', padding: '0.2rem ', borderRight: 0, marginTop: '2rem' }}>
                            <Flex justify='center'>
                        <Avatar
                            shape='circle'
                            size={{ xs: 55, sm: 130, md: 150, lg: 160, xl: 170, xxl: 180 }}
                            src={<Image height={'100%'} width={'100%'}
                                src={'https://img.freepik.com/vecteurs-libre/illustration-concept-medecin_114360-1269.jpg?size=626&ext=jpg&ga=GA1.1.603681219.1702761608&semt=ais'}
                            />}
                        />
                        </Flex>
                        <Divider />
                        {menuItems.map(item => (
                            <Menu.Item key={item.key} icon={item.icon}>
                                <Link to={item.link}>{item.label}</Link>
                            </Menu.Item>
                        ))}
                    </Menu>
                </Sider>
                <Content style={{ padding: '0.5rem', marginTop: '0.5rem', minHeight: '100vh' }}>
                    <Routes>
                        {menuItems.map(item => (
                            <Route key={item.key} path={item.link} element={item.component} />
                        ))}
                    </Routes>
                </Content>
            </Layout>
        </Router>
    )
}

export default Medecin
