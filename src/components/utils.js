export function convertPixelsToHeightPercentage(str) {

    let val = str.substr(0, str.length - 1);

    return (convertToHeightPercentage(val))
}

export function convertToHeightPercentage(val) {
    var windowHeight = window.innerHeight;
        return parseInt(val) / windowHeight * 100
}

export function convertHeightPercentageToPixels(val) {
    var windowHeight = window.innerHeight;
     return (parseFloat(val) / 100) * windowHeight
}



