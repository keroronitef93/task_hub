<template>
    <header>
        <nav class="navbar navbar-dark bg-danger p-3">
            <div class="container-fluid">
              <router-link to="/home" class="navbar-brand">
                  <img src="../assets/char.png" alt="Logo" class="img-fluid pd-1"><span>TaskHub</span>
              </router-link>
              <a @click="signOut" class="logout_btn"><img src="../assets/logout.png" alt="logout" class="img-fluid float-right pd-3"></a>
              <SLIDE right noOverlay>
                <router-link to="/home">
                  <span>Home</span>
                </router-link>
                <router-link to="/home/search">
                  <span>Search</span>
                </router-link>
                <a @click="signOut" class="logout_text">
                  <span>Logout</span>
                </a>
              </SLIDE>
              <div id="page-wrap"></div>
            </div>
        </nav>
    </header>
</template>
<script>
  import { Slide } from 'vue-burger-menu'
  import {getAuth,signOut} from 'firebase/auth'
  export default{
    components: {
      SLIDE: Slide
    },
    methods: {
      signOut() {
        const auth = getAuth()
        signOut(auth).then(() => {
          alert("ログアウトしました")
        })
        .catch((error) => {
          console.log(error)
          alert("エラー")
        })
      },
    }
  }
</script>
<style>
 .bm-burger-button {
    top: 23px !important;
  }
  .bm-burger-bars {
    background-color: #ffff !important;
  }
  .line-style {
    height: 10% !important;
  }
  .img-fluid{
    width: 25px;
    padding-right: 1px;
    padding-bottom: 4px;
  }
  .logout_btn{
    cursor: pointer;
    margin-top: 4px;
    margin-left: auto;
    margin-right: 70px;
  }
  .logout_text{
    cursor: pointer;
  }
</style>
