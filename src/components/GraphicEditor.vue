

<script setup>
    import InflatedText from "./InflatedText.vue";
    import { ref, computed, onMounted, onUnmounted, onUpdated, reactive, toRefs } from 'vue'
    import { getCurrentInstance } from 'vue'

    import { useMouse } from '../mouse.js'
    import $ from 'jquery'

    const instance = getCurrentInstance();

    //const props = defineProps(['fontclass','positionX','positionY','appmode','savedHeight'])

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
        setMode("editContainer")
        setOperation('changeContainerPosition')
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
console.log("createNewDoc")
        posX.value = 0
        posY.value = 0
        rotation.value = 0
        savedBaseHeight = 0;

        editOptions = []
        
        filename.value = "./mag_" + _txt + "_notext.png"
        mode.value = "editOverlay"
        operation.value = "changeContent"

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
    let freezeContainerSizeFlag = false
    let freezeFontSizeFlag = false

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

    function getHeadlineStyle() {

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
        }

        return obj;
    }



    //*******************************************************************************//
    //
    //                    MODE AND OPERATIONS
    //
    //******************************************************************************* */

    //mode: startup, selectBG, selectEditMode, editOverlay, editContainer  or playback
    const mode = ref("startup");

    function inEditMode() {

        const arrEditModes = ['selectEditMode','editOverlay', 'editContainer']

        if (arrEditModes.indexOf(mode.value) !== -1) return true;

        return false;
    }

    function setMode(str) {
        mode.value = str

        if (str === 'editContainer') {
$("div#bigone").addClass("showBox")
        }
        else {
$("div#bigone").removeClass("showBox")
        }
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

    let editOptions = []

    function getEditOptions(){
        return editOptions
    }


    function hasOption(opt) {
        const index = editOptions.indexOf(opt)

        if (index === -1) {
            return false
        }
        else {
            return true
        }
    }

    function setOption(value, str, id, disableID) {

        if (value === true) {

            console.log("adding " + str)
            addEditOption(str)

            $("button#" + id).removeClass("unselected")  
            $("button#" + id).addClass("selected")

            $("button#" + disableID).removeClass("selected")  
            $("button#" + disableID).addClass("unselected")

            document.getElementById(disableID).disabled = true
                
        }
        if (value === false) {
        
            console.log("removing " + str)
            removeEditOption(str)
            
            $("button#" + id).removeClass("selected")  
            $("button#" + id).addClass("unselected")

            $("button#" + disableID).removeClass("selected")  
            $("button#" + disableID).addClass("unselected")

            document.getElementById(disableID).disabled = false
        }
    }

    function toggleOption(str, id, disableID) {

        if (editOptions.indexOf(str) === -1) {
            setOption(true, str, id, disableID)
        }
        else {
            setOption(false, str, id, disableID)
        }
    }

    function removeEditOption(opt) {
        const index = editOptions.indexOf(opt)
        if (index === -1) return

        editOptions.splice(index, 1);
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
            freezeFontSizeFlag: hasOption("freezeFontSize"),
            freezeContainerSizeFlag: hasOption("freezeContainerSize")
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
        freezeFontSizeFlag = data.freezeFontSizeFlag
        freezeContainerSizeFlag = data.freezeContainerSizeFlag
        
        mode.value = 'playback'
        operation.value = 'playback'
    }

    function configureUI() {

        setOption(freezeFontSizeFlag, 'freezeFontSize', 'btnFreezeFontSize', 'btnChangeFontSize')
        setOption(freezeContainerSizeFlag, 'freezeContainerSize', 'btnFreezeContainerSize', 'btnChangeContainerSize')

        console.log("editOptions in configureUI: " + editOptions)
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
            <span id="testSpan">{{ textValue }}</span>
        </div>
    </div>

    <div v-if = "inEditMode()" class="container">
        <img :src= "filename" @click="clickEventOnImg"/>
        <InflatedText :textVal="textValue" 
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
                    :editOptions = "getEditOptions()"
                    :updateKey = "getUpdateKey()"


        ></InflatedText>
    </div>
    
    <div :class="getMenuBarStyle()">
<!--         <div v-if="isMode('selectEditMode')">   
            <button @click="setMode('editOverlay')" class="editButton unselected">OVERLAY</button> 
            <button @click="setMode('editContainer')" class="editButton unselected">CONTAINER</button>
            <button @click="exitEditMode()" class="editButton unselected">EXIT</button>   
        </div> -->

        <hr style="margin-top: 5px;">

        <div v-if="inEditMode()">
            <span id="btnOverlay" :class="getHeaderClass('editOverlay')">OVERLAY</span>
            <button @click="changeContent()" :class="getEditButtonClass('changeContent')">CONTENT</button> 
            <button @click="changeFontIndex(1)" :class="getEditButtonClass('changeFontIndex')">CHANGE FONT</button>
            <button @click="changeColorIndex(1)" :class="getEditButtonClass('changeColorIndex')">FONT COLOR</button>
            <button id="btnChangeFontSize" @click="changeFontSize(0)" :class="getEditButtonClass('changeFontSize')">FONT SIZE</button>
            <button id="btnFreezeFontSize" class="editButton unselected" @click="toggleOption('freezeFontSize', 'btnFreezeFontSize', 'btnChangeFontSize')">FREEZE FONT SIZE</button> 

            <hr>

            <span id="btnContainer" :class="getHeaderClass('editContainer')">CONTAINER</span>
            <button @click="changeContainerPosition()" :class="getEditButtonClass('changeContainerPosition')">MOVE</button>
            <button @click="changeContainerRotation(0)" :class="getEditButtonClass('changeContainerRotation')">ROTATE</button> 
            <button id="btnChangeContainerSize" @click="changeContainerSize(0)" :class="getEditButtonClass('changeContainerSize')"> SIZE</button>
            <button id="btnFreezeContainerSize" class="editButton unselected" @click="toggleOption('freezeContainerSize', 'btnFreezeContainerSize','btnChangeContainerSize')">FREEZE CONTAINER SIZE</button> 

            <hr>

            <button @click="saveData()" class="controlButton unselected">SAVE</button> 
            <button @click="exitEditMode()" class="controlButton unselected">EXIT</button>  
                
        </div>
        <div v-if="isMode('startup')">
            <button @click="loadNationButtons()" class="controlButton unselected">NEW</button> 
            <button @click="loadData()" class="controlButton unselected">LOAD</button>   
        </div>

        <div v-if="isMode('selectBG')">
            <div v-for="item in arrSource" :key="item.id">
                <button @click="createNewDocument(item.name)"> {{ item.name }}</button>
            </div>
        </div>

        <div v-if="isMode('playback')">
            <button @click="exitPlaybackMode()">EXIT</button>    
            <button @click="editLoadedDocument()">EDIT</button>  
        </div>
        
    </div>
        
    </div>
</template>

