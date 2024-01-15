function resizeSlabs(element, fs) {

    // Add the slabtexted classname to the body to initiate the styling of
    // the injected spans
    $("body").addClass("slabtexted");

    var $this = $(element)

    var parentWidth = $this.width()

    // Sanity check to prevent infinite loop
    if (parentWidth == 0) {
        return;
    };
console.log("parentwidth is " + parentWidth)



    var self                = this,
        words               = String($.trim($this.text())).replace(/\s{2,}/g, " ").split(" "),
        origFontSize        = null,
        idealCharPerLine    = null

        if(settings.minCharsPerLine && words.join(" ").length < settings.minCharsPerLine) {
            return;
        };

    if(settings.forceNewCharCount || fs != origFontSize) {

        origFontSize = fs;

        const precheck = Math.floor(parentWidth / (origFontSize * settings.fontRatio))

        if (!precheck) {
            console.log("failed precheck")
            return;
        }


        var newCharPerLine      = Math.min(60, Math.floor(parentWidth / (origFontSize * settings.fontRatio))),
            wordIndex           = 0,
            lineText            = [],
            preText             = "",
            postText            = "",
            finalText           = "",
            lineLength,
            slice,
            preDiff,
            postDiff;

            if(newCharPerLine != 0 && newCharPerLine != idealCharPerLine) {
                idealCharPerLine = newCharPerLine;

                while (wordIndex < words.length) {

                    postText = "";

                    // build two strings (preText and postText) word by word, with one
                    // string always one word behind the other, until
                    // the length of one string is less than the ideal number of characters
                    // per line, while the length of the other is greater than that ideal
                    while (postText.length < idealCharPerLine) {
                        preText   = postText;
                        postText += words[wordIndex] + " ";
                        if(++wordIndex >= words.length) {
                            break;
                        };
                    };

                    // This bit hacks in a minimum characters per line test
                    // on the last line
                    if(settings.minCharsPerLine) {
                        slice = words.slice(wordIndex).join(" ");
                        if(slice.length < settings.minCharsPerLine) {
                            postText += slice;
                            preText = postText;
                            wordIndex = words.length + 2;
                        };
                    };

                    // calculate the character difference between the two strings and the
                    // ideal number of characters per line
                    preDiff  = idealCharPerLine - preText.length;
                    postDiff = postText.length - idealCharPerLine;

                    // if the smaller string is closer to the length of the ideal than
                    // the longer string, and doesn’t contain less than minCharsPerLine
                    // characters, then use that one for the line
                    if((preDiff < postDiff) && (preText.length >= (settings.minCharsPerLine || 2))) {
                        finalText = preText;
                        wordIndex--;
                    // otherwise, use the longer string for the line
                    } else {
                        finalText = postText;
                    };

                    lineLength = $.trim(finalText).length;

                    // HTML-escape the text
                    finalText = $('<div/>').text(finalText).html()

                    // Wrap ampersands in spans with class `amp` for specific styling
                    if(settings.wrapAmpersand) {
                        finalText = finalText.replace(/&amp;/g, '<span class="amp">&amp;</span>');
                    };

                    finalText = $.trim(finalText);

                    lineText.push('<span class="slabtext slabtext-linesize-' + Math.floor(lineLength / 10) + ' slabtext-linelength-' + lineLength + '">' + finalText + "</span>");
                
                };  //(while wordIndex < words.length) 

                $this.html(lineText.join(" "));

            }; //if(newCharPerLine != 0 && newCharPerLine != idealCharPerLine) 

        } 
        else {

        // We only need the font-size for the resize-to-fit functionality
        // if not injecting the spans
        origFontSize = fs;

    };  //end of if((settings.forceNewCharCount || fs != origFontSize))

    $("span.slabtext", $this).each(function() {

        console.log("inside each")

        //let objStyle = {};

        var $span = $(this),
            innerText = $span.text(),
            wordSpacing = innerText.split(" ").length > 1,
            diff,
            ratio,
            fontSize

        ratio = parentWidth / $span.width()

        fontSize = parseFloat(this.style.fontSize) || fs

        //$span.css("font-size", Math.min((fontSize * ratio).toFixed(settings.precision), settings.maxFontSize) + "px")

        //objStyle.fontSize = Math.min((fontSize * ratio).toFixed(settings.precision), settings.maxFontSize)

        // Do we still have space to try to fill or crop
        diff = !!settings.postTweak ? parentWidth - $span.width() : false

        if(diff) {
            $span.css((wordSpacing ? 'word' : 'letter') + '-spacing', (diff / (wordSpacing ? innerText.split(" ").length - 1 : innerText.length)).toFixed(settings.precision) + "px")
        
            //var strKey = (wordSpacing ? 'word' : 'letter') + '-spacing'
        
            //objStyle[strKey] = (diff / (wordSpacing ? innerText.split(" ").length - 1 : innerText.length)).toFixed(settings.precision) + "px"

            //objStyle.propName = strKey
        
        };

//console.log("here's the style we have computed in resizeSlabs")
//console.log(objStyle)
        //return objStyle
});

$this.addClass("slabtextdone");

}  //end function resizeSlabs