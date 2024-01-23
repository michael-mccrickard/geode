<script setup>
        function loadDocuments() {
            const documents = JSON.parse(localStorage.getItem('my-documents') || '[]');
            return documents;
        }
       function saveDocuments() {
            localStorage.setItem('my-documents', JSON.stringify(this.documents));
        }
        function selectDocument(docId) {
            this.selectedDocument = this.documents.find(doc => doc.id === docId);
        }
        function selectOverlay(overlayId) {
            if (this.selectedDocument) {
                this.selectedOverlay = this.selectedDocument.overlays.find(overlay => overlay.id === overlayId);
            }
        }
        function deleteDocument(docId) {
            this.documents = this.documents.filter(doc => doc.id !== docId);
            this.saveDocuments();
        }
        function deleteOverlay(overlayId) {
            if (this.selectedDocument) {
                this.selectedDocument.overlays = this.selectedDocument.overlays.filter(overlay => overlay.id !== overlayId);
            }
            this.saveDocuments();
        }


var clist = []

var icounter = -1

    function makeList() {

        icounter++

        if (icounter == arrColors.length) {
            console.log(clist)
            return;
        }

        $("div#" + props.obj.ID).css("color", arrColors[icounter])

        setTimeout(getRGBandRestart, 500)
    }

    function getRGBandRestart() {
        console.log("getRGBandRestart")

        console.log($("div#" + props.obj.ID).css("color" ))

        clist.push($("div#" + props.obj.ID).css("color" ))

        makeList()

    }


/*         if (operation.value === 'changeContainerPositionWithMouse') {

if (!operationChangeToMove) {  //trap the first call which tends to jerk the container unexpectedly
                                //to the last place the mouse was clicked
console.log("updating positionx and y to saved values")
    positionX = props.obj.posX
    positionY = props.obj.posY
}
else {
    operationChangeToMove = false

console.log("updating positionx and y to converted mouse values")
    positionX = convertToHeightPercentage(posX.value)
    positionY = convertToHeightPercentage(posY.value)      
console.log(positionX)
console.log(positionY)
}

}
else {
if (operation.value !== 'changeContainerPositionWithArrowKeys') {
    positionX = lastX
    positionY = lastY  
}       
}
} */
</script>

<template>

    <div v-if = "fileIsLoaded()" class="container">
        <img :src= "filename" @click="clickEventOnImg"/>
    </div>

    <div v-if = "isMode('editOverlay')" id="editOverlaySpace">
            <Overlay
                :key="'o' + overlayIndex.value"
                :ID="'o' + overlayIndex.value"
                :obj="overlays[overlayIndex.value].obj"
                :positionX="overlays[overlayIndex.value].positionX"
                :positionY="overlays[overlayIndex.value].positionY"
            />
    </div>

    <div  v-else id="stubOverlaySpace">
            <Stub 
                v-for="(obj, index) in overlays"
                :key="'o' + index"
                :ID="'o' + index"
                :obj="obj"
                :positionX="obj.positionX" 
                :positionY="obj.positionY"
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