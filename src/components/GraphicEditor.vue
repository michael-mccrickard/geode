

<script setup>
    import InflatedText from "./InflatedText.vue";
    import { ref, computed, onMounted, onUnmounted, onUpdated } from 'vue'
    import { useMouse } from '../mouse.js'
    import $ from 'jquery'

    const props = defineProps(['fontclass','positionX','positionY','appmode','savedHeight'])

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
            if (operation.value == 'fontsize') {
                if (key == "ArrowRight" || key == "ArrowUp") adjustFontSize(fontSizeInc);
                if (key == "ArrowLeft" || key == "ArrowDown") adjustFontSize(fontSizeInc * -1);
            }
            if (operation.value == 'containerwidth') {
                if (key == "ArrowRight" || key == "ArrowUp") adjustContainerWidth(containerWidthInc);
                if (key == "ArrowLeft" || key == "ArrowDown") adjustContainerWidth(containerWidthInc * -1);
            }

            if (operation.value == 'color') {
                if (key == "ArrowRight" || key == "ArrowUp") adjustColorIndex(1);
                if (key == "ArrowLeft" || key == "ArrowDown") adjustColorIndex(-1);
            }

            if (operation.value == 'rotate') {
                if (key == "ArrowRight" || key == "ArrowUp") adjustTextRotation(1);
                if (key == "ArrowLeft" || key == "ArrowDown") adjustTextRotation(-1);
            }
            if (operation.value == 'changecontent') {
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

    function getPosX() {
        return posX.value
    }

    function getPosY() {
        return posY.value
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
        savedBaseHeight = 0;
        
        filename.value = "./mag_" + _txt + "_notext.png"
        mode.value = "selectEditMode"
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

    const defaultFontSize = 16
    const arrFonts =  ["gasoek", "koulen", "lilita","molle","paytone","playball","staat", "alkatara", "squada"]
    const arrFontNames =  ["Gasoek One", "Koulen", "Lilita One","Molle","Paytone One","Playball","Staatliches", "Alkatara", "Squada One"]
    const fontIndex = ref(0)
    const fontSizeChange = ref(0)
    const fontSizeInc =  5//0.25
    const fontSize = ref(defaultFontSize)  //not currently used

    function getFontClass() { 
        return "headline " + arrFonts[fontIndex.value]
    }

    function getFontName() { 
        return arrFontNames[fontIndex.value]
    }

    function getFontSizeChangeValue() {
        return 0 //fontSizeChange.value
    }

    function getFontSizeValue() {

        let windowHeight = window.innerHeight
        if ( savedBaseHeight) windowHeight = savedBaseHeight
        
        let fontSizeInPixels = $("div#bigone").css("font-size")

        fontSizeInPixels = fontSizeInPixels.slice(0, -2);

        fontSize.value = fontSizeInPixels / windowHeight * 100

        return fontSize.value
    }

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
        fontSizeChange.value += _val;
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

    function getColor() {
        return arrColors[colorIndex.value];
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
        rotation.value += _val
    }

    function getRotation() {
       return rotation.value + "deg"
    }

    //*******************************************************************************//
    //
    //                    HEADLINE TEXT
    //
    //******************************************************************************* */

    var savedBaseHeight = 0;
    let headlineIndex = ref(0);
    let containerWidth = ref(100);
    const containerWidthInc = 5

    function getContainerWidth() {
        return containerWidth.value;
    }

    function adjustContainerWidth(_val) {
        setOperation("containerwidth")

        var temp = containerWidth.value
        temp += _val

        containerWidth.value =  Math.min(temp, 100)
    }

    //text value for headline
    const strHeadline = ref(arrSourceNames[0]);

    function changeContent() {

        operation.value = "changecontent"

        headlineIndex.value++
        
        if (headlineIndex.value === arrSourceNames.length) headlineIndex.value = 0;

        strHeadline.value = arrSourceNames[ headlineIndex.value ] 

       //console.log("in changeContent, val is " + strHeadline.value)

    }

    const textValue = computed(() => strHeadline.value);

    function getHeadlineStyle() {

        var windowHeight = window.innerHeight;

        if (savedBaseHeight) windowHeight = savedBaseHeight;

        const obj = {
            color: getColor(),
            rotate: getRotation(),
            top: (posY.value / windowHeight * 100) + "%",
            left: (posX.value / windowHeight * 100) + "%",
            fontSize: fontSize.value + "vh",
            fontSizeChange: fontSizeChange.value          
        }

        return obj;
    }



    //*******************************************************************************//
    //
    //                    MODE AND OPERATIONS
    //
    //******************************************************************************* */

    //mode: startup, new, selectEditMode, editOverlay, editFont, editContainer  or playback
    const mode = ref("startup");

    function inEditMode() {

        const arrEditModes = ['selectEditMode','editOverlay', 'editFont', 'editContainer']

        if (arrEditModes.indexOf(mode.value) !== -1) return true;

        return false;
    }

    function setMode(str) {
        mode.value = str
    }

    function exitEditMode() {
        mode.value = 'startup'
    }

    function exitCurrentEditMode() {
        mode.value = 'selectEditMode'
    }

    function loadNationButtons() {
        mode.value = 'new'
    }

    //Edit operations: changecontent, move, color, rotate, fontsize, containersize
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
        _str === operation.value ? _class = "selected" : _class = "unselected"
        return _class
    }

    function exitPlaybackMode() {
        mode.value = "startup"
    }

    function isMode(_str) {
        if (_str === mode.value) return true;
        if (_str === 'editOrPlayback' && (mode.value === 'playback' || mode.value === 'edit')) return true;
    }

    function getMode() {
        return mode.value
    }

    function getOperation() {
        return operation.value
    }

    let editOptions = []   //freezeFontSize, freezeContainerWidth

    function hasOption(opt) {
        const index = editOptions.indexOf(opt)

        if (index === -1) {
            return false
        }
        else {
            return true
        }
    }

    function toggleOption(str, id) {

        if (editOptions.indexOf(str) === -1) {
            addEditOption(str)
            $("button#" + id).removeClass("unselected")  
            $("button#" + id).addClass("selected")
                    
        }
        else {
            removeEditOption(str)
            $("button#" + id).removeClass("selected")  
            $("button#" + id).addClass("unselected")
        }

        console.log(editOptions)
    }

    function removeEditOption(opt) {
        const index = editOptions.indexOf(opt)

        if (index === 0 && editOptions.length === 1) {
            editOptions = []
            return
        }
        editOptions.slice(0, index).concat(editOptions.slice(index+1))
    }

    function addEditOption(opt) {
        const index = editOptions.indexOf(opt)
        if (index === -1) editOptions.push(opt)

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
            size: getFontSizeValue(),
            fontIndex: fontIndex.value,
            colorIndex: colorIndex.value,
            rotation: rotation.value,
            savedBaseHeight: window.innerHeight,
            containerWidth: containerWidth.value

        });

        //console.log("data saved: " + tmp)

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

        //console.log("data loaded: " +  JSON.stringify(data))

        filename.value = data.imgFilename
        strHeadline.value = data.text

        posX.value = data.textX
        posY.value = data.textY  
        fontSize.value = data.size
        fontIndex.value = data.fontIndex
        colorIndex.value = data.colorIndex
        rotation.value  = data.rotation
        savedBaseHeight = data.savedBaseHeight    
        containerWidth.value = data.containerWidth
        
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
    <div>

    <div v-if = "isMode('playback')" class="container">
        <img :src= "filename" @click="clickEventOnImg"/>
        <div id="bigone" :class="getFontClass()" :style="getHeadlineStyle()">
            <span>{{ textValue }}</span>
        </div>
    </div>

    <div v-if = "inEditMode()" class="container">
        <img :src= "filename" @click="clickEventOnImg"/>
        <InflatedText :textVal="textValue" 
                    :fontclass="getFontClass()" 
                    :fontName="getFontName()"
                    :fontSizeChange = "getFontSizeChangeValue()"
                    :positionX="getPosX()" 
                    :positionY="getPosY()"
                    :textColor="getColor()"
                    :rotation="getRotation()" 
                    :savedBasedHeight="savedBaseHeight"
                    :containerWidth="getContainerWidth()"
                    :operation="getOperation()"

        ></InflatedText>
    </div>
    
    <div :class="getMenuBarStyle()">
        <div v-if="isMode('selectEditMode')">
            <button @click="setMode('editOverlay')">OVERLAY</button> 
            <button @click="setMode('editFont')">FONT</button> 
            <button @click="setMode('editContainer')">CONTAINER</button>
            <button @click="exitEditMode()">EXIT</button>   
        </div>
        <div v-if="isMode('editOverlay')">
            <button @click="changeContent()" :class="getEditButtonClass('changecontent')">CONTENT</button> 
            <button @click="moveText" :class="getEditButtonClass('move')">MOVE</button>
            <button @click="adjustColorIndex(1)" :class="getEditButtonClass('color')">COLOR</button>
            <button @click="rotateText()" :class="getEditButtonClass('rotate')">ROTATE</button> 
            <button @click="exitCurrentEditMode()">EXIT</button>  
        </div>
        <div v-if="isMode('editFont')">       
            <button @click="adjustFontIndex(1)" :class="getEditButtonClass('font')">CHANGE FONT</button>
            <button @click="adjustFontSize(fontSizeInc)" :class="getEditButtonClass('fontsize')"> BIGGER</button>
            <button @click="adjustFontSize(fontSizeInc * -1)" :class="getEditButtonClass('fontsize')"> SMALLER</button>
            <button id="btnFreezeFontSize" @click="toggleOption('freezeFontSize', 'btnFreezeFontSize')">FREEZE</button> 
            <button @click="exitCurrentEditMode()">EXIT</button>  
        </div> 
        <div v-if="isMode('editContainer')"> 
            <button @click="adjustContainerWidth(containerWidthInc * 1)" :class="getEditButtonClass('width')"> &lt; BIGGER  &gt;</button>
            <button @click="adjustContainerWidth(containerWidthInc * -1)" :class="getEditButtonClass('width')"> &gt; SMALLER  &lt;</button>
            <button id="btnFreezeContainerWidth" @click="toggleOption('freezeContainerWidth', 'btnFreezeContainerWidth')">FREEZE</button> 
            <button @click="saveData()" class="unselected">SAVE</button> 
            <button @click="exitCurrentEditMode()">EXIT</button>  
                
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
        
    </div>
</template>

