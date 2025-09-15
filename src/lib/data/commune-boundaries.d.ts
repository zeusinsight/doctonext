export interface CommuneBoundary {
    name: string
    type: "Polygon" | "MultiPolygon"
    coordinates: number[][][] | number[][][][]
}

export interface CommuneBoundaries {
    [code: string]: CommuneBoundary
}
