<template>
  <div id="app">
    <router-view/>

    <footer>
<div class="signup">

<h1>Signup now for our discount product</h1>

<div class="signup-form">
  <input v-model="email" placeholder="mailto@yourmail.com"><button v-on="emailSubmit" class="btn">Subscribe</button>
</div>
</div>

<div class="links">
<div >
  <h3>Company</h3>
  <ul>
    <li>Home</li>
 <li>About us</li>
 <li>Shop</li>
 <li>Blog</li>
 <li>Contact us</li>
  </ul>
</div>

<div >
  <h3>Service</h3>
  <ul>
    <li>Support</li>
 <li>FAQ</li>
 <li>Warranty</li>
 <li>Live Chat</li>
 <li>Privacy Policy</li>
  </ul>
</div>

<div >
  <h3>Orders and Returns</h3>
  <ul>
    <li>Order</li>
 <li>Status</li>
 <li>Shipping</li>
 <li>Policy & Service </li>
 <li>Cart</li>
  </ul>
</div>

<div>
  <h3>Payment Accepted</h3>
  <div class="payment">
  <img src="./assets/img/american.png"> <img src="./assets/img/mastercard.png"><img src="./assets/img/visa.png"><img src="./assets/img/discover.png"><img src="./assets/img/discover.png">
  </div>
</div>

</div>

</footer>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #f2a104;
  background-color: #1d65a6;

}
body{
  color: #f2a104;
  background-color: #1d65a6;

}

h1{
  font-family: "Euphoria Script","Lucida Calligraphy", "Brush Script MT", "Brush Script Std", "Lucida Handwriting", "Apple Chancery", cursive;
}
footer{
  background-color: white;
  text-align: left;
  min-height: 200px;
  color:  #1d65a6;

}

footer .signup{
  background-color: black;
  min-height: 100px;
  padding: 50px;
}

.signup h1{
color: white;
font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
font-size: 24px;
border: 2em;

}

.signup input{
  min-width: 300px;
  margin-right: 2em;
  min-height: 40px;
  background-color: black;
  font-weight: bolder;
  vertical-align: middle;
  position: relative;
  left: 700px;
   top: -40px;
}
.signup .btn{
  min-width: 100px;
  margin-right: 2em;
  min-height: 40px;
  position: relative;
  left: 700px;
  top: -40px;
  background-color: #f2a104;
  font-weight: bolder;
  color: white;
}

.links{
  display: grid;
  grid-template-columns: repeat(4, auto);
  padding-bottom: 1em;
  margin-left: 30px;
}

footer img{
  width: 60px;
  height: 60px;
}

.payment{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

footer ul{
  list-style: none;
  font-size: 16px;
  margin-left: -35px;
  color: gray;
  line-height: 1.5em;
}

.links h3{
  text-transform: uppercase;
  color: black;
  font-size: 20px;

}

</style>
