<template>
    <div class="opticalFiberCableBureau">
        <mu-appbar class="" style="width: 100%;position:fixed;top:0" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
            <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        光缆局向
        </mu-appbar>
        <div style="height:100vh;margin-top:57px;" class="opticalfiberIndex" >
        <!-- <mu-load-more :loaded-all="loadOver"  @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'"> -->
        <hf-load-more :config="config">
            <template name="loop" slot-scope="props">
            <div style="width: 100%; background: #fff; " v-for="item in props.item" :key="item.id">
                <mu-flex class="gqp-of-flex-wrapper first-wrapper" justify-content="center" fill>
                    <mu-flex class="flex-row bottomLeft" justify-content="center" style="" fill>
                        <span style="padding:5px"  >
                            {{item.name}}
                            <mu-chip style=" border-radius: 5px;line-height: normal;" class="demo-chip" :color="getChipColor(item.type)">
                            {{getChipValue(item.type)}}
                            </mu-chip>
                        </span> 
                    </mu-flex>
                    <mu-flex class="flex-row first-left" justify-content="center" style="" >
                        <mu-button class="topRight" small textColor="#C0C0C0" flat color="warning" @click="details(item.id,item.motorRootStartId,item.motorRootEndId)" style="color:#ff4081;font-size:12px;" v-if="item.opticalFiberNum != 0 ||item.fiberCoreTotalNum != 0 || item.fiberCoreFreeNum != 0">详情</mu-button>
                    </mu-flex>
                </mu-flex>
                <mu-flex class="gqp-of-flex-wrapper second-wrapper" align-items="center">
                    <mu-flex class="flex-row" justify-content="center" fill><span class="leftFont">总路由数</span>&nbsp; |&nbsp; <span class="rightFont">{{item.opticalFiberNum}}</span></mu-flex>
                    <!-- <mu-flex class="flex-row" justify-content="center" fill><span class="leftFont">非公用空闲路由数 </span>&nbsp;|&nbsp; <span class="rightFont">{{item.fiberCoreTotalNum}}</span></mu-flex> -->
                    <mu-flex class="flex-row" justify-content="center" fill><span class="leftFont">空闲路由数 </span>&nbsp;|&nbsp;<span class="rightFont"> {{item.fiberCoreFreeNum}}</span></mu-flex>
                </mu-flex>
                <mu-divider ></mu-divider>
            </div>
            </template>
        </hf-load-more>
        <!-- </mu-load-more> -->
    </div>
    </div>
</template>

<script>
export default {
    props:['id'],
    data(){
       return {
            formData:[],
            config:{
                url:'/opticalfiber/list',
                params:{
                    id:this.id
                }
            },
       }

    },
    // mounted(){
    //     console.log(this.id)
    // },
    methods:{
        navigate_back(){
            this.$router.back(-1);
        },
        details(id,motorRootStartId,motorRootEndId){
            
             this.$router.push({path:'/OpticalfiberDetails',query:{"id":id,"motorRootStartId":motorRootStartId,"motorRootEndId":motorRootEndId}});
            
        },
        getChipColor(type){
            if(type=="1"){
                return "info";
            }else if(type=="0"){
                return "green";
            }else{
                return "#C0C0C0";
            }
        },
        getChipValue(type){
            if(type=="1"){
                return "出局";
            }else if(type=="0"){
                return "楼内";
            }else{
                return "未知";
            }
        },
    }
}
</script>

<style scoped>


.first-wrapper >.flex-row {
  height: 100%;
}

.first-left{
    width: 30%;
    padding:9px;
   
}
.second-wrapper >.flex-row {
  width: 50px;
  height: 100%;
  text-align: center;
  line-height: 32px;
  font-size: 10px;
}
.gqp-of-flex-wrapper:first-child {
  margin-top: 0;
}
.flex-row:first-child {
  margin-left: 0;
}
.leftFont{
color: #585858;
}
.rightFont{
color:#1a1919;

}
.bottomLeft{
    color: #1a1919;
    font-weight: bold;
}

</style>