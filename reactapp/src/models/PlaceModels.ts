export interface DistrictInfo {
    id: number;
    title: string;
    svgTag: string;
    cities: CityInfo[];
}

export interface CityInfo {
    id: number;
    districtId: number;
    title: string;
    svgTag: string;
    microdistricts: MicrodistrictInfo[];
}

export interface MicrodistrictInfo {
    id: number;
    cityId: number;
    title: string;
    svgTag: string;
}