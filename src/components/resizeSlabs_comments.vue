<script setup>
    import { ref, onMounted, onUnmounted, onUpdated,  } from 'vue'
    import { computed, getCurrentInstance, reactive } from 'vue'
    import $ from 'jquery'
    
    const props = defineProps({
        appmode: String,
        fontclass: String,
        positionX: Number,
        positionY: Number,
        savedHeight: Number,
        textColor: String,
        text: String, 
        rotation: String,
        fs: String    
    })

    const instance = getCurrentInstance();

    onMounted(() => {
        setTimeout(() => {
            resizeSlabs("div#bigone", 36)();
        }, 100);
    })

    onUpdated(() => {
        resizeSlabs("div#bigone", 36)
    })



    const settings = {
            // The ratio used when calculating the characters per line
            // (parent width / (font-size * fontRatio)).
            "fontRatio"             : 0.78,
            // Always recalculate the characters per line, not just when the
            // font-size changes? Defaults to true (CPU intensive)
            "forceNewCharCount"     : true,
            // Do we wrap ampersands in <span class="amp">
            "wrapAmpersand"         : true,
            // Under what pixel width do we remove the slabtext styling?
            "headerBreakpoint"      : null,
            "viewportBreakpoint"    : null,
            // Don't attach a resize event
            "noResizeEvent"         : false,
            // By many milliseconds do we throttle the resize event
            "resizeThrottleTime"    : 300,
            // The maximum pixel font size the script can set
            "maxFontSize"           : 999,
            // Do we try to tweak the letter-spacing or word-spacing?
            "postTweak"             : true,
            // Decimal precision to use when setting CSS values
            "precision"             : 3,
            // The min num of chars a line has to contain
            "minCharsPerLine"       : 0,
            // Callback function fired after the headline is redrawn
            "onRender"              : null
    }

    function resizeSlabs(element) {

    // Add the slabtexted classname to the body to initiate the styling of
    // the injected spans
    $("body").addClass("slabtexted");

    var $this = $(element)

    var parentWidth = $this.width()

    var fs;


    // Sanity check to prevent infinite loop
    if (parentWidth == 0) {
        return false;
    };

    console.log( $("span.slabtext", $this).length)
    console.log($this.text())
    console.log(String($.trim($this.text())).replace(/\s{2,}/g, " ").split(" "))
    //var $this               = $(this),
    var     self                = this,
        keepSpans           = $("span.slabtext", $this).length,
        words               = keepSpans ? [] : String($.trim($this.text())).replace(/\s{2,}/g, " ").split(" "),
        origFontSize        = null,
        idealCharPerLine    = null,
        headLink            = $this.find("a:first").attr("href") || $this.attr("href"),
        linkTitle           = headLink ? $this.find("a:first").attr("title") : "";

        if(!keepSpans && settings.minCharsPerLine && words.join(" ").length < settings.minCharsPerLine) {
            return false;
        };
        console.log("origFontSize 1 is " + origFontSize)
    console.log(words)

    fs = 16;

    if(!keepSpans && (settings.forceNewCharCount || fs != origFontSize)) {

        origFontSize = fs;
    console.log("parentWidth is " + parentWidth)
    console.log("origFontSize 2 is " + origFontSize)
    console.log("settings.fontRatio is " + settings.fontRatio)
    console.log("formula next")
    const precheck = Math.floor(parentWidth / (origFontSize * settings.fontRatio))

    if (!precheck) {
    console.log("failed precheck")
    return false;
    }
    console.log(precheck)



        var newCharPerLine      = Math.min(60, Math.floor(parentWidth / (origFontSize * settings.fontRatio))),
            wordIndex           = 0,
            lineText            = [],
            counter             = 0,
            preText             = "",
            postText            = "",
            finalText           = "",
            lineLength,
            slice,
            preDiff,
            postDiff;

    console.log("newCharPerLine=" + newCharPerLine + "idealCharPerLine= " + idealCharPerLine)

        if(newCharPerLine != 0 && newCharPerLine != idealCharPerLine) {
            idealCharPerLine = newCharPerLine;

    console.log("wordIndex is " + wordIndex)
    console.log("words.length is " + words.length)

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
            // If we have a headLink, add it back just inside our target, around all the slabText spans
            if(headLink) {
                $this.wrapInner('<a href="' + headLink + '" ' + (linkTitle ? 'title="' + linkTitle + '" ' : '') + '/>');
            };
        };
        } else {
        // We only need the font-size for the resize-to-fit functionality
        // if not injecting the spans
        origFontSize = fs;

    };  //end of if(!keepSpans && (settings.forceNewCharCount || fs != origFontSize))

    $("span.slabtext", $this).each(function() {

            var $span = $(this),
                innerText = $span.text(),
                wordSpacing = innerText.split(" ").length > 1,
                diff,
                ratio,
                fontSize;

            ratio = parentWidth / $span.width();


            fontSize = parseFloat(this.style.fontSize) || fs;

            var windowHeight = window.innerHeight;

            if (props.appmode === 'playback') windowHeight = props.savedHeight;

            const str = "{'color': '" + props.textColor + "', 'rotate': '" + props.rotation + "', 'top':'" + (props.positionY / windowHeight * 100) + "%', 'left': '" +  (props.positionX / windowHeight * 100)  + "%'}"
    //console.log(str)
    //console.log($this)
            $this.css("color", props.textColor)
            $this.css("rotate", props.rotation)
            $this.css("top", (props.positionY / windowHeight * 100) + "%")
            $this.css("left", (props.positionX / windowHeight * 100) + "%")

            $span.css("font-size", Math.min((fontSize * ratio).toFixed(settings.precision), settings.maxFontSize) + "px");

            // Do we still have space to try to fill or crop
            diff = !!settings.postTweak ? parentWidth - $span.width() : false;

            if(diff) {
                $span.css((wordSpacing ? 'word' : 'letter') + '-spacing', (diff / (wordSpacing ? innerText.split(" ").length - 1 : innerText.length)).toFixed(settings.precision) + "px");
            };
        });

        $this.addClass("slabtextdone");

        return true;

    };//end function resizeSlabs 

</script>


<template>
    <div id="bigone" :class="fontclass">
        <span>{{ props.text }}</span>
    </div>
</template>
