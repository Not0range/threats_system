import { useLocation, useNavigate } from 'react-router-dom';
import MapSection from '../../components/MapSection/MapSection';
import MostThreats from '../../components/MostThreats/MostThreats';
import SummarySection from '../../components/SummarySection/SummarySection';
import './MainRoute.css';
import { useAppSelector } from '../../store/Store';
import { useMemo, useState } from 'react';
import TypesCheckboxes from '../../components/TypesCheckboxes/TypesCheckboxes';

export default function MainRoute() {
    const districts = useAppSelector(state => state.main.places);
    const navigate = useNavigate();

    const search = useLocation().search.substring(1);
    const [d, c, m] = useMemo(() => {
        const p = search.split('&').map(t => t.split('='));
        return [p.find(t => t[0] === 'd')?.at(1),
        p.find(t => t[0] === 'c')?.at(1),
        p.find(t => t[0] === 'm')?.at(1)]
    }, [search]);

    const district = d ? districts.find(t => t.id === +d) : undefined;
    const city = district && c ? district.cities.find(t => t.id === +c) : undefined;
    const micro = city && m ? city.microdistricts.find(t => t.id === +m) : undefined;

    const [special, setSpecial] = useState(false);

    const select = (tag?: string, s?: boolean) => {
        if (!tag) {
            if (micro) {
                navigate(`/?d=${d}&c=${c}`);
            } else if (city && !special) {
                navigate(`/?d=${d}`);
            } else if (district) {
                navigate('/');
            }
            return;
        }

        if (city && c) {
            const m = city.microdistricts.find(t => t.svgTag === tag);
            if (!m) return;

            navigate(`/?d=${d}&c=${c}&m=${m.id}`);
        } else if (district && d) {
            const c = district.cities.find(t => t.svgTag === tag);
            if (!c) return;

            navigate(`/?d=${d}&c=${c.id}`);
        } else {
            const d = districts.find(t => t.svgTag === tag);
            if (!d) return;

            setSpecial(s === true)
            if (s)
                navigate(`/?d=${d.id}&c=${d.cities[0].id}`);
            else navigate(`/?d=${d.id}`);
        }
    }

    return (
        <div>
            <MostThreats />
            <div className='map-section'>
                <MapSection
                    selected={micro?.svgTag ?? city?.svgTag ?? district?.svgTag}
                    onSelected={select}
                    zoomed={city?.svgTag ?? district?.svgTag}
                />
                <SummarySection />
            </div>
            <TypesCheckboxes />
        </div>
    )
}