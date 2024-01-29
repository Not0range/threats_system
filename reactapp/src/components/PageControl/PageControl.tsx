import './PageControl.css';

export default function PageControl({ page, max, setPage }: IProps) {
    return (
        <div className="page-control-container">
            <PageButton
                text='<'
                onClick={() => setPage && page > 1 && setPage(page - 1)}
            />
            {`${page}/${max}`}
            <PageButton
                text='>'
                onClick={() => setPage && page < max && setPage(page + 1)}
            />
        </div>
    )
}

function PageButton({ text, onClick }: IButtonProps) {
    return (
        <div
            className='page-control-button'
            onClick={onClick}
        >
            {text}
        </div>
    )
}

interface IProps {
    page: number;
    max: number;
    setPage?: (value: number) => void;
}

interface IButtonProps {
    text: string;
    onClick?: () => void;
}