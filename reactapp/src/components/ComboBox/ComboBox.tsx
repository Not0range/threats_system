import './ComboBox.css';

export default function ComboBox(props: IProps) {
    return (
        <div className="combo-input">
            <select
                disabled={props.disabled}
                value={props.value}
                onChange={(e) => props.onChanged &&
                    props.onChanged(+e.target.value)
                }>
                {props.items &&
                    props.items.map((e) =>
                        <option
                            key={`o${e.key}`}
                            value={e.key}
                        >
                            {e.value}
                        </option>)}
            </select>
            <p className={props.value !== undefined ?
                'placeholder-focused' : undefined}
            >
                {props.placeholder}
            </p>
        </div>
    );
}

interface IProps {
    value?: number;
    items?: KeyValue[];
    placeholder?: string;
    onChanged?: (value: number) => void;
    error?: boolean;
    disabled?: boolean;
}

interface KeyValue {
    key: number;
    value: string;
}