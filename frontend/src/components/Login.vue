<template>
  <div class="container">

    <h1>Login</h1>

    <div class="login-form">



  </div>



  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Login',
  data () {
    return {
     user: [],

    }
  },

  methods: {

    login(){
      console.log("Running...")
      axios.get('https://jsonplaceholder.typicode.com/users')
      .then((response)=>{
        console.log(response.data);
        this.users = response.data;
        console.log(this.users);
      }).catch((error)=>{
         console.log(error);
      });
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.users-container{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(200px, auto);
  grid-gap: 1em;
}
.users{
margin-top: 1em;
  border: 1px solid black;
  box-shadow: 0em 0em .5em black;
  padding: .5em;
}
.container::before{
  display: none;
}
.container{
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-gap:.5em;
  margin: .2em;
  width: auto;
}
.sidebar-left{
  position: relative;
  text-align: left;
  margin: 2em .2em;
  top: 2em;

}
</style>
