import $ from 'jquery';
import { useState, useEffect, useMemo } from "react";
import { Stats } from "../../models/Stats";
import { useAppSelector } from "../../store/Store";
import SplineDataChart from "../SplineDataChart";
import { useLocation } from "react-router-dom";
import BarDataChart from '../BarDataChart';
import './SummarySection.css';

export default function SummarySection() {
    const types = useAppSelector(state => state.main.types);
    const [perDate, setPerDate] = useState<Stats[]>([]);
    const [selected, setSelected] = useState<Stats[]>([]);

    const search = useLocation().search.substring(1);
    const [d, c, m] = useMemo(() => {
        const p = search.split('&').map(t => t.split('='));
        return [p.find(t => t[0] === 'd')?.at(1),
        p.find(t => t[0] === 'c')?.at(1),
        p.find(t => t[0] === 'm')?.at(1)]
    }, [search]);

    useEffect(() => {
        $.ajax('api/calculations/query', {
            method: 'POST',
            data: JSON.stringify({
                axis: 0,
                districtId: d === undefined ? null : +d,
                cityId: c === undefined ? null : +c,
                microdistrictId: m === undefined ? null : +m,
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setPerDate(result.threats);
            }
        });
    }, [d, c, m]);

    useEffect(() => {
        const axis = d === undefined ? 1 : c === undefined ? 2 : 3;
        $.ajax('api/calculations/query', {
            method: 'POST',
            data: JSON.stringify({
                axis,
                districtId: d === undefined ? null : +d,
                cityId: c === undefined ? null : +c,
                microdistrictId: m === undefined ? null : +m,
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setSelected(result.threats);
            }
        });
    }, [d, c, m]);

    return (
        <div>
            <div className='chart-container'>
                <BarDataChart
                    data={selected}
                    types={types.map(t => t.title)}
                    colors={['#8884d8',
                        '#82ca9d',
                        '#ff7300',
                        '#a4de6c',
                        '#f23805',
                        '#f205ea']} />
            </div>
            <div className='chart-container'>
                <SplineDataChart
                    colors={['#8884d8',
                        '#82ca9d',
                        '#ff7300',
                        '#a4de6c',
                        '#f23805',
                        '#f205ea']}
                    data={perDate}
                    types={types.map(t => t.title)} />
            </div>
        </div>
    )
}