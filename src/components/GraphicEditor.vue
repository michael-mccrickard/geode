

<script setup>
    import Overlay from "./Overlay.vue";
    import { useMouse } from '../mouse.js'
    import { ref, computed, onMounted, onUnmounted, onUpdated, reactive, toRefs } from 'vue'
    import $ from 'jquery'


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

    let doc = {}

 //Clicking the NEW button initializes these variables and puts us in edit mode
    function createNewDocument(_txt) {
        posX.value = 0
        posY.value = 0
        savedBaseHeight = 0;
        
        filename.value = "./mag_" + _txt + "_notext.png"
        mode.value = "newDocument"
        //operation.value = "changeContent"

doc = { filename: filename.value }

        updateKey.value++
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
        return fontSizeChange.value
    }

    function getFormattedFontSizeValue() {
        return fontSize.value + "vh"
    }

    function calcFontSizeValue() {

        let windowHeight = window.innerHeight
        if ( savedBaseHeight) windowHeight = savedBaseHeight
        
        let fontSizeInPixels = $("div#bigone").css("font-size")

        if (fontSizeInPixels) {

            fontSizeInPixels = fontSizeInPixels.slice(0, -2);

console.log("fontSizeInPixels is " + fontSizeInPixels)

            fontSize.value = fontSizeInPixels / windowHeight * 100

            return fontSize.value
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
        fontSizeChange.value += _val;
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
    //                    ROTATION
    //
    //******************************************************************************* */

    //rotation
    const rotation = ref(0)

    function changeContainerRotation(_val) {
        setMode("editContainer")
        setOperation("changeContainerRotation")
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

    function changeContainerSize(_val) {
        setMode("editContainer")
        setOperation("changeContainerSize")

        var temp = containerWidth.value
        temp += _val

        containerWidth.value =  Math.min(temp, 100)
    }

    //text value for headline
    const strHeadline = ref(arrSourceNames[0]);

    function changeContent() {
        setMode("editOverlay")
        operation.value = "changeContent"

        headlineIndex.value++
        
        if (headlineIndex.value === arrSourceNames.length) headlineIndex.value = 0;

        strHeadline.value = arrSourceNames[ headlineIndex.value ] 

       //console.log("in changeContent, val is " + strHeadline.value)

    }

    const textValue = computed(() => strHeadline.value);

    function getOverlayData() {

        const obj = {
            text: "Your text here"
        }

        return obj;
    }

/*    

        var windowHeight = window.innerHeight;

        if (savedBaseHeight) windowHeight = savedBaseHeight;

const obj = {
            color: getColor(),
            rotate: getRotation(),
            top: (posY.value / windowHeight * 100) + "%",
            left: (posX.value / windowHeight * 100) + "%",
            fontSize: fontSize.value + "vh",
            fontSizeChange: fontSizeChange.value,
            width: containerWidth.value + "%"          
        } */

    //*******************************************************************************//
    //
    //                    MODE AND OPERATIONS
    //
    //******************************************************************************* */

    //mode: startup, selectBG, selectEditMode, editOverlay, editContainer  or playback
    const mode = ref("startup");

    function inEditMode() {

        const arrEditModes = ['newDocument','editDocument']

        if (arrEditModes.indexOf(mode.value) !== -1) return true;

        return false;
    }

    function setMode(str) {
        mode.value = str

/*         if (str === 'editContainer') {
$("div#bigone").addClass("showBox")
        }
        else {
$("div#bigone").removeClass("showBox")
        } */
    }

    function exitEditMode() {
        mode.value = 'startup'
    }

    function loadNationButtons() {
        mode.value = 'selectBG'
    }

    //Edit operations: changeContent, changeFontSize, changeFontColor, changeContainerSize, changeContainerPosition, changeContainerRotation
    const operation = ref("changeContent")

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
        _str === operation.value ? _class = "editButton selected" : _class = "editButton unselected"
        return _class
    }

    function getHeaderClass(_str) {
        var _class = "";
        _str === mode.value ? _class = "header selectedHeader" : _class = "header unselectedHeader"
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

    const updateKey = ref(0);

    function getUpdateKey() {
        return updateKey.value
    }

    

    //*******************************************************************************//
    //
    //                    DATA SAVE AND LOAD
    //
    //******************************************************************************* */

    function editLoadedDocument() {
        setMode("editOverlay")
        setOperation("changeContent")

        setTimeout(() => {
            configureUI()
        }, 100);

        setTimeout(() => {
            updateKey.value++
        }, 200);

    }

    var storageIndex = -1;

    function saveData() {
        var tmp = JSON.stringify({ 

            imgFilename: filename.value,
            text: strHeadline.value, 
            textX: posX.value,
            textY: posY.value,
            size: calcFontSizeValue(),
            fontIndex: fontIndex.value,
            colorIndex: colorIndex.value,
            rotation: rotation.value,
            savedBaseHeight: window.innerHeight,
            containerWidth: containerWidth.value,
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

    function exitNewDocument() {
        mode.value = "startup"
    }

    let overlays = []

    function createNewOverlay() {
        let obj = {
            text: "Your text here",
        }
        
        overlays.push(obj)

        mode.value = "editDocument"
    }
    
</script>



<template>
    <div>

    <div v-if = "isMode('playback')" class="container">
        <img :src= "filename" @click="clickEventOnImg"/>


    </div>

    <div v-if = "inEditMode()" class="container">
        <img :src= "filename" @click="clickEventOnImg"/>

        <Overlay 
            v-for="(obj, index) in overlays"
            :key="'o' + index"
            :obj="obj"
            :positionX="getPosX()" 
            :positionY="getPosY()"
        />
    </div>
    
    <div :class="getMenuBarStyle()">
<!--         <div v-if="isMode('selectEditMode')">   
            <button @click="setMode('editOverlay')" class="editButton unselected">OVERLAY</button> 
            <button @click="setMode('editContainer')" class="editButton unselected">CONTAINER</button>
            <button @click="exitEditMode()" class="editButton unselected">EXIT</button>   
        </div> -->

        <hr style="margin-top: 5px;">


        <div v-if="isMode('startup')">
            <button @click="loadNationButtons()" class="controlButton unselected">NEW</button> 
            <button @click="loadData()" class="controlButton unselected">LOAD</button>   
        </div>

        <div v-if="isMode('selectBG')">
            <div v-for="item in arrSource" :key="item.id">
                <button @click="createNewDocument(item.name)"> {{ item.name }}</button>
            </div>
        </div>

        <div v-if="isMode('newDocument')">
            <button @click="createNewOverlay()">+ OVERLAY</button>    
            <button @click="exitNewDocument()">EXIT</button>  
        </div>

        <div v-if="isMode('playback')">
            <button @click="exitPlaybackMode()">EXIT</button>    
            <button @click="editLoadedDocument()">EDIT</button>  
        </div>
        
    </div>
        
    </div>
</template>

<!-- :textVal="textValue" 
                    :fontclass="getFontClass()" 
                    :fontName="getFontName()"
                    :fontSize="getFormattedFontSizeValue()"
                    :fontSizeChange = "getFontSizeChangeValue()"
                    :positionX="getPosX()" 
                    :positionY="getPosY()"
                    :textColor="getColor()"
                    :rotation="getRotation()" 
                    :savedBasedHeight="savedBaseHeight"
                    :containerWidth="getContainerWidth()"
                    :operation="getOperation()"
                    :updateKey = "getUpdateKey()" -->
