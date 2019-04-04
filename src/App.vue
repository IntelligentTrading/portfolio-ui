<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: "Lato";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.el-message__content {
  font-family: Lato !important;
}

.el-button span{
  pointer-events: none;
}
</style>
