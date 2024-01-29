import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts";
import { KeyValuePair } from "../models/Stats";

export default function BarDataChart(props: IProps) {
    return (
        <ResponsiveContainer width={props.data.length > 2 ? props.data.length * 150 : '100%'}>
            <BarChart data={props.data}>
                <XAxis dataKey='key' type="category" />
                <YAxis />
                <Tooltip />
                {(props.legendVisible === undefined || props.legendVisible) && <Legend />}
                {props.types.map((t, i) =>
                    <Bar
                        key={`${t}-${i}`}
                        name={t}
                        dataKey={t2 => (t2.values as any[]).find(t3 => t3.key === t).value}
                        fill={props.colors[i]}
                    />)}
            </BarChart>
        </ResponsiveContainer>
    )
}

interface IProps {
    data: IData[];
    types: string[];
    colors: string[];
    legendVisible?: boolean;
}

interface IData {
    key: string;
    values: KeyValuePair[];
}