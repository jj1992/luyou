<template>
    <div style="height:100vh;" class="opticalfiberDetails">
    <mu-appbar class="" style="width: 100vw;" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
          <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        光缆列表
      </mu-appbar>
    <mu-load-more @refresh="refresh" :refreshing="refreshing" >
    <div class="" >
            <mu-paper class="" :z-depth="2">
            <div v-for="(item,index) in formData" :key="index" >
                <div @click="toggle(index)" style="padding:10px 0;border-bottom:1px solid #ccc;">
                <mu-row class="gqp-ofDetail-mu-row "  >
                    <mu-col class="gqp-ofDetail-mu-col" span="1" style="text-align:center;">
                        <!-- <mu-icon size="18" value="flight_takeoff" color="red"></mu-icon> -->
                        <img src="../../assets/07_03.png" style="width:18px; height:16px;">
                    </mu-col>
                    <mu-col class="gqp-ofDetail-mu-col" span="10">
                        <span>{{item.name}}</span>
                    </mu-col>
                     <mu-col class="gqp-ofDetail-mu-col" span="1">
                       <!-- <mu-paper class="demo-paper" circle style="border:1px solid rgb(23, 126, 211);width:18px;height:18px;display:inline-block;margin-left:5px" > -->
                            <mu-icon v-if="item != null"  :value="index === showIndex ?'keyboard_arrow_up' : 'keyboard_arrow_down'"/>
                        <!-- </mu-paper> -->
                    </mu-col>
                </mu-row>
                <mu-row class="gqp-ofDetail-mu-row">
                    <mu-col class="gqp-ofDetail-mu-col col-center" span="6">总路由数 | {{item.opticalFiberNum}}</mu-col>
                    <!-- <mu-col class="gqp-ofDetail-mu-col col-center" span="5">非公用空闲路由数 | {{item.fiberCoreTotalNum}}</mu-col> -->
                    <mu-col class="gqp-ofDetail-mu-col col-center" span="6">空闲路由数 | {{item.fiberCoreFreeNum}}</mu-col>
                </mu-row >
                </div>
            
                <div v-for="item2 in item.duanzi" v-show="index === showIndex" style="background:#eee;margin-bottom:10px">
                    <mu-row class="gqp-ofDetail-mu-row" style='padding-left:5px;'>
                            <mu-col class="gqp-ofDetail-mu-col" span="1" style="text-align:center;">
                                <!-- <mu-icon size="14" value="album" color="blue"></mu-icon> -->
                                <img src="../../assets/06_06.png" style="width:8px; height:8px;">
                            </mu-col>
                            <mu-col class="gqp-ofDetail-mu-col" span="11">
                                <span style="font-weight: 800">设备位置信息</span>
                            </mu-col>
                    </mu-row>
                    <mu-row class="gqp-ofDetail-mu-row">
                        <mu-col class="gqp-ofDetail-mu-col col-left">起始机房: {{item2.motorRootStartName}}</mu-col>
                    </mu-row>
                    <mu-row class="gqp-ofDetail-mu-row">
                        <mu-col class="gqp-ofDetail-mu-col col-left">终止机房: {{item2.motorRootEndName}}</mu-col>
                    </mu-row>
                    <div>
                        <mu-row class="gqp-ofDetail-mu-row" style='padding-left:5px;'>
                            <mu-col class="gqp-ofDetail-mu-col" span="1" style="text-align:center;">
                                <!-- <mu-icon size="14" value="album" color="blue"></mu-icon> -->
                                <img src="../../assets/06_06.png" style="width:8px; height:8px;">
                            </mu-col>
                            <mu-col class="gqp-ofDetail-mu-col" span="11">
                                <span style="font-weight: 800">光纤信息</span>
                            </mu-col>
                        </mu-row>
                        <mu-row class="gqp-ofDetail-mu-row col-left">
                            <mu-col class="gqp-ofDetail-mu-col" span="6">起始设备位置:<mu-button flat color="primary" @click="toOdfDetail(item2.startModule)">{{item2.terminalStartAddress}}</mu-button></mu-col>
                            <mu-col class="gqp-ofDetail-mu-col" span="6">终止设备位置:<mu-button flat color="primary" @click="toOdfDetail(item2.endModule)">{{item2.terminalEndAddress}}</mu-button></mu-col>
                        </mu-row>
                        <mu-row class="gqp-ofDetail-mu-row" >
                            <mu-col class="gqp-ofDetail-mu-col col-center" span="6">起始设备端子号: {{item2.terminalStartInfo}}</mu-col>
                            <mu-col class="gqp-ofDetail-mu-col col-center" span="6">终止设备端子号: {{item2.terminalEndInfo}}</mu-col>
                        </mu-row>
                        <mu-row class="gqp-ofDetail-mu-row">
                            <mu-col class="gqp-ofDetail-mu-col col-left" span="12">芯序: {{item2.cores}}</mu-col>
                        </mu-row>
                    </div>
                </div>
            </div>
            </mu-paper>

    </div>
    </mu-load-more>
    </div>
</template>
<script>
    export default{
        props:["id","motorRootStartId",'motorRootEndId'],
        data(){
            return {
                ripple:false,
                formData:[],
                refreshing: false,
                flag:false,
                showIndex:'',
            }
        },
        methods:{
            toOdfDetail(id){
                this.$router.push({path:'/odfPostDetail',query:{id:id}});
            },
            navigate_back() {
                this.$router.back(-1);
            },
            getFormData(){
                let params=new URLSearchParams();
            
                params.append("id",this.id);
                params.append("motorRootStartId",this.motorRootStartId);
                params.append("motorRootEndId",this.motorRootEndId);
                this.$axios.post("/opticalfiber/details",params).then((response)=>{
                    if(response.data.code==200){
                        this.formData=response.data.data; 
                    }
            })
            },
            refresh () {
                this.refreshing = true;
                setTimeout(() => {
                    this.getFormData();
                        this.refreshing = false;
                }, 2000)
            },
            toggle(index){


                this.showIndex = (this.showIndex === index ? '':index);


            },   
        },
        mounted(){
            this.getFormData();
        }
    }
</script>
<style scoped>
     
     .gqp-ofDetail-mu-row{
         margin-bottom: 8px;
         /* height: 25px; */
     }
     .gqp-ofDetail-mu-col{
         width: 100%;
     }
     .col-center{
         text-align: center;
     }
     .col-left{
         text-align: left;
         margin-left:23px;
     }
    /* .demo-container {
        .row {
        margin-bottom: 20px;
        &:last-child {
        margin-bottom: 0;
        }
    }
    
    }
    .demo-container.is-stripe .col:nth-child(2n) .{
    background: rgba(0, 0, 0, 0.54);
    } */
    .gqp-ofDetail-title{
        font-size: 16px;
    }
    /* .mu-appbar{
        text-align: center;
    } */
    .material-icons{
        font-size: 24px;
    }
</style>