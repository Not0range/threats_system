import { useState } from "react";
import './HeaderButton.css';

export default function LoginButton({ text, onClick }: IProps) {
    const [pushed, setPushed] = useState(false);
    return (
        <div
            className={`login-button${pushed ? ' login-button-pushed' : ''}`}
            onClick={onClick}
            onMouseDown={() => setPushed(true)}
            onMouseUp={() => setPushed(false)}
        >
            {text}
        </div>
    )
}

interface IProps {
    text: string;
    onClick?: () => void;
}