<template>
  <div class="container">

    <h1>Register</h1>

    <div class="register-form">
      <form enctype="multipart/form-data" novalidate >
      <div class="form-group">
    <label for="firstname" >First Name </label>  <input type="text" v-model="user.firstname" class="form-control">
      </div>

      <div class="form-group">
    <label for="lastname" >Last Name </label>  <input type="text" v-model="user.lastname" class="form-control">
      </div>

      <div class="form-group">
    <label for="email" >Email </label>  <input type="email" v-model="user.email" class="form-control">
      </div>


    <div class="form-group">
    <label for="phonenumber" >Phone number </label>  <input type="phone" v-model="user.phonenumber" class="form-control">
      </div>


      <div class="form-group">
    <label for="password" >Password </label>  <input type="password" v-model="user.password" class="form-control">
      </div>

<div class="form-group">
    <label for="profilepic" >Phone number </label>  <input type="file" v-on:change="uploadPicture" class="form-control">
      </div>


      <button class="btn btn-primary" @click="register">Register</button>
      </form>
    </div>



    </div>








</template>

<script>
import axios from "axios";
export default {
  name: "Register",
  data() {
    return {
      user: {
        firstname: "",
        lastname: "",
        phonenumber: "",
        email: "",
        profilePicture: "",
        password: ""
      }
    };
  },

  methods: {
    register() {
    let  form = new FormData();
    form.append('firstname',this.user.firstname);
     form.append('lastname',this.user.lastname);
      form.append('email',this.user.email);
       form.append('profilePicture',this.user.profilePicture);
        form.append('passsword',this.user.password);
         form.append('phonenumber',this.user.phonenumber);

      axios
        .post("http://localhost:3000/register", form)
        .then(response => {

        })
        .catch(error => {
          console.log(error);
        });
    },

    uploadPicture(event){
      this.user.profilePicture = event.target.files[0] || event.datatransfer.files[0];

    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.register-form {
  max-width: 50%;
  margin: 5rem auto;
  border: 3px solid white;
  padding: 5rem;
}
</style>
