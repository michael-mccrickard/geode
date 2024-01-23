<script setup>
    import { ref, onMounted, onUnmounted, onUpdated} from 'vue'

    const props = defineProps({
        obj: {
            type: Object,
            required: true
        }
    })


    function getStyleObject() {
        var windowHeight = window.innerHeight;

        return {
            top: props.obj.posY + "vh",
            left: props.obj.posX + "vh",
            fontSize: props.obj.fontSize + "vh",
            color: props.obj.color,
            rotate: props.obj.rotate + "deg",
            width: (props.obj.width /100) * windowHeight + "px"
        }
    }

    function getClassList() {
        return props.obj.fontName + " headline stub"
    }

    function getDivID() {
        return props.obj.ID
    }
</script>


<template>
    <div>
        <div :id="getDivID()" :class="getClassList()" :style="getStyleObject()">
            <span>{{ props.obj.text }}</span>
        </div>
    </div>
</template>
