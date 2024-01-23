<script setup>
    import { ref, computed, onMounted, onUnmounted, onUpdated, reactive, toRefs } from 'vue'
    import $ from 'jquery'
    import { useMouse } from '../mouse.js'

    const props = defineProps({
        obj: {
            type: Object,
            required: true
        },
        filename: {
            type: String
        }
    })


    //clicking the mouse on the image moves the headline
    const { x, y } = useMouse()

    const posX = ref(0)
    const posY = ref(0)

    function clickEventOnImg() {
        posX.value = x.value;
        posY.value = y.value;
    }

    function getPosX() {
        return convertToHeightPercentage(posX.value)
    }

    function getPosY() {
        return convertToHeightPercentage(posY.value)
    }

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

    })

    function handleArrowKey(event) {
        const key = event.key

        var amount = 1;

        if (key.startsWith('Arrow')) {

            if (operation.value == 'changeContainerPositionWithArrowKeys') {

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

            if (operation.value == 'changeFontIndex') {
                if (key == "ArrowRight" || key == "ArrowUp") changeFontIndex(1);
                if (key == "ArrowLeft" || key == "ArrowDown")  changeFontIndex(-1); 
            }
            if (operation.value == 'changeFontSize') {
                if (key == "ArrowRight" || key == "ArrowUp") changeFontSize(fontSizeInc);
                if (key == "ArrowLeft" || key == "ArrowDown") changeFontSize(fontSizeInc * -1);
            }
            if (operation.value == 'changeContainerSize') {
                if (key == "ArrowRight" || key == "ArrowUp") changeContainerSize(containerWidthInc);
                if (key == "ArrowLeft" || key == "ArrowDown") changeContainerSize(containerWidthInc * -1);
            }

            if (operation.value == 'changeColorIndex') {
                if (key == "ArrowRight" || key == "ArrowUp") changeColorIndex(1);
                if (key == "ArrowLeft" || key == "ArrowDown") changeColorIndex(-1);
            }

            if (operation.value == 'changeContainerRotate') {
                if (key == "ArrowRight" || key == "ArrowUp") changeContainerRotate(1);
                if (key == "ArrowLeft" || key == "ArrowDown") changeContainerRotate(-1);
            }
            if (operation.value == 'changeContent') {
                if (key == "ArrowRight" || key == "ArrowUp") changeContent(1);
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

    //const posX = ref(0)
    //const posY = ref(0)

//make this toggle the button and the state
    function changeContainerPosition() {
        setOperation('changeContainerPosition')
        setMode("editContainer")
    }

    //*******************************************************************************//
    //
    //                    ROTATION
    //
    //******************************************************************************* */

    //rotate
    const rotate = ref(0)

    function changeContainerRotate(_val) {
        setMode("editContainer")
        setOperation("changeContainerRotate")
        rotate.value += _val
    }

    function getRotate() {
       return rotate.value + "deg"
    }

//*******************************************************************************//
    //
    //                    FONTS
    //
    //******************************************************************************* */

    const defaultFontSize = 16
    const arrFonts =  ["gasoek", "koulen", "lilita","molle","paytone","playball","staat", "alkatara", "squada"]
    const arrFontNames =  ["Gasoek One", "Koulen", "Lilita One","Molle","Paytone One","Playball","Staatliches", "Alkatara", "Squada One"]
    const fontIndex = ref(0)
    const fontSizeChange = ref(0)
    const fontSizeInc =  0.25
    const fontSize = ref(defaultFontSize)  //not currently used

    function getFontClass() { 
        return "headline " + arrFonts[fontIndex.value]
    }

    function getFontName() { 
        return arrFontNames[fontIndex.value]
    }

    function getFontSizeChangeValue() {
        return fontSizeChange.value
    }

    function getFormattedFontSizeValue() {
        return fontSize.value + "vh"
    }

    function calcThisFontSizeValueFromPixels(val) {

        let windowHeight = window.innerHeight

        let fontSizeInPixels = val.slice(0, -2);

        if (fontSizeInPixels) {
            return fontSizeInPixels / windowHeight * 100
        }
        return null

    }

    function changeFontIndex(_val) {
        setMode("editOverlay")
        setOperation("changeFontIndex")

        var tmp = fontIndex.value += _val

        if (tmp === arrFonts.length) {
            fontIndex.value = 0;
            return;
        }
        if (tmp === -1) {
            fontIndex.value = arrFonts.length - 1;
            return;
        }

        fontIndex.value = tmp;
    }

    function changeFontSize(_val) {
        setMode("editOverlay")
        setOperation("changeFontSize")
        fontSize.value += _val;
    }


    //*******************************************************************************//
    //
    //                    COLORS
    //
    //******************************************************************************* */

   //const arrColors =  ["white","red", "green", "blue","yellow","orange","purple","brown", "pink", "violet","cyan","lightgray","gray","darkgray"]

    const arrColors = [
    "rgb(255, 255, 255)",
    "rgb(255, 0, 0)",
    "rgb(0, 128, 0)",
    "rgb(0, 0, 255)",
    "rgb(255, 255, 0)",
    "rgb(255, 165, 0)",
    "rgb(128, 0, 128)",
    "rgb(165, 42, 42)",
    "rgb(255, 192, 203)",
    "rgb(238, 130, 238)",
    "rgb(0, 255, 255)",
    "rgb(211, 211, 211)",
    "rgb(128, 128, 128)",
    "rgb(169, 169, 169)"
]

    const colorIndex = ref(0)

    function changeColorIndex(_val) {
        setMode("editOverlay")
        setOperation("changeColorIndex")

        var tmp = colorIndex.value += _val

        if (tmp === arrColors.length) {
            colorIndex.value = 0;
            return;
        }
        if (tmp === -1) {
            colorIndex.value = arrColors.length - 1;
            return;
        }

        colorIndex.value = tmp;
    }

    function getColor() {
        return arrColors[colorIndex.value];
    }

    function syncColorIndex() {

        //Need to fix this, incoming value on prop.obj is an rgb color value
        //not synced properly here and this is causing unwanted color changes in getStyleObject()

        const index = arrColors.indexOf(props.obj.color)
console.log("color index synced to " + index)
        if (index !== -1) colorIndex.value = index

    }

    //*******************************************************************************//
    //
    //                    MODE AND OPERATIONS
    //
    //******************************************************************************* */

    const mode = ref("")

    function setMode(str) {
        mode.value = str
    }

    //Edit operations: changeContent, changeFontSize, changeFontColor, changeContainerSize, changeContainerPosition, changeContainerRotation
    const operation = ref("")

    function setOperation(_str) {
        operation.value = _str;
    }


    //*******************************************************************************//
    //
    //                    STYLING
    //
    //******************************************************************************* */
    let initialDraw = true
    let initialFontDraw = true
    var lastX, lastY
    let operationChangeToMove = false

/*     posX.value = props.savedX
            posY.value = props.savedY
            textColor = props.savedColor
            fontSize.value = props.savedFontSize
            rotate.value = props.savedRotate
            initialDraw = false */
        

    function getStyleObject() {
        var windowHeight = window.innerHeight;

        var positionX, positionY

        if (props.savedBaseHeight) windowHeight = savedBaseHeight;

        var color

        if (initialDraw) {
            //these are stored as vh units and getPosX() and getPosY() do the conversion automatically
            //so we have to unconvert these here
            posX.value = convertHeightPercentageToPixels(props.obj.posX)
            posY.value = convertHeightPercentageToPixels(props.obj.posY)
            color = props.obj.color
            syncColorIndex()
            
            fontSize.value = props.obj.fontSize
            //font face gets synced in first call to getClassList()

            rotate.value = props.obj.rotate
            initialDraw = false
        }
        else {

            color = getColor()  

            lastX = getPosX()
            lastY = getPosY()
        }

        return {
            top: getPosY() + "vh",
            left: getPosX() + "vh",
            fontSize: fontSize.value + "vh",
            rotate: rotate.value + "deg",
            color: color
        }
    }

    function convertHeightPercentageToPixels(val) {
        var windowHeight = window.innerHeight;
         return (parseFloat(val) / 100) * windowHeight
    }

    function convertToHeightPercentage(val) {
        var windowHeight = window.innerHeight;
         return parseInt(val) / windowHeight * 100
    }

    function getEditButtonClass(_str) {
        var _class = "";
        _str === operation.value ? _class = "editButton selected" : _class = "editButton unselected"
        return _class
    }

    function getHeaderClass(_str) {
        var _class = "";
        _str === mode.value ? _class = "header selectedHeader" : _class = "header unselectedHeader"
        return _class
    }

    function getDivID() {
        return props.obj.ID
    }

    function getClassList(ele) {
        if (initialFontDraw) {
            initialFontDraw = false

            const index = arrFonts.indexOf(props.obj.fontName)

            if (index !== -1) fontIndex.value = index

            return props.obj.fontName + " headline selectedOverlay"
        }
        return arrFonts[fontIndex.value] + " headline selectedOverlay"
    }

</script>


<template>
    <div>
        <div class="container">
            <img :src= "props.filename" @click="clickEventOnImg"/>
        </div>
        <div :id="getDivID()" :class="getClassList()" :style="getStyleObject()" data-colorName="getColorName()">
            <span>{{props.obj.text}} </span>
        </div>


    <div class="editoverlay-div">
            <span id="btnOverlay" :class="getHeaderClass('editOverlay')">OVERLAY</span>
            <button @click="changeContent()" :class="getEditButtonClass('changeContent')">CONTENT</button> 
            <button @click="changeFontIndex(1)" :class="getEditButtonClass('changeFontIndex')">CHANGE FONT</button>
            <button @click="changeColorIndex(1)" :class="getEditButtonClass('changeColorIndex')">FONT COLOR</button>
            <button id="btnChangeFontSize" @click="changeFontSize(0)" :class="getEditButtonClass('changeFontSize')">FONT SIZE</button>
            <button @click="makeList()">TEST</button>
            <hr>

            <span id="btnContainer" :class="getHeaderClass('editContainer')">CONTAINER</span>
            <button @click="changeContainerPosition()" :class="getEditButtonClass('changeContainerPosition')">MOVE (Arrow keys)</button>
            <button @click="changeContainerRotate(0)" :class="getEditButtonClass('changeContainerRotate')">ROTATE</button> 
            <button id="btnChangeContainerSize" @click="changeContainerSize(0)" :class="getEditButtonClass('changeContainerSize')"> SIZE</button>

            <hr>
                
        </div>

    </div>
</template>
