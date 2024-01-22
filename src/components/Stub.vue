<script setup>
    import { ref, onMounted, onUnmounted, onUpdated} from 'vue'

    const props = defineProps({
        obj: {
            type: Object,
            required: true
        },
        positionX: {
            type: Number
        },
        positionY: {
            type: Number
        },
        ID: {
            type: Number
        }
    })


    function getStyleObject() {
        var windowHeight = window.innerHeight;

        if (props.savedBaseHeight) windowHeight = savedBaseHeight;

        return {
            top: (props.positionY) + "vh",
            left: (props.positionX) + "vh",
            fontSize: props.obj.fontSize,
            rotate: props.obj.rotate
        }
    }

    function getDivID() {
        return props.ID
    }
</script>


<template>
    <div>
        <div :id="getDivID()" class="headline stub" :style="getStyleObject()">
            <span>{{ props.obj.text }}</span>
        </div>
    </div>
</template>
