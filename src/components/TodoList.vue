<template>
    <div>
        <transition-group tag="ul" name="todo">
            <li v-for="(todoItem,index) in todolist" v-bind:key="index">
                <span>{{ todoItem }}</span>
                <button v-on:click="removeTodoItem(todoItem,index)">remove</button>
            </li>
        </transition-group>
         
    </div>
</template>

<script>
export default {
    props: ['todolist'],
    // data() {
    //         return {
    //             todoItems: [],
    //         };
    //     },
    methods: {
        // //브라우저 저장소의 데이터 삭제 
        // fetchTodoItmes: function () {
        //     for (var i = 0; i < localStorage.length; i++){
        //         var item = localStorage.key(i);
        //         this.todoItems.push(item);
        //     }
        // },
        
        removeTodoItem: function(todo,index) {
            console.log("deleted",todo,index);
            this.$emit("remove",todo,index);
            // this.todoItems.splice(index,1);      //화면에서만 삭제됨 스토리지에서는 잔존     
            // localStorage.removeItem(todo);
        },
    },
    //컴포넌트가 생성되자마자 실행되는 로직 
    // created: function(){
    //     this.fetchTodoItmes();
    // },
};
</script>

<style>

.todo-enter-active, .todo-leave-active {
  transition: all 1s;
}
.todo-enter, .todo-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
