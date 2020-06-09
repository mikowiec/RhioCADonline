export default function(size: number) {
    const s = size / 2;

    return {
        vertex: [
            -s, -s,  s,
             s, -s,  s,
             s,  s,  s,
            -s,  s,  s,
            -s, -s, -s,
            -s,  s, -s,
             s,  s, -s,
             s, -s, -s,
            -s,  s, -s,
            -s,  s,  s,
             s,  s,  s,
             s,  s, -s,
            -s, -s, -s,
             s, -s, -s,
             s, -s,  s,
            -s, -s,  s,
             s, -s, -s,
             s,  s, -s,
             s,  s,  s,
             s, -s,  s,
            -s, -s, -s,
            -s, -s,  s,
            -s,  s,  s,
            -s,  s, -s
        ],
        index: [
            0, 1, 2,
            0, 2, 3,
            4, 5, 6,
            4, 6, 7,
            8, 9, 10,
            8, 10, 11,
            12, 13, 14,
            12, 14, 15,
            16, 17, 18,
            16, 18, 19,
            20, 21, 22,
            20, 22, 23
        ]
    };
}
