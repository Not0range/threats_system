export interface Stats {
    key: string;
    values: KeyValuePair[];
}

export interface KeyValuePair {
    key: string;
    value: number;
}
export interface KeyValueLimits {
    key: string;
    value: number;
    limit: number;
}