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
        textVal: String, 
        rotation: String, 
        fontName: String
    })

    const instance = getCurrentInstance();

    let spanElement = null;

    onMounted(() => {
        setTimeout(() => {
            resizeSlabs("div#bigone", 16, props.textVal);
        }, 100);
    })

    onUpdated(() => {

        if (spanElement) {
            //spanElement.css("fontSize", 16)
            //spanElement.text( props.textVal )
        }

        setTimeout(() => {
            resizeSlabs("div#bigone", 16, props.textVal);
        }, 100);
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

    function resizeSlabs(element, _fs, _text) {

        // Add the slabtexted classname to the body to initiate the styling of
        // the injected spans
        $("body").addClass("slabtexted");

        var $this = $(element)
        var fs = _fs;
        var parentWidth = $this.width()

        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
context.font = "16px Gasoek One"

console.log("text is " + props.textVal)

        var spanWidth2 = (context.measureText(props.textVal).width)



        // Sanity check to prevent infinite loop
        if (parentWidth == 0) {
            return false;
        };

 //parentWidth = parentWidth2

    $("span.slabtext", $this).each(function() {

        var $span = $(this),
            innerText = $span.text(),
            wordSpacing = innerText.split(" ").length > 1,
            diff,
            ratio,
            fontSize;
console.log ("innerText = " + innerText)

        spanElement = $span;

console.log("calcing ratio  with parentWidth = " + parentWidth + " and spanWidth2 is " + spanWidth2)


        ratio = parentWidth / spanWidth2;//$span.width()
console.log("ratio is " + ratio)

console.log("this.style.fontsize = " + this.style.fontSize)



        //fontSize = parseFloat(this.style.fontSize) || fs;

fontSize = fs;

        var windowHeight = window.innerHeight;

        if (props.appmode === 'playback') windowHeight = props.savedHeight;

        //const str = "{'color': '" + props.textColor + "', 'rotate': '" + props.rotation + "', 'top':'" + (props.positionY / windowHeight * 100) + "%', 'left': '" +  (props.positionX / windowHeight * 100)  + "%'}"
        //console.log(str)
        //console.log($this)
        $this.css("color", props.textColor)
        $this.css("rotate", props.rotation)
        $this.css("top", (props.positionY / windowHeight * 100) + "%")
        $this.css("left", (props.positionX / windowHeight * 100) + "%")

console.log("fontSize b4 is " + fontSize)
console.log("ratio is " + ratio)


        $span.css("fontSize", Math.min((fontSize * ratio).toFixed(settings.precision), settings.maxFontSize) + "px");
console.log("fontSize after is " + fontSize * ratio)

        // Do we still have space to try to fill or crop
        diff = !!settings.postTweak ? parentWidth - $span.width() : false;

        if(diff) {
           // $span.css((wordSpacing ? 'word' : 'letter') + '-spacing', (diff / (wordSpacing ? innerText.split(" ").length - 1 : innerText.length)).toFixed(settings.precision) + "px");
        };
    });

    $this.addClass("slabtextdone");

    return true;

};//end function resizeSlabs 

</script>


<template>
    <div id="bigone" :class="fontclass">
        <span class="slabtext">{{ props.textVal }}</span>
    </div>
</template>
