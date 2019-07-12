<template>
    <div>
        <button type="button" class="btn btn-primary" v-on:click="clearItems">clear all</button>

    </div>
</template>

<script>

export default {
    methods: {
        clearItems : function() {
            this.$emit('clear');
            // localStorage.clear();
        }
    }
}
</script>

<style>

</style>
