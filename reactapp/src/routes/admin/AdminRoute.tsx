import { useState } from 'react';
import './AdminRoute.css';
import PasswordChange from './tabs/PasswordChange/PasswordChange';
import TabPanel from '../../components/TabPanel/TabPanel';
import { useAppSelector } from '../../store/Store';
import DistrictsPage from './tabs/DistrictsPage/DistrictsPage';
import CitiesPage from './tabs/CitiesPage/Cities.Page';
import MicrodistrictsPage from './tabs/MicrodistrictsPage/MicrodistrictsPage';
import TypesPage from './tabs/TypesPage/TypesPage';
import UsersPage from './tabs/UsersPage/UsersPage';
import ThreatsPage from './tabs/ThreatsPage/ThreatsPage';

export default function AdminRoute() {
    const user = useAppSelector(state => state.main.currentUser);
    const [tab, setTab] = useState(0);

    return (
        <div className='admin-route-container'>
            {user?.role != 2 && <TabPanel
                index={tab}
                titles={[
                    'Смена пароля',
                    'Управление угрозами',
                    'Управление районами',
                    'Управление городами',
                    'Управление микрорайонами',
                    'Управление типами угроз',
                    'Управление пользователями',
                ]}
                onTabChanged={setTab} />}
            {tab == 0 && <PasswordChange />}
            {tab == 1 && <ThreatsPage />}
            {tab == 2 && <DistrictsPage />}
            {tab == 3 && <CitiesPage />}
            {tab == 4 && <MicrodistrictsPage />}
            {tab == 5 && <TypesPage />}
            {tab == 6 && <UsersPage />}
        </div>
    )
}