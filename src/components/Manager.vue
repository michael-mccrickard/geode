

<script setup>
    import Overlay from "./Overlay.vue";
    import Stub from "./Stub.vue";

    import { ref, computed, onMounted, onUnmounted, onUpdated, reactive, toRefs } from 'vue'
    import $ from 'jquery'




    //*******************************************************************************//
    //
    //                    DOCUMENT CREATION
    //
    //********************************************************************************/

    const filename = ref("")

    function getFilename() {
        return filename.value
    }

    let doc = {}

 //Clicking the NEW button initializes these variables and puts us in edit mode
    function createNewDocument(_txt) {

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

    function changeContent() {
        setMode("editOverlay")
        operation.value = "changeContent"
    }

    var content

    function submitContentForm(e) {

        console.log( content )

        overlays[overlayIndex.value].text = content

        setOperation("")

        updateKey.value++
    }

    //*******************************************************************************//
    //
    //                    MODE AND OPERATIONS
    //
    //******************************************************************************* */

    //mode: startup, selectBG, selectEditMode, editOverlay, editContainer  or playback
    const mode = ref("startup");


    function isOperation(str) {
        if (str === operation.value) return true
        return false
    }

    function setMode(str) {
        mode.value = str
    }

    function exitEditMode() {
        mode.value = 'startup'
    }

    function loadNationButtons() {
        mode.value = 'selectBG'
    }

    //Edit operations: changeContent or ""
    const operation = ref("")

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
        setOperation("")

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
            posX: 0,
            posY: 0,
            fontSize: 10,  //vh units
            fontName: "gasoek",
            rotate: 0,
            color: "rgb(255, 255, 255)",
            width: 100
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
        if (filename.value.length && mode.value !== "editOverlay") {
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

        obj.posX =  convertPixelsToHeightPercentage( $(ele).css("left" ))
        obj.posY = convertPixelsToHeightPercentage($(ele).css("top" ))
        obj.color = $(ele).css("color" )
        obj.rotate =  parseFloat(getRotateValue(ele))

        obj.fontSize =  convertPixelsToHeightPercentage($(ele).css("font-size" ))
        obj.fontName = getFontClassName(ele)

        obj.width = convertPixelsToHeightPercentage($(ele).css("width" ))

        console.dir(obj)
    }

    function doEditOverlay(int) {
        overlayIndex.value = int;
        mode.value = "editOverlay"
    }



    //*******************************************************************************//
    //
    //                    TEMPLATE
    //
    //******************************************************************************* */
    
</script>


<template>
<div>
    <div v-if = "fileIsLoaded()" class="container">
        <img :src= "getFilename()">
    </div>

     <div v-if = "isMode('editOverlay')" id="editOverlaySpace">
            <Overlay
                :key="getOverlayIndex()"
                :obj="overlays[getOverlayIndex()]"
                :filename="getFilename()"
                :updateKey = "getUpdateKey()"
            />
    </div>

    <div id="stubOverlaySpace" class = "stubContainer">
            <Stub 
                v-for="(obj, index) in filteredOverlays()"
                :key="index"
                :obj="obj"
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
            <button  class="controlButton" @click="createNewOverlay()">+ OVERLAY</button>    
            <button  class="controlButton" @click="exitNewDocument()">EXIT</button>  
            <div v-for="(obj, index) in filteredOverlays()">
                <button @click="doEditOverlay(index)"> {{ obj.text }}</button>
            </div>
        </div>

        <div v-if="isMode('editOverlay')" class="saveOrExitContainer">
            <button class="controlButton" @click="changeContent()">{{ overlays[getOverlayIndex()].text }}</button> 
            
            <form  v-if="isOperation('changeContent')">
                <span>TEXT</span><br>
                <textarea @keydown.enter.prevent="submitContentForm()" class="inputTextArea"
                    v-model="content"
                    type="text"
                    placeholder="Enter your text" 
                /><br><br>
            </form>
            <button class="controlButton" @click="saveOverlay()" >SAVE</button>    
            <button  class="controlButton"  @click="exitEditOverlay()">EXIT</button>  
        </div>

        <div v-if="isMode('playback')">
            <button  class="controlButton" @click="exitPlaybackMode()">EXIT</button>    
            <button  class="controlButton" @click="editLoadedDocument()">EDIT</button>  
        </div>
        
    </div>
</div>
</template>
