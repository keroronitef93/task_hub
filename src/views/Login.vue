<template>
  <div class="wrapper">
    <div class="box">
      <div class="btn-group-vertical">
        <h2 class="title_text">Login</h2>
        <button @click="googleIn" class="btn btn-danger btn-block mb-4 header_btn">Google認証</button>
        <button @click="signIn" class="btn btn-danger btn-block">匿名認証</button>
        <p class="logo_text"><img src="../assets/char.png" alt="Logo" class="img-fluid pd-1">TaskHub</p>
      </div>
    </div>
  </div>
</template>
<script>
import {getAuth,signInAnonymously,signInWithPopup,GoogleAuthProvider,setPersistence,browserSessionPersistence} from 'firebase/auth'
  export default{
    methods: {
      signIn() {//匿名認証
        const auth = getAuth()
        setPersistence(auth, browserSessionPersistence)
        signInAnonymously(auth).then(() => {
          this.$router.push("/home")
        })
        .catch((error) => {
          console.log(error)
        })
      },
      googleIn() {//google認識
        const auth = getAuth()
        const provider = new GoogleAuthProvider()
        setPersistence(auth, browserSessionPersistence)
        signInWithPopup(auth,provider).then(() => {
          this.$router.push("/home")
        })
        .catch((error) => {
          console.log(error)
        })
      },
      
    }
  }
</script>

<style scope>
  .wrapper{
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ee3443;
  }
  .box{
    display: block;
    background: #fafafa;
    padding-top: 90px;
    width: 40%;
    height: 400px;
    margin: 0 auto;
    box-shadow: 0px 35px 30px -30px;
  }
  .btn-group-vertical{
    display: block;
    width: 80%;
    margin: 0 auto;
  }
  .title_text{
    text-align: center;
    margin-bottom: 20px;
  }
  .logo_text{
    margin-top: 20px;
    text-align: center;
  }
  .header_btn{
    border-radius: 0;
  }
</style>
