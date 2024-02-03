import { useRef, useState } from "react";
import './TextInput.css';

export default function TextInput(props: IProps) {
    const ref = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
    return (
        <div className="text-input">
            <input
                className={props.error ? 'error' : ''}
                ref={ref}
                type={props.secure ? "password" : "text"}
                value={props.value}
                onChange={(e) => props.onChanged &&
                    props.onChanged(e.target.value)
                }
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                disabled={props.disabled}
            />
            <p className={focused || props.value ?
                'placeholder-focused' : undefined}
                onClick={() => ref.current?.focus()}
            >
                {props.placeholder}
            </p>
        </div>
    );
}

interface IProps {
    value?: string;
    placeholder?: string;
    onChanged?: (value: string) => void;
    secure?: boolean;
    error?: boolean;
    disabled?: boolean;
}