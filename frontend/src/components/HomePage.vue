<template>
  <div class="container">
    <div class="sidebar sidebar-left">
      <h1>Services from a lean entreprenuer, find on hireme.com</h1>
    </div>

    <div class="users-group">
    <h1>Recent Providers</h1>
    <input type="text" v-model="searchQuery" class="form-control" placeholder="Enter location or industry to filter results">
    <div class="users-container">

  <div v-for="user in filteredUsers" class="users">
    <img src="../assets/image.jpg" class="user-image">
    <h3>{{user.name}} </h3>
    <hr />
    <p><strong>Title</strong> {{user.email}} </p>
<p><strong>State</strong> {{user.address.city}} </p>
<p><strong>Location: Lat - </strong> {{user.address.geo.lat}}, <strong>Lon - </strong>{{user.address.geo.lng}} </p>

  </div>
  </div>
    </div>

    <div class="sidebar sidebar-right login">
      <div class="login-bar">
      <router-link to="/register" class="btn btn-primary form-control">Join us</router-link>
      <p>
        <router-link to="/login" class="btn btn-primary form-control">Login</router-link>
    </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Homepage',
  data () {
    return {
     users: [],
     image: "./assets/logo.png",
     searchQuery: ''
    }
  },

  methods: {

    getUsers(){
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

  created: function(){
    console.log('created...');
    this.getUsers();
  },

  computed: {
    filteredUsers: function(){
      var self = this
      return self.users.filter(function(user){
     return user.name.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !==-1 ||  user.address.city.toLowerCase().indexOf(self.searchQuery.toLowerCase()) !==-1   })
    }
  }
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
   text-shadow:0 0 1px black;
  font-size: 4em;


}

.login-bar{
position: relative;
top: 15em;

}

.login-bar .btn{
  margin-bottom: 2em;
  width: 15vw;
height: 5vw;
line-height: 2em;
background-color: white;
color: #1d65a6;
font-size: 2em;
border-radius: 3em;
box-shadow: 0 0 .2em #f2a104;
}

.login-bar .btn:hover{
background-color: #72a6c0;
color: white;
box-shadow: 0 0 .3em black;
}

.users-group h1{
  margin-bottom: .5em;
  text-shadow:0 0 1px black;
  font-size: 4em;

}


</style>
