<!--
version '1.0.0'
author 'Jungmi<art@sk.com>'
date '2019-08-07'
maintainer 'Jungmi<art@sk.com>'
copyright 'Copyright 2019, SK Telink CO,LTD All Rights Reserved.'
-->

<template>
    <div>
        <p> {{seconds}} </p>
    </div>
</template>

<script>
export default {
    props: {
        data:{
            type: Number,
        }
    },

    data(){
        return{
            otpTime: 180,
            count: 0,
        }
    },

    methods: {
        timer_loop(){
            this.count++
            if(this.count<180) {
                this.otpTime = this.otpTime-1
                setTimeout(this.timer_loop, 1000)
            }
            else {
                this.$emit('toolate')
            }
        },
    },

    mounted(){
        this.timer_loop()
    },

    computed:{

        seconds(){
            return (this.modifiedDate)
        },

        modifiedDate:function(){
            // return Math.trunc(this.now)
            return Math.trunc(this.otpTime/60) + ' : ' + ('0' + this.otpTime%60).slice(-2);
        }
    }
}
</script>

<style>

</style>