<template>
    <mu-container class="buoldingDevices"  ref="container" >


        <mu-appbar style="width: 100%;" color="primary">

        <mu-button icon slot="left" @click="navigate_back">
            <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
      楼宇详情 

    </mu-appbar>


        <mu-tabs  :value.sync="currentIndex" color="#2196f3" text-color="#2196f3" indicator-color="#2196f3" inverse full-width style="width:100%"> 
            <mu-tab :replace=true  v-if="$util.hasRight('motorRoomList') || $util.hasRight('wallPointList')" >全部</mu-tab>
            <!-- <mu-tab :to="{path:'/ItemCRoom',query:{type:1,buildId:this.buildId}}" :replace=true> 机房</mu-tab> -->
            <mu-tab :replace=true v-if="$util.hasRight('motorRoomList')"> 机房</mu-tab>
            <mu-tab :replace=true v-if="$util.hasRight('wallPointList')">壁挂点</mu-tab>
        </mu-tabs>

        <div style="flex: 1 ;overflow: auto;">
            <transition name="slide">
                <div>
                  
                  <itemList :buildId="buildId" :type="currentIndex"></itemList>
                </div>
                
               
            </transition>
        </div>
    </mu-container>


</template>


<script>
import itemList from "./BuildingItemList.vue"

export default {
  components:{
    itemList
  },

    props:["buildId"],
    

  data() {
    return {
      currentIndex: 0
    };
  },

  mounted() {
       
    
    this.$router.replace({path:'/ItemAll?type=0',query:{type:0,buildId:this.buildId}});

 
  },
   beforeRouteLeave (to, from, next) {
  
        if(to.name == "/computerRoomDetails"){
            this.$route.meta.keepAlive = true;
            next()
        } else {
            this.$route.meta.keepAlive = false;
            next()
        }
     },
  methods: {
    navigate_back() {
      this.$router.back(-1);
    }
  }
};
</script>


<style scoped>
.buoldingDevices {
  width: 100%;
  padding: 0px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

