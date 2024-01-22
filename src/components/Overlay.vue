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

            if (operation.value == 'changeContainerRotation') {
                if (key == "ArrowRight" || key == "ArrowUp") changeContainerRotation(1);
                if (key == "ArrowLeft" || key == "ArrowDown") changeContainerRotation(-1);
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
            fontSize: props.obj.fontSize,
            rotate: props.obj.rotate,
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

</script>


<template>
    <div>
        <div :id="getDivID()" class="headline selectedOverlay" :style="getStyleObject()">
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
            <button @click="changeContainerRotation(0)" :class="getEditButtonClass('changeContainerRotation')">ROTATE</button> 
            <button id="btnChangeContainerSize" @click="changeContainerSize(0)" :class="getEditButtonClass('changeContainerSize')"> SIZE</button>

            <hr>
                
        </div>

    </div>
</template>
