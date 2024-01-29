import { useRef, useState } from "react";
import './NumberInput.css';

export default function NumberInput(props: IProps) {
    const ref = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
    return (
        <div className="text-input">
            <input
                className={props.error ? 'error' : ''}
                ref={ref}
                type={"number"}
                value={props.value}
                onChange={(e) => {
                    if (!props.onChanged) return;

                    const v = +e.target.value;
                    if (!isNaN(v) && v > 0)
                        props.onChanged(+e.target.value);
                    else if (e.target.value.length == 0) {
                        props.onChanged(1);
                    }
                }
                }
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            <p className={focused || props.value ?
                'placeholder-focused' : undefined}
                onClick={() => ref.current?.focus()}
            >
                {props.placeholder}
            </p>
        </div>
    )
}

interface IProps {
    value?: number;
    placeholder?: string;
    onChanged?: (value: number) => void;
    error?: boolean;
}