import $ from 'jquery';
import moment from 'moment';
import { useEffect, useState } from "react"
import { Threat } from '../../models/Threat';
import './MostThreats.css';

export default function MostThreats() {
    const [stats, setStats] = useState<Threat[]>([]);

    useEffect(() => {
        const begin = moment.utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).subtract(1, 'month').startOf('month');
        const end = moment.utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).startOf('month');

        $.ajax('api/calculations/summary', {
            method: 'POST',
            data: JSON.stringify({
                beginDate: begin,
                endDate: end
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                setStats(result.threats);
            }
        });
    }, []);

    return (
        <div>
            <h1>Статистика за прошлый месяц</h1>
            <div className='most-threats-container'>
                {stats.map((e, i) => <ThreatElement key={e.id} title={e.title} value={e.value} index={i % 3} />)}
            </div>
        </div>
    )
}

function ThreatElement({ title, value, index }: IProps) {
    return (
        <div className={`most-threat-elem summary-elem${index}`}>
            <div>{title}</div>
            <div>{value}</div>
        </div>
    )
}

interface IProps {
    title: string;
    value: number;
    index: number;
}
