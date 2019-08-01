<template>
<div>
 <h1>{{this.$store.state.user.user_name}}님 안녕하세요!</h1>

    <div id="test">
    <h1>blog test</h1>
    <div v-for="blog in blogs" class="show-blogs">
        <h2> {{blog.id}} </h2>
        <article> {{blog.title}} </article>
    </div>
    </div>

</div>

</template>


<script>
import bus from '../utils/bus.js';

export default {
    data() {
        return {
            blogs: []
        };
    },
    methods : {

    },

    created() {
        this.$http.get('https://jsonplaceholder.typicode.com/posts')
                  .then(function(data){
        this.blogs = data.body.slice(0,10);  
                  })
    }
}
     

</script>

<style>
#show-blogs {
    max-width: 800px;
    margin: 0 auto;
}

.test {
    padding:20px;
    margin: 20px 0;
    box-sizing:border-box;
    background: #eee;
}
</style>