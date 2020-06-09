export default function(size: number) {
    const s = size / 2;

    return {
        vertex: [
            -s, 0, -s,
             s, 0, -s,
             s, 0,  s,
            -s, 0,  s
        ],
        index: [
            0, 3, 2,
            2, 1, 0
        ]
    };
}
