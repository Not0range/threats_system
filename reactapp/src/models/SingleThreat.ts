import { ThreatType } from "./ThreatType";

export interface SingleThreat {
    id: number;
    type: ThreatType;
    dateTime: Date;
    place: PlaceInfo;
    source?: SourceInfo;
}

interface PlaceInfo {
    mictodistrictId: number;
    microdistrictTitle: string;
    cityId: number;
    cityTitle: string;
    districtId: number;
    districtTitle: string;
}

interface SourceInfo {
    id: number;
    name?: string;
    phone?: string;
    address?: string;
}