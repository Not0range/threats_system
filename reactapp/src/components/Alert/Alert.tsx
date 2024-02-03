import './Alert.css';

export default function Alert({ type, text }: IPRops) {
    const c = type === 'error' ?
        'error-alert' : type === 'warning' ?
            'warning-alert' : type === 'success' ?
                'success-alert' : '';
    return (<div className={`alert-container ${c}`}>
        {text}
    </div>)
}

interface IPRops {
    type?: 'success' | 'warning' | 'error';
    text?: string;
}