

<script setup>
    import Overlay from "./Overlay.vue";
    import Stub from "./Stub.vue";
    import { convertPixelsToHeightPercentage, convertToHeightPercentage } from './utils.js'
    import { ref } from 'vue'
    import $ from 'jquery'


    //*******************************************************************************//
    //
    //                    DOCUMENTS
    //
    //********************************************************************************/

    const filename = ref("")

    let arrDocuments = []

    const docIndex = ref(-1)

    function getFilename() {
        return filename.value
    }

    function exitNewDocument() {
        saveDocument()
        saveDocuments()
        arrOverlays = []
        mode.value = "startup"
    }

 //Clicking the NEW button initializes these variables and puts us in addOrSelectOverlay mode
    function createNewDocument(_txt) {

        arrOverlays.length = []
        overlayIndex.value = 0

        docIndex.value++

        
        filename.value = "./mag_" + _txt + "_notext.png"
        mode.value = "addOrSelectOverlay"

        docIndex.value  = arrDocuments.length;

        const obj = { filename: filename.value, name: "Document " +  docIndex.value, overlays: []}

        arrDocuments.push( obj )

        //updateKey.value++
    }

    function fileIsLoaded() {
        if (filename.value.length && mode.value !== "editOverlay") {
            return true
        }
        else {
            return false
        }
    }

    function loadDocuments() {
        const arrDocuments = JSON.parse(localStorage.getItem('geode-documents') || '[]');
        return arrDocuments;
    }
    function saveDocuments() {
        localStorage.setItem('geode-documents', JSON.stringify(arrDocuments));
    }

    function saveDocument() {
        //localStorage.setItem('geode-documents', JSON.stringify(documents));
console.log("in saveDocument, docIndex is " + docIndex.value)
        arrDocuments[docIndex.value].overlays  = Array.from(arrOverlays);  //copy it, don't just pass the reference

        console.log(arrDocuments[docIndex.value].overlays)
    }

    function selectDocument(index) {

        docIndex.value= (index )

        arrOverlays = arrDocuments[ index ].overlays

        //selectedDocument = arrDocuments.find(doc => doc.id === docId);

        mode.value = "addOrSelectOverlay"
    }
    function deleteDocument(docId) {
        arrDocuments = arrDocuments.filter(doc => doc.id !== docId);
        saveDocuments();
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

    function loadNationButtons() {
        mode.value = 'selectBG'
    }

    //*******************************************************************************//
    //
    //                    TEXT EDITING
    //
    //********************************************************************************/
    var content

    function changeContent() {
        setMode("editOverlay")
        operation.value = "changeContent"
    }

    function submitContentForm(e) {
        arrOverlays[overlayIndex.value].text = content
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
    const updateKey = ref(0);

    function getUpdateKey() {
        return updateKey.value
    }

    function isOperation(str) {
        if (str === operation.value) return true
        return false
    }

    function setMode(str) {
        mode.value = str
    }

    //Edit operations: changeContent or ""
    const operation = ref("")

    function setOperation(_str) {
        operation.value = _str;
    }

    function exitPlaybackMode() {
        mode.value = "startup"
    }

    function isMode(_str) {
        if (_str === mode.value) return true;
    }

    function getMode() {
        return mode.value
    }

    function getOperation() {
        return operation.value
    }

    //*******************************************************************************//
    //
    //                    DATA SAVE AND LOAD
    //
    //******************************************************************************* */

    function editLoadedDocument() {
        setMode("editOverlay")
        setOperation("")
    }

    var storageIndex = -1;

    function saveDocument2() {
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
    //                    OVERLAYS
    //
    //******************************************************************************* */

    let arrOverlays = []

    const overlayIndex = ref(0)

    let newOverlayCounter = -1

    function createNewOverlay() {
        
        newOverlayCounter = arrOverlays.length

        let obj = {
            text: "Your text here " + newOverlayCounter,
            ID: "o" + newOverlayCounter,
            posX: 0,
            posY: 0,
            fontSize: 10,  //vh units
            fontName: "gasoek",
            rotate: 0,
            color: "rgb(255, 255, 255)",
            width: 100
        }

        arrOverlays.push(obj)

        overlayIndex.value = newOverlayCounter

        mode.value = "editOverlay"
    }

    function getOverlayIndex() {
        return overlayIndex.value
    }

    function exitEditOverlay() {

        mode.value = "addOrSelectOverlay"
    }



    function filteredOverlays() {
        if (mode.value === "addOrSelectOverlay") return arrOverlays;
        return arrOverlays.filter(obj => obj.ID !== "o" + overlayIndex.value)
    }

    function selectOverlay(overlayId) {
        if (selectedDocument) {
            selectedOverlay = selectedDocument.arrOverlays.find(overlay => overlay.id === overlayId);
        }
    }

    function deleteOverlay(overlayId) {
        if (selectedDocument) {
            selectedDocument.overlays = selectedDocument.overlays.filter(overlay => overlay.id !== overlayId);
        }
        this.saveDocuments();
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
        let obj = arrOverlays[overlayIndex.value]

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

    function hasOverlays() {
        return (arrOverlays.length ? true : false)
    }

    function getOverlayText() {
        return arrOverlays[overlayIndex.value].text
    }



    //*******************************************************************************//
    //
    //                    TEMPLATE
    //
    //******************************************************************************* */
    //                :updateKey = "getUpdateKey()"
</script>


<template>
<div>
    <div v-if = "fileIsLoaded()" class="container">
        <img :src= "getFilename()">
    </div>

     <div v-if = "isMode('editOverlay')" id="editOverlaySpace">
            <Overlay
                :key="getOverlayIndex()"
                :obj="arrOverlays[getOverlayIndex()]"
                :filename="getFilename()"

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
            <button @click="loadDocuments()" class="controlButton unselected">LOAD</button>  
            <div v-for="(obj, index) in arrDocuments">
                <button @click="selectDocument(index)"> {{ obj.name }}</button>
            </div> 
        </div>

        <div v-if="isMode('selectBG')">
            <div v-for="item in arrSource" :key="item.id">
                <button @click="createNewDocument(item.name)"> {{ item.name }}</button>
            </div>
        </div>

        <div v-if="isMode('addOrSelectOverlay')">
            <span id="docName">{{ }}</span>
            <button  class="controlButton" @click="createNewOverlay()">+ OVERLAY</button>    
            <button  class="controlButton" @click="exitNewDocument()">EXIT</button>  
            <div v-for="(obj, index) in filteredOverlays()">
                <button @click="doEditOverlay(index)"> {{ obj.text }}</button>
            </div>
        </div>

        <div v-if="isMode('editOverlay')" class="saveOrExitContainer">
            <button v-if="hasOverlays()" class="controlButton" @click="changeContent()">{{ getOverlayText() }}</button> 
            
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
