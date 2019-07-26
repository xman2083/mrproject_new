<template>
<div>
 <h1>{{this.$store.state.user.user_name}}님 안녕하세요!</h1>
 <button>Submit</button>
</div>
</template>


<script>
import bus from '../utils/bus.js';

export default {
    data() {
        return {
            
        };
    },

}
     

</script>