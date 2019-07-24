<template>
    <mu-container class="computerRoomResource"   >


        <mu-appbar style="width: 100%;" color="primary">

        <mu-button icon slot="left" @click="navigate_back">
            <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
      设备列表

    </mu-appbar>


        <mu-tabs  :value.sync="currentIndex" color="#2196f3" text-color="#2196f3" indicator-color="#2196f3" inverse full-width style="width:100%"> 
            <mu-tab :to="{path:'/copticalfiberIndex',query:{id:this.id}}" :replace=true v-if="$util.hasRight('opticalfiberList')">光纤局向</mu-tab>
            <mu-tab :to="{path:'/cpassive',query:{id:this.id}}" :replace=true v-if="$util.hasRight('POSlist') || $util.hasRight('ODFlist')"> 无源</mu-tab>
            <mu-tab :to="{path:'/cactiveDeviceInfo',query:{id:this.id}}" :replace=true v-if="$util.hasRight('activeDeviceList')">有源</mu-tab>
        </mu-tabs>

        <div style="flex: 1 ;overflow: auto;">
            <transition name="slide">
                <router-view></router-view>
            </transition>
        </div>
    </mu-container>


</template>


<script>
export default {
    props:["id"],
  data() {
    return {
      currentIndex: 0,
    };
  },
  mounted(){
    console.log(this.currentIndex)
  },
  methods: {
    navigate_back() {
      this.$router.back(-1); 
    },
  },
};
</script>


<style scoped>
.computerRoomResource {
  width: 100%;
  padding: 0px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

