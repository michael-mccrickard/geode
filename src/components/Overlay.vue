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
        }
    })

    //Reactive vars to track changes to overlay

    const mode = ref("editOverlay")

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

const operation = ref("")

function handleArrowKey(event) {
    const key = event.key

    var amount = 1;

    if (key.startsWith('Arrow')) {

        if (operation.value == 'changeContainerPosition') {

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

function changeContainerPosition() {
    //setMode("editContainer")
    //setOperation('changeContainerPosition')
}

let initialDraw = true

function getStyleObject() {
    var windowHeight = window.innerHeight;

    if (props.savedBaseHeight) windowHeight = savedBaseHeight;

    var posY, posX

    if (initialDraw) {
        posX = props.savedX
        posY = props.savedY
        initialDraw = false
    }
    else {
        posX = props.positionX
        posY = props.positionY       
    }
    return {
        top: posY + "vh",
        left: posX + "vh",
        fontSize: props.obj.fontSize,
        rotate: props.obj.rotate
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
            <button @click="changeContainerPosition()" :class="getEditButtonClass('changeContainerPosition')">MOVE</button>
            <button @click="changeContainerRotation(0)" :class="getEditButtonClass('changeContainerRotation')">ROTATE</button> 
            <button id="btnChangeContainerSize" @click="changeContainerSize(0)" :class="getEditButtonClass('changeContainerSize')"> SIZE</button>

            <hr>
                
        </div>

    </div>
</template>
