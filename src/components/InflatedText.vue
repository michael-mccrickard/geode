<script setup>
    import { ref, onMounted, onUnmounted, onUpdated,  } from 'vue'
    import { computed, getCurrentInstance, reactive } from 'vue'
    import $ from 'jquery'
    import { resizeSlabs } from './resizeSlabs.js'

    const props = defineProps({
        appmode: String,
        fontclass: String,
        positionX: Number,
        positionY: Number,
        savedHeight: Number,
        textColor: String,
        textVal: String, 
        rotation: String, 
        fontName: String,
        fontSizeChange: Number,
        containerWidth: Number,
        operation: String,
        editOptions: Array
    })

    function getStyleObject() {
    
        return {
            textVal: props.textVal,
            positionX: props.positionX,
            positionY: props.positionY,
            textColor: props.textColor,
            rotation: props.rotation, 
            savedBaseHeight: props.savedBaseHeight,
            fontSizeChange: props.fontSizeChange,
            containerWidth: props.containerWidth,
            operation: props.operation,
            editOptions: props.editOptions
        }
    }

    function updateMe() {

        var windowHeight = window.innerHeight;
        if (props.savedBaseHeight) windowHeight = props.savedBaseHeight;

        const $ele = $("div#bigone")

        $ele.css("color", props.textColor)
        $ele.css("rotate", props.rotation)
        $ele.css("top", (props.positionY / windowHeight * 100) + "%")
        $ele.css("left", (props.positionX / windowHeight * 100) + "%")
        $ele.css("width", props.containerWidth + "%")
    }

    onMounted(() => {

        const obj = getStyleObject()

        setTimeout(() => {
            resizeSlabs("div#bigone", obj);
        }, 5);

        setTimeout(() => {
            updateMe()
        }, 10);
    })

    onUpdated(() => {

        const obj = getStyleObject()

        setTimeout(() => {
           resizeSlabs("div#bigone", obj);
        }, 5);

        setTimeout(() => {
            updateMe()
        }, 10);
    })

</script>


<template>
    <div id="bigone" :class="fontclass">
        <span>{{ props.textVal }}</span>
    </div>
</template>
