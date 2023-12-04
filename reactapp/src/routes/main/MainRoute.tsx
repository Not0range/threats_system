import MapSection from '../../components/MapSection/MapSection';
import MostThreats from '../../components/MostThreats/MostThreats';
import SummarySection from '../../components/SummarySection/SummarySection';
import './MainRoute.css';

export default function MainRoute() {

    return (
        <div>
            <MostThreats />
            <div className='map-section'>
                <MapSection />
                <SummarySection />
            </div>
        </div>
    )
}