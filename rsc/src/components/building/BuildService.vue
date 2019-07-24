<template>
    <mu-container style="width: 100%;padding:0px;height:100vh;display:flex;flex-direction:column" ref="container">
        <mu-appbar style="width: 100%;" color="primary">
            <mu-button icon slot="left" @click="navigate_back">
                <mu-icon value="navigate_before"></mu-icon>
            </mu-button>
            楼内业务
        </mu-appbar>
        <mu-tabs :value.sync="active" color="#2196f3" text-color="#2196f3" indicator-color="#2196f3" inverse full-width style="width:100%">
            <!-- <mu-tab :replace=true  @click="toLine('specialLine')">专线</mu-tab>
            <mu-tab :replace=true  @click="toRelay('relaying')">中继</mu-tab> -->
            <mu-tab style="font-size:16px;">专线</mu-tab>
            <mu-tab style="font-size:16px;">中继</mu-tab>
        </mu-tabs>
        <div style="flex: 1 ;overflow: auto;">
            <!-- <router-view></router-view> -->
            <keep-alive>
            <dedicatedLine v-if="active === 0" :data="data.specialBusinessList" :idx="this.buildId"></dedicatedLine>
            <relayNode v-if="active === 1" :data="data.relayingBusinessList" :idx="this.buildId"></relayNode>
            </keep-alive>
        </div>
    </mu-container>
</template>
<script>
import dedicatedLine from './DedicatedLine';
import relayNode from './RelayNode';
export default {
  components:{
        dedicatedLine,relayNode
  },
  props:["buildId"],
  data() {
    return {
      active:0,
      data:{},
      idx:''
    };
  },
  created() {
      this.postData()
      //console.log(this.buildId) 
  },
  methods: {
    navigate_back() {
      this.$router.back(-1);
    },
    postData(){    
        
        let params=new URLSearchParams();
        params.append("id",this.buildId);
        this.$axios.post("/building/businesslist",params).then((res) => {
            if(res.data.code==200){                                 
                this.data = res.data.data
            }else{
                
            }
        }).catch(() => {
        
        });
    },
    // toLine(type){
    //     this.type =type
    //     this.$router.replace({path:"/buildService/dedicatedLine",query:{type:type}});
    
    // },
    // toRelay(type){
    //     this.type =type
    //     this.$router.replace({path:"/buildService/relayNode",query:{type:type}});
    // }
  }
};
</script>