

<script setup>
    import Overlay from "./Overlay.vue";
    import Stub from "./Stub.vue";
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

    const filename = ref("")

    let doc = {}

 //Clicking the NEW button initializes these variables and puts us in edit mode
    function createNewDocument(_txt) {
        posX.value = 0
        posY.value = 0
        savedBaseHeight = 0;

        overlays = []
        overlayIndex.value = 0
        
        filename.value = "./mag_" + _txt + "_notext.png"
        mode.value = "addOrSelectOverlay"

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



    function setMode(str) {
        mode.value = str
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



    function exitNewDocument() {
        mode.value = "startup"
    }

    let overlays = []

    const overlayIndex = ref(0)

    let counter = -1

    function createNewOverlay() {
        
        counter++

        let obj = {
            text: "Your text here " + counter,
            ID: "o" + counter,
            positionX: 0,
            positionY: 0,
            fontSize: 10,  //vh units
            fontName: "gasoek",
            rotate: 0,
            textColor: "white"
        }
        
        overlays.push(obj)

        overlayIndex.value = counter

        mode.value = "editOverlay"
    }

    function getOverlayIndex() {
        return overlayIndex.value
    }

    function exitEditOverlay() {

        mode.value = "addOrSelectOverlay"
    }

    function fileIsLoaded() {
        if (filename.value.length) {
            return true
        }
        else {
            return false
        }

    }

    function filteredOverlays() {
        if (mode.value === "addOrSelectOverlay") return overlays;
        return overlays.filter(obj => obj.ID !== "o" + overlayIndex.value)
    }

    function loadDocuments() {
        const documents = JSON.parse(localStorage.getItem('geode-documents') || '[]');
        return documents;
    }
    function saveDocuments() {
        localStorage.setItem('geode-documents', JSON.stringify(documents));
    }
    function selectDocument(docId) {
        selectedDocument = documents.find(doc => doc.id === docId);
    }
    function selectOverlay(overlayId) {
        if (selectedDocument) {
            selectedOverlay = selectedDocument.overlays.find(overlay => overlay.id === overlayId);
        }
    }
    function deleteDocument(docId) {
        documents = documents.filter(doc => doc.id !== docId);
        saveDocuments();
    }
    function deleteOverlay(overlayId) {
        if (selectedDocument) {
            selectedDocument.overlays = selectedDocument.overlays.filter(overlay => overlay.id !== overlayId);
        }
        this.saveDocuments();
    }



    function convertPixelsToHeightPercentage(str) {

        let val = str.substr(0, str.length - 1);

        return (convertToHeightPercentage(val))
    }

    function convertToHeightPercentage(val) {
        var windowHeight = window.innerHeight;

        //if (props.savedBaseHeight) windowHeight = savedBaseHeight;
            return parseInt(val) / windowHeight * 100
    }

    function getFontClassName(ele) {

        var classList = $(ele).attr("class")
console.log(classList)
        return classList.split(' ')[0]; 
    }

    function getRotateValue(ele)  {
        let val = $(ele).css("rotate")

        if (val === 'none') return val

        return val.substr(0, val.length - 3)
    }
    

    function saveOverlay() {
        let obj = overlays[overlayIndex.value]

        const ele = "div#" + obj.ID

        obj.positionX =  convertPixelsToHeightPercentage( $(ele).css("left" ))
        obj.positionY = convertPixelsToHeightPercentage($(ele).css("top" ))
        obj.textColor= $(ele).css("color" )
        obj.rotate =  parseFloat(getRotateValue(ele))

        obj.fontSize =  convertPixelsToHeightPercentage($(ele).css("font-size" ))

        obj.fontName = getFontClassName(ele)

        console.dir(obj)
    }

    function doEditOverlay(int) {
        overlayIndex.value = int;
        mode.value = "editOverlay"
    }

    function getOverlayPositionX() {
        const obj = overlays[overlayIndex.value]

        return convertToHeightPercentage(getPosX() )
    }

    function getOverlayPositionY() {
        const obj = overlays[overlayIndex.value]
        
        return convertToHeightPercentage(getPosY() )
    }

    //*******************************************************************************//
    //
    //                    TEMPLATE
    //
    //******************************************************************************* */
    
</script>


<template>

    <div v-if = "fileIsLoaded()" class="container">
        <img :src= "filename" @click="clickEventOnImg"/>
    </div>

     <div v-if = "isMode('editOverlay')" id="editOverlaySpace">
            <Overlay
                :key="getOverlayIndex()"
                :obj="overlays[getOverlayIndex()]"
                :positionX="getOverlayPositionX()" 
                :positionY="getOverlayPositionY()" 
                :savedX="overlays[getOverlayIndex()].positionX"
                :savedY="overlays[getOverlayIndex()].positionY"
                :savedColor="overlays[getOverlayIndex()].textColor"
                :savedFontSize="overlays[getOverlayIndex()].fontSize"
                :savedFontName="overlays[getOverlayIndex()].fontName"
                :savedRotate="overlays[getOverlayIndex()].rotate"
            />
    </div>

    <div id="stubOverlaySpace">
            <Stub 
                v-for="(obj, index) in filteredOverlays()"
                :key="index"
                :obj="obj"
                :positionX="obj.positionX" 
                :positionY="obj.positionY"
                :textColor ="obj.textColor"
                :fontName="obj.fontName"
                :rotate="obj.rotate"
            />
    </div>

    <div class="right-justified-div">

        <div v-if="isMode('startup')">
            <button @click="loadNationButtons()" class="controlButton unselected">NEW</button> 
            <button @click="loadData()" class="controlButton unselected">LOAD</button>   
        </div>

        <div v-if="isMode('selectBG')">
            <div v-for="item in arrSource" :key="item.id">
                <button @click="createNewDocument(item.name)"> {{ item.name }}</button>
            </div>
        </div>

        <div v-if="isMode('addOrSelectOverlay')">
            <button @click="createNewOverlay()">+ OVERLAY</button>    
            <button @click="exitNewDocument()">EXIT</button>  
            <div v-for="(obj, index) in filteredOverlays()">
                <button @click="doEditOverlay(index)"> {{ obj.text }}</button>
            </div>
        </div>

        <div v-if="isMode('editOverlay')" class="saveOrExitContainer">
            <button @click="saveOverlay()" >SAVE</button>    
            <button @click="exitEditOverlay()">EXIT</button>  
        </div>

        <div v-if="isMode('playback')">
            <button @click="exitPlaybackMode()">EXIT</button>    
            <button @click="editLoadedDocument()">EDIT</button>  
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
