<script setup>
    import { ref, onMounted, onUnmounted, onUpdated,  } from 'vue'
    import { computed, getCurrentInstance, reactive } from 'vue'
    import $ from 'jquery'
    import { resizeSlabs } from './resizeSlabs.js'

    const props = defineProps({

    })

/*     fontclass: String,
        positionX: Number,
        positionY: Number,
        savedHeight: Number,
        textColor: String,
        textVal: String, 
        rotation: String, 
        fontName: String,
        fontSize: String,
        fontSizeChange: Number,
        containerWidth: Number */


    function getStyleObject() {
    
        return {
            textVal: props.textVal,
            positionX: props.positionX,
            positionY: props.positionY,
            textColor: props.textColor,
            rotation: props.rotation, 
            savedBaseHeight: props.savedBaseHeight,
            fontSize: props.fontSize,
            fontSizeChange: props.fontSizeChange,
            containerWidth: props.containerWidth
        }
    }

    onMounted(() => {

        const obj = getStyleObject()
    })

    onUpdated(() => {

        const obj = getStyleObject()

    })

</script>


<template>
    <div id="bigone" :class="fontclass">
        <span>{{ props.textVal }}</span>
    </div>

    <div v-if="inEditMode()">
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

            <button @click="saveData()" class="controlButton unselected">SAVE</button> 
            <button @click="exitEditMode()" class="controlButton unselected">EXIT</button>  
                
        </div>
</template>
