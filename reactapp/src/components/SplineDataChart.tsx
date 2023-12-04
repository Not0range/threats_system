import { Line, LineChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { KeyValuePair } from "../models/Stats";

export default function SplineDataChart(props: IProps) {
    return (
        <ResponsiveContainer aspect={2} width={'100%'} height={'unset'}>
            <LineChart
                data={props.data}
                margin={{ bottom: 2, top: 2, left: 2, right: 2 }}
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
}

interface IData {
    key: string;
    values: KeyValuePair[];
}