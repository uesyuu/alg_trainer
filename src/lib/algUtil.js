const algUtil = (function() {
    let faceList = ["U", "R", "F", "D", "L", "B"]
    const rotateX = [2, 1, 3, 5, 4, 0]
    const rotateXPrime = [5, 1, 0, 2, 4, 3]
    const rotateX2 = [3, 1, 5, 0, 4, 2]
    const rotateY = [0, 5, 1, 3, 2, 4]
    const rotateYPrime = [0, 2, 4, 3, 5, 1]
    const rotateY2 = [0, 4, 5, 3, 1, 2]
    const rotateZ = [4, 0, 2, 1, 3, 5]
    const rotateZPrime = [1, 3, 2, 4, 0, 5]
    const rotateZ2 = [3, 4, 2, 0, 1, 5]

    const rotate = (faceList, rotateList) => {
        const resultFaceList = [0, 1, 2, 3, 4, 5]
        for (let i = 0; i < 6; i++) {
            resultFaceList[i] = faceList[rotateList[i]]
        }
        return resultFaceList
    }

    const notationToIndex = (notation) => {
        let index
        switch (notation) {
            case "U": {
                index = 0
                break
            }
            case "R": {
                index = 1
                break
            }
            case "F": {
                index = 2
                break
            }
            case "D": {
                index = 3
                break
            }
            case "L": {
                index = 4
                break
            }
            case "B": {
                index = 5
                break
            }
            default: {
                index = 0
                break
            }
        }
        return index
    }

    const makeRotationLessAlg = (alg) => {
        let currentFaceList = [0, 1, 2, 3, 4, 5]
        const scrambleList = alg.split(" ")
        const resultScrambleList = []
        for (let i = 0; i < scrambleList.length; i++) {
            if (scrambleList[i] === "x") {
                currentFaceList = rotate(currentFaceList, rotateX)
            } else if (scrambleList[i] === "x'") {
                currentFaceList = rotate(currentFaceList, rotateXPrime)
            } else if (scrambleList[i] === "x2") {
                currentFaceList = rotate(currentFaceList, rotateX2)
            } else if (scrambleList[i] === "y") {
                currentFaceList = rotate(currentFaceList, rotateY)
            } else if (scrambleList[i] === "y'") {
                currentFaceList = rotate(currentFaceList, rotateYPrime)
            } else if (scrambleList[i] === "y2") {
                currentFaceList = rotate(currentFaceList, rotateY2)
            } else if (scrambleList[i] === "z") {
                currentFaceList = rotate(currentFaceList, rotateZ)
            } else if (scrambleList[i] === "z'") {
                currentFaceList = rotate(currentFaceList, rotateZPrime)
            } else if (scrambleList[i] === "z2") {
                currentFaceList = rotate(currentFaceList, rotateZ2)
            } else {
                const currentNotation = scrambleList[i].split("")
                let resultNotation = ""
                if (currentNotation.length === 1) {
                    resultNotation = faceList[currentFaceList[notationToIndex(currentNotation[0])]]
                } else if (currentNotation.length === 2) {
                    resultNotation = faceList[currentFaceList[notationToIndex(currentNotation[0])]] + currentNotation[1]
                }
                resultScrambleList.push(resultNotation)
            }
        }
        return resultScrambleList.join(" ")
    }

    return {
        makeRotationLessAlg: makeRotationLessAlg
    }
})();

module.exports = algUtil