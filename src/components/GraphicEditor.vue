<script>

</script>


<script setup>
    import { ref, onMounted, onUnmounted, onUpdated } from 'vue'
    import { useMouse } from '../mouse.js'
    import { computed } from 'vue'
    import $ from 'jquery'

    //*******************************************************************************//
    //
    //                    ARROW KEYS
    //
    //********************************************************************************/

    //The arrow keys are used to nudge the headline, adjust font and fontsize, cycle through text colors and rotate text 

    onMounted(() => {
        document.addEventListener('keydown', handleArrowKey)
    })

    onUnmounted(() => {
        document.removeEventListener('keydown', handleArrowKey)
    })

    onUpdated(() => {
        resizeSlabs("div#bigone");
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
            return;
        };

console.log( $("span.slabtext", $this).length)
console.log($this.text())
console.log(String($.trim($this.text())).replace(/\s{2,}/g, " ").split(" "))
        //var $this               = $(this),
        var     self                = this,
            keepSpans           = $("span.slabtext", $this).length,
            words               = keepSpans ? [] : String($.trim($this.text())).replace(/\s{2,}/g, " ").split(" "),
            origFontSize        = 16,
            idealCharPerLine    = null,
            headLink            = $this.find("a:first").attr("href") || $this.attr("href"),
            linkTitle           = headLink ? $this.find("a:first").attr("title") : "";

            if(!keepSpans && settings.minCharsPerLine && words.join(" ").length < settings.minCharsPerLine) {
                return;
            };
            console.log("origFontSize 1 is " + origFontSize)
console.log(words)


        var grabPixelFontSize = function($this) {
                var dummy = $('<div style="display:block;font-size:1em;margin:0;padding:0;height:auto;line-height:1;border:0;">NEW MEXICO</div>').appendTo($this)
   
                 const emH   = dummy.height();
                 dummy.remove();
 console.log("emH is " + emH)
                 return emH;
            };

        fs = grabPixelFontSize($this);

        if(!keepSpans && (settings.forceNewCharCount || fs != origFontSize)) {

            origFontSize = fs;
console.log("parentWidth is " + parentWidth)
console.log("origFontSize 2 is " + origFontSize)
console.log("settings.fontRatio is " + settings.fontRatio)
console.log("formula next")
const precheck = Math.floor(parentWidth / (origFontSize * settings.fontRatio))

if (!precheck) {
    console.log("failed precheck")
    return;
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
            console.log($("inside each"))

            var $span = $(this),
                innerText = $span.text(),
                wordSpacing = innerText.split(" ").length > 1,
                diff,
                ratio,
                fontSize;

            ratio = parentWidth / $span.width();


            fontSize = parseFloat(this.style.fontSize) || fs;

            $span.css("font-size", Math.min((fontSize * ratio).toFixed(settings.precision), settings.maxFontSize) + "px");

            // Do we still have space to try to fill or crop
            diff = !!settings.postTweak ? parentWidth - $span.width() : false;

            if(diff) {
                $span.css((wordSpacing ? 'word' : 'letter') + '-spacing', (diff / (wordSpacing ? innerText.split(" ").length - 1 : innerText.length)).toFixed(settings.precision) + "px");
            };
        });

        $this.addClass("slabtextdone");

    }  //end function resizeSlabs

    function handleArrowKey(event) {
        const key = event.key

        var amount = 1;

        if (key.startsWith('Arrow')) {

            if (operation.value == 'move') {

                if (event.shiftKey) {
                    amount = 10;
                }
                else {
                    amount = 5;
                }
                if (key == "ArrowUp") posY.value -= amount;
                if (key == "ArrowDown") posY.value += amount;
                if (key == "ArrowRight") posX.value += amount;
                if (key == "ArrowLeft") posX.value -= amount;   
                return;  
            }

            if (operation.value == 'font') {
                if (key == "ArrowRight" || key == "ArrowUp") adjustFontIndex(1);
                if (key == "ArrowLeft" || key == "ArrowDown")  adjustFontIndex(-1); 
            }
            if (operation.value == 'size') {
                if (key == "ArrowRight" || key == "ArrowUp") adjustFontSize(fontSizeInc);
                if (key == "ArrowLeft" || key == "ArrowDown") adjustFontSize(fontSizeInc * -1);
            }

            if (operation.value == 'color') {
                if (key == "ArrowRight" || key == "ArrowUp") adjustColorIndex(1);
                if (key == "ArrowLeft" || key == "ArrowDown") adjustColorIndex(-1);
            }

            if (operation.value == 'rotate') {
                if (key == "ArrowRight" || key == "ArrowUp") adjustTextRotation(1);
                if (key == "ArrowLeft" || key == "ArrowDown") adjustTextRotation(-1);
            }
            if (operation.value == 'changeHeadline') {
                if (key == "ArrowRight" || key == "ArrowUp") changeHeadline(1);
            }
            if (operation.value == 'playback') {
                if (key == "ArrowRight" || key == "ArrowUp") loadData(1);
            }

        }
    }

    //*******************************************************************************//
    //
    //                    MOVE TEXT (ALSO SETS UP ARROW KEY MOVES)
    //
    //********************************************************************************/

    function moveText() {
        setOperation('move')
    }

    //clicking the mouse on the image moves the headline
    const { x, y } = useMouse()

    const posX = ref(0)
    const posY = ref(0)

    function clickEventOnImg() {
        posX.value = x.value;
        posY.value = y.value;
    }


    //*******************************************************************************//
    //
    //                    DOCUMENT CREATION
    //
    //********************************************************************************/

    const filename = ref("None")

 //Clicking the NEW button initializes these variables and puts us in edit mode
    function createNewDocument(_txt) {

        posX.value = 0
        posY.value = 0
        rotation.value = 0
        fontSize.value = 6
        savedBaseHeight = 0;
        
        filename.value = "./mag_" + _txt + "_notext.png"
        mode.value = "edit"
    }

    //*******************************************************************************//
    //
    //                    NATION BUTTONS
    //
    //********************************************************************************/

    //Create the buttons using this array
    const arrSourceNames  = ["Mexico", "Laos", "Brazil", "Cambodia", "Sri Lanka", "Turkmenistan"]

    const arrSource = []

    var i = 0;

    arrSourceNames.forEach(function(_txt) {
        // Create an object
        var obj = {
        name: _txt,
        id: i++,
        }

        // Push the object to the array
        arrSource.push(obj);
    })

   //*******************************************************************************//
    //
    //                    FONTS
    //
    //******************************************************************************* */

    const arrFonts =  ["gasoek", "koulen", "lilita","molle","paytone ","playball","staat", "alkatara", "squada"]
    const fontIndex = ref(0)
    const fontSize = ref(6)
    const fontSizeInc = 0.25

    const getFontClass = computed(() => { 
        return arrFonts[fontIndex.value] + " headline"
    })

    function adjustFontIndex(_val) {
        setOperation("font")

        var tmp = fontIndex.value += _val

        if (tmp === arrFonts.length - 1) {
            fontIndex.value = 0;
            return;
        }
        if (tmp === -1) {
            fontIndex.value = arrFonts.length - 1;
            return;
        }

        fontIndex.value = tmp;
    }

    function adjustFontSize(_val) {
        setOperation("size")

        fontSize.value += _val;
    }

    //*******************************************************************************//
    //
    //                    COLORS
    //
    //******************************************************************************* */

    const arrColors =  ["white","red", "green", "blue","yellow","orange","purple","brown", "pink", "violet","cyan","lightgray","gray","darkgray"]
    const colorIndex = ref(0)

    function adjustColorIndex(_val) {
        setOperation("color")

        var tmp = colorIndex.value += _val

        if (tmp === arrColors.length - 1) {
            colorIndex.value = 0;
            return;
        }
        if (tmp === -1) {
            colorIndex.value = arrColors.length - 1;
            return;
        }

        colorIndex.value = tmp;
    }

    //*******************************************************************************//
    //
    //                    ROTATION
    //
    //******************************************************************************* */

    //rotation
    const rotation = ref(0)
    function rotateText() {
        setOperation("rotate")
    }

    function adjustTextRotation(_val) {
        rotation.value += _val;
    }

    //*******************************************************************************//
    //
    //                    HEADLINE TEXT
    //
    //******************************************************************************* */

    var savedBaseHeight = 0;

    const headlineIndex = ref(0);

    //text value for headline
    const strHeadline = ref(arrSourceNames[0]);

    function changeHeadline() {

        operation.value = "changeHeadline"

        headlineIndex.value++
        
        if (headlineIndex.value === arrSourceNames.length) headlineIndex.value = 0;

        strHeadline.value = arrSourceNames[ headlineIndex.value ] 
    }

    function getTextValue() {
        //return "New Mexico"

        return strHeadline.value
    }

    const getHeadlineStyle = computed(() => { 
        var windowHeight = window.innerHeight;

        if (mode.value === 'playback') windowHeight = savedBaseHeight;

        

        //fontSize: fontSize.value + 'vh',  
        return {
            position: 'absolute',
            top:  (posY.value / windowHeight * 100) + '%',
            left: (posX.value / windowHeight * 100)  + '%',
            width: '100%',
            color: arrColors[ colorIndex.value ],
            transform: 'rotate(' +  rotation.value + 'deg)',
            textTransform: "uppercase",
            color: arrColors[colorIndex.value],
        }
    })

    //*******************************************************************************//
    //
    //                    MODE AND OPERATIONS
    //
    //******************************************************************************* */

    //mode: startup, new, edit or playback
    const mode = ref("startup");

    function exitEditMode() {
        mode.value = 'startup'
    }

    function loadNationButtons() {
        mode.value = 'new'
    }

    //Edit operations: move, font, color, size, rotate
    const operation = ref("move")

    function setOperation(_str) {
        operation.value = _str;
    }

    //Select Mode:  list only the nations, Edit mode: add the edit buttons and the done button, make the bg blue
    function getMenuBarStyle() {
        if (mode.value == 'edit') {
            return "right-justified-div editmode-div"
        }
        else {
            return "right-justified-div"
        }

    }

    function getEditButtonClass(_str) {

        var _class = "";
        _str == operation.value ? _class = "selected" : _class = "unselected"

        return _class
    }

    function exitPlaybackMode() {
        mode.value = "startup"
    }

    function isMode(_str) {

        if (_str === 'startup' && mode.value === 'startup') return true;
        if (_str === 'new' && mode.value === 'new') return true;
        if (_str === 'playback' && mode.value === 'playback') return true;
        if (_str === 'edit' && mode.value === 'edit') return true;

        if (_str === 'editOrPlayback' && (mode.value === 'playback' || mode.value === 'edit')) return true;

    }

    //*******************************************************************************//
    //
    //                    DATA SAVE AND LOAD
    //
    //******************************************************************************* */

    var storageIndex = -1;

    function saveData() {
        var tmp = JSON.stringify({ 

            imgFilename: filename.value,
            text: strHeadline.value, 
            textX: posX.value,
            textY: posY.value,
            size: fontSize.value,
            fontIndex: fontIndex.value,
            colorIndex: colorIndex.value,
            rotation: rotation.value,
            savedBaseHeight: window.innerHeight

        });
        const date = new Date().toJSON()
        var strKey = filename.value + date
        localStorage.setItem(strKey, tmp)

        var data = localStorage.getItem("keys")

        var arrKeys = [];

        if (data) {
            arrKeys = JSON.parse(data)
        }
        arrKeys.push(strKey)
        //console.log(JSON.stringify(arrKeys))
        localStorage.setItem("keys", JSON.stringify(arrKeys))
    }

    function loadData() {

        var arrKeys = [];
        var arrKeys = JSON.parse(localStorage.getItem("keys"))
        storageIndex++

        if (storageIndex === arrKeys.length) storageIndex = 0;

        var data = JSON.parse(localStorage.getItem(arrKeys[storageIndex]))

        //console.log(data)
        filename.value = data.imgFilename
        strHeadline.value = data.text

        posX.value = data.textX
        posY.value = data.textY  
        fontSize.value = data.size
        fontIndex.value = data.fontIndex
        colorIndex.value = data.colorIndex
        rotation.value  = data.rotation
        savedBaseHeight = data.savedBaseHeight    
        
        mode.value = 'playback'
        operation.value = 'playback'
    }

    //*******************************************************************************//
    //
    //                    TEMPLATE
    //
    //******************************************************************************* */
    
</script>



<template>
  <div v-if = "isMode('editOrPlayback')" class="container">
    <img :src= "filename" @click="clickEventOnImg"/>
    <div id="bigone" :class="getFontClass" :style="getHeadlineStyle">
        <span>{{ getTextValue() }}</span>
    </div>
  </div>
  
  <div :class="getMenuBarStyle()">
    <div v-if="isMode('edit')">
        <button @click="changeHeadline()" :class="getEditButtonClass('changeHeadline')">NAME</button> 
        <button @click="moveText" :class="getEditButtonClass('move')">MOVE TEXT</button>
        <button @click="adjustFontIndex(1)" :class="getEditButtonClass('font')">CHANGE FONT</button>
        <button @click="adjustFontSize(fontSizeInc)" :class="getEditButtonClass('size')"> BIGGER</button>
        <button @click="adjustFontSize(fontSizeInc * -1)" :class="getEditButtonClass('size')"> SMALLER</button>
        <button @click="adjustColorIndex(1)" :class="getEditButtonClass('color')">COLOR</button>
        <button @click="rotateText()" :class="getEditButtonClass('rotate')">ROTATE TEXT</button> 
        <button @click="saveData()" class="unselected">SAVE</button> 
        <button @click="exitEditMode()">EXIT</button>      
    </div>
    <div v-if="isMode('startup')">
        <button @click="loadNationButtons()" class="unselected">NEW</button> 
        <button @click="loadData()" class="unselected">LOAD</button>   
    </div>

    <div v-if="isMode('new')">
        <div v-for="item in arrSource" :key="item.id">
            <button @click="createNewDocument(item.name)"> {{ item.name }}</button>
        </div>
    </div>

    <div v-if="isMode('playback')">
        <button @click="exitPlaybackMode()">EXIT</button>    
    </div>
    
  </div>
</template>

