import './MapSection.css';

export default function MapSection() {

    return (
        <div className='map-section-container'>
            <object id='map-object' type='image/svg+xml' data='map.svg' />
        </div>
    )
}