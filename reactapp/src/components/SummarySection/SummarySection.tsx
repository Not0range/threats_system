import $ from 'jquery';
import { useState, useEffect, useMemo } from "react";
import { Stats } from "../../models/Stats";
import { useAppSelector } from "../../store/Store";
import SplineDataChart from "../SplineDataChart";
import { useLocation } from "react-router-dom";
import BarDataChart from '../BarDataChart';
import './SummarySection.css';
import moment from 'moment';
import { Threat } from '../../models/Threat';
import ComboBox from '../ComboBox/ComboBox';

export default function SummarySection() {
    const districts = useAppSelector(state => state.main.places);

    const types = useAppSelector(state => state.main.types);
    const active = useAppSelector(state => state.main.activeTypes);
    const filtered = types.filter((e, i) => active[i]);

    const [perDate, setPerDate] = useState<Stats[]>([]);
    const [limits, setLimits] = useState<Stats[] | undefined>([]);

    const [selected, setSelected] = useState<Stats[]>([]);
    const [table, setTable] = useState<Threat[]>([]);
    const sum = table.reduce((p, c) => p + c.value, 0);

    const [period, setPeriod] = useState(0);

    const search = useLocation().search.substring(1);
    const [d, c, m] = useMemo(() => {
        const p = search.split('&').map(t => t.split('='));
        return [p.find(t => t[0] === 'd')?.at(1),
        p.find(t => t[0] === 'c')?.at(1),
        p.find(t => t[0] === 'm')?.at(1)]
    }, [search]);

    useEffect(() => {
        const dates = periodDates(period);
        $.ajax('api/calculations/query', {
            method: 'POST',
            data: JSON.stringify({
                axis: 0,
                districtId: d === undefined ? null : +d,
                cityId: c === undefined ? null : +c,
                microdistrictId: m === undefined ? null : +m,
                beginDate: dates[0],
                endDate: dates[1],
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setPerDate(result.threats);
                setLimits(result.limits);
            }
        });
    }, [d, c, m, period]);

    useEffect(() => {
        const dates = periodDates(period);
        const axis = d === undefined ? 1 : c === undefined ? 2 : 3;
        $.ajax('api/calculations/query', {
            method: 'POST',
            data: JSON.stringify({
                axis,
                districtId: d === undefined ? null : +d,
                cityId: c === undefined ? null : +c,
                microdistrictId: m === undefined ? null : +m,
                beginDate: dates[0],
                endDate: dates[1],
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setSelected(result.threats);
            }
        });
    }, [d, c, m, period]);

    useEffect(() => {
        const dates = periodDates(period);
        $.ajax('api/calculations/summary', {
            method: 'POST',
            data: JSON.stringify({
                districtId: d === undefined ? null : +d,
                cityId: c === undefined ? null : +c,
                microdistrictId: m === undefined ? null : +m,
                beginDate: dates[0],
                endDate: dates[1],
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setTable(result.threats);
            }
        });
    }, [d, c, m, period]);

    const target = m && c && d ?
        districts.find(t => t.id === +d)
            ?.cities.find(t => t.id === +c)
            ?.microdistricts.find(t => t.id === +m)?.title :
        c && d ? districts.find(t => t.id === +d)
            ?.cities.find(t => t.id === +c)?.title :
            d ? districts.find(t => t.id === +d)?.title : undefined;

    return (
        <div className='summary-container'>
            <ComboBox
                placeholder='Период'
                value={period}
                onChanged={setPeriod}
                items={[0, 1, 2, 3].map(e => ({ key: e, value: periodStr(e) }))}
            />
            <h1>{`Статистика ${periodStr(period)} по ${target ? `субъекту: ${target}` : 'всему региону'}`}</h1>
            {<div className='chart-container'>
                <BarDataChart
                    data={selected}
                    types={filtered.map(t => t.title)}
                    colors={['#8884d8',
                        '#82ca9d',
                        '#ff7300',
                        '#a4de6c',
                        '#f23805',
                        '#f205ea']}
                    legendVisible={false}
                />
            </div>}
            <div className='chart-container'>
                <SplineDataChart
                    colors={['#8884d8',
                        '#82ca9d',
                        '#ff7300',
                        '#a4de6c',
                        '#f23805',
                        '#f205ea']}
                    data={perDate}
                    types={filtered.map(t => t.title)}
                    limits={limits}
                />
            </div>
            <table className='summary-table'>
                <thead>
                    <tr>
                        <th>Тип угрозы</th>
                        <th>Количество случаев</th>
                        <th>%</th>
                    </tr>
                </thead>
                <tbody>
                    {table.map(e => <tr key={`t${e.id}`}>
                        <td>{e.title}</td>
                        <td>{e.value}</td>
                        <td>{(e.value / sum * 100).toFixed(2)}</td>
                    </tr>)}
                    <tr>
                        <td>Итого</td>
                        <td>{sum}</td>
                        <td>100</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function periodStr(period: number) {
    switch (period) {
        case 0:
            return 'за всё время';
        case 1:
            return 'за последние полгода';
        case 2:
            return 'за последний месяц';
        case 3:
            return 'за последнюю неделю';
        default:
            return '';
    }
}

function periodDates(period: number) {
    const start = moment().utc().startOf('day');
    const end = moment().utc().startOf('day');
    switch (period) {
        case 1:
            return [start.subtract(6, 'month').toDate(), end.toDate()];
        case 2:
            return [start.subtract(1, 'month').toDate(), end.toDate()];
        case 3:
            return [start.subtract(1, 'week').toDate(), end.toDate()];
        default:
            return [null, null]
    }
}