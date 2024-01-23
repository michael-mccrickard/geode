<script setup>
    import { ref, computed, onMounted, onUnmounted, onUpdated, reactive, toRefs } from 'vue'
    import $ from 'jquery'

    const props = defineProps({
        obj: {
            type: Object,
            required: true
        },
        positionX: {
            type: Number
        },
        positionY: {
            type: Number
        },
        savedX: {
            type: Number
        },
        savedY: {
            type: Number
        },
        savedColor: {
            type: String
        },
        savedFontSize: {
            type: Number
        },
        savedFontName: {
            type: String
        },
        savedRotate: {
            type: Number
        }
    })

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

    const posX = ref(0)
    const posY = ref(0)

//make this toggle the button and the state
    function changeContainerPosition(str) {
        
        if (str === 'mouse') {
            operationChangeToMove = true;  //lets us trap the initial prop change which jerks 
                                    //the container to wherever the mouse was last clicked
             setOperation('changeContainerPositionWithMouse')
        }

        if (str === 'keys') {
             setOperation('changeContainerPositionWithArrowKeys')
        }

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

    const arrColors =  ["white","red", "green", "blue","yellow","orange","purple","brown", "pink", "violet","cyan","lightgray","gray","darkgray"]
    const colorIndex = ref(0)

    function changeColorIndex(_val) {
        setMode("editOverlay")
        setOperation("changeColorIndex")

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

    function getColor() {
        return arrColors[colorIndex.value];
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

    //Edit operations: changeContent, changeFontSize, changeFontColor, changeContainerSize, changeContainerPositionWithMouse, changeContainerPositionWithArrowKeys, changeContainerRotation
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

    function getStyleObject() {
        var windowHeight = window.innerHeight;

        if (props.savedBaseHeight) windowHeight = savedBaseHeight;

        var textColor

        if (initialDraw) {
            posX.value = props.savedX
            posY.value = props.savedY
            textColor = props.savedColor
            fontSize.value = props.savedFontSize
            rotate.value = props.savedRotate
            initialDraw = false
        }
        else {

            textColor = getColor()  

            if (operation.value === 'changeContainerPositionWithMouse') {

                if (!operationChangeToMove) {  //trap the first call which tends to jerk the container unexpectedly
                                                //to the last place the mouse was clicked
                    posX.value = props.positionX
                    posY.value = props.positionY  
                }
                else {
                    operationChangeToMove = false
                }

            }
            else {
                if (operation.value !== 'changeContainerPositionWithArrowKeys') {
                    posX.value = lastX
                    posY.value = lastY  
                }       
            }
        }

        lastX = posX.value
        lastY = posY.value

        return {
            top: posY.value + "vh",
            left: posX.value + "vh",
            fontSize: fontSize.value + "vh",
            rotate: rotate.value + "deg",
            color: textColor
        }
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

            const index = arrFontNames.indexOf(props.savedFontName)

            if (index !== undefined) fontIndex.value = index

            return props.savedFontName + " headline selectedOverlay"
        }
        return arrFonts[fontIndex.value] + " headline selectedOverlay"
    }


</script>


<template>
    <div>
        <div :id="getDivID()" :class="getClassList()" :style="getStyleObject()">
            <span>{{props.obj.text}} </span>
        </div>


    <div class="editoverlay-div">
            <span id="btnOverlay" :class="getHeaderClass('editOverlay')">OVERLAY</span>
            <button @click="changeContent()" :class="getEditButtonClass('changeContent')">CONTENT</button> 
            <button @click="changeFontIndex(1)" :class="getEditButtonClass('changeFontIndex')">CHANGE FONT</button>
            <button @click="changeColorIndex(1)" :class="getEditButtonClass('changeColorIndex')">FONT COLOR</button>
            <button id="btnChangeFontSize" @click="changeFontSize(0)" :class="getEditButtonClass('changeFontSize')">FONT SIZE</button>

            <hr>

            <span id="btnContainer" :class="getHeaderClass('editContainer')">CONTAINER</span>
            <button @click="changeContainerPosition('mouse')" :class="getEditButtonClass('changeContainerPositionWithMouse')">MOVE (Mouse)</button>
            <button @click="changeContainerPosition('keys')" :class="getEditButtonClass('changeContainerPositionWithArrowKeys')">MOVE (Arrow keys)</button>
            <button @click="changeContainerRotate(0)" :class="getEditButtonClass('changeContainerRotate')">ROTATE</button> 
            <button id="btnChangeContainerSize" @click="changeContainerSize(0)" :class="getEditButtonClass('changeContainerSize')"> SIZE</button>

            <hr>
                
        </div>

    </div>
</template>
