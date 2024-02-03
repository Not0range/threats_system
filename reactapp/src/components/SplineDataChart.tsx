import { Line, LineChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { KeyValuePair } from "../models/Stats";

export default function SplineDataChart(props: IProps) {
    const data = props.limits ? props.data.map(e => ({
        key: e.key,
        values: e.values.map(e2 => ({
            key: e2.key,
            value: e2.value,
            limit: props.limits?.find(t => t.key === e.key)?.values.find(t => t.key === e2.key)?.value
        }))
    })) : props.data;
    
    return (
        <ResponsiveContainer aspect={2} width={'100%'} height={'unset'}>
            <LineChart
                data={data}
                margin={{ bottom: 16, top: 2, left: 2, right: 2 }}
            >
                <XAxis dataKey={t => t.key} unit={props.unit} />
                <YAxis />
                <Tooltip />
                {(props.legendVisible === undefined || props.legendVisible) && <Legend />}
                {props.types.map((t, i) =>
                    <Line
                        key={`${t}-${i}`}
                        type="monotone"
                        name={t}
                        dataKey={t2 => (t2.values as any[]).find(t3 => t3.key === t).value}
                        stroke={props.colors[i]}
                    />)}
                {props.limits && props.types.map((t, i) =>
                    <Line
                        key={`lim-${t}-${i}`}
                        type="step"
                        strokeDasharray={3}
                        name={`Порог: ${t}`}
                        dataKey={t2 => (t2.values as any[]).find(t3 => t3.key === t).limit}
                        stroke={props.colors[i]}
                    />)}
            </LineChart>
        </ResponsiveContainer>
    )
}

interface IProps {
    data: IData[];
    types: string[];
    colors: string[];
    unit?: string;
    legendVisible?: boolean;
    limits?: IData[];
}

interface IData {
    key: string;
    values: KeyValuePair[];
}