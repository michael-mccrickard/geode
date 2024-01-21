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
            type: String
        }
    })


    function getStyleObject() {
        
        return {
            left: props.positionX + "px",
            top: props.positionY+ "px"
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
