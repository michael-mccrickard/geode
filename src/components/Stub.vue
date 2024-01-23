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

        if (props.savedBaseHeight) windowHeight = savedBaseHeight;

        return {
            top: props.obj.positionY + "vh",
            left: props.obj.positionX + "vh",
            fontSize: props.obj.fontSize + "vh",
            color: props.obj.color,
            rotate: props.obj.rotate + "deg"
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
