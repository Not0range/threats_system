import { useEffect, useState } from 'react';
import './DateTimeInput.css';

export default function DateTimeInput(props: IProps) {
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        if (!props.onChanged) return;
        if (date && time) {
            props.onChanged(new Date(
                date.setHours(time.getHours(),
                    time.getMinutes(),
                    time.getSeconds())));
        }
        else props.onChanged(null);

    }, [date, time]);

    return (
        <div className="datetime-input">
            <div>
                <input type='date' onChange={e => setDate(e.target.valueAsDate)} />
                <input type='time' onChange={e => setTime(e.target.valueAsDate)} />
            </div>
            <p className='placeholder-focused'
            >
                {props.placeholder}
            </p>
        </div>);
}

interface IProps {
    placeholder?: string;
    onChanged?: (value: Date | null) => void;
    error?: boolean;
}