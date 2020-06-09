export default function(size: number) {
    const s = size / 2;

    return {
        vertex: [
            -s, -s, -s,
             s, -s, -s,
             s,  s, -s,
            -s,  s, -s,
            -s, -s,  s,
             s, -s,  s,
             s,  s,  s,
            -s,  s,  s
        ],
        index: [
            1, 5, 0,
            0, 5, 4,
            6, 2, 7,
            7, 2, 3,
            3, 0, 7,
            7, 0, 4,
            7, 4, 5,
            6, 7, 5,
            6, 5, 2,
            2, 5, 1,
            1, 0, 2,
            0, 3, 2
        ]
    };
}
