<template>
    <div style="height:100vh;" class="cableInfo">
        <div v-if="flag" style="position:absolute;width:100%;height:100%;z-index:-1">
            <img  src="../../../public/images/loading.gif" style="z-index:1000; margin-top:270px;margin-left:45%;" />
        </div>
    <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;font-size:16px;">
            <span >暂无数据</span>
        </div>
    <mu-load-more @refresh="refresh" :refreshing="refreshing" >
    <div class="" >
            <mu-paper class="" :z-depth="2">
            <div v-for="(item,index) in data" :key="index" >
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
            
                <div v-for="item2 in item.duanzi" :key="item2.id" v-show="index === showIndex" style="background:#eee;margin-bottom:10px">
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
        props:["duanleixingId","id"],
        data(){
            return {
                ripple:false,
                data:[],
                refreshing: false,
                flag:false,
                showIndex:'',
                noData:false
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
                params.append("guanDuanId",this.id);
                params.append("duanLeiXingId",this.duanleixingId);
                this.$axios.post("/guanduan/queryCableByPipe",params).then((response)=>{
                    if(response.data.code==200){
                        this.data=response.data.data; 
                    }else{
                        this.$toast.error(response.data.msg);
                        this.flag = false
                        this.noData = true
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
            loading1(){
                this.flag = true;
                setTimeout(() => {
                    this.flag = false;
                    this.loading();
                },60000)   
            },
            loading(){
            if(this.data.length == 0){
                    this.noData = true;
                } 
            }
        },
        mounted(){
            this.getFormData();
            this.loading1();
        },
         watch:{
            '$route'(to,from){
                this.data = [];
                this.noData = false
            },
            data:{
                handler(){
                    if(this.data.length === 0){
                        this.flag = true;
                        if(this.noData = true){
                            this.flag = false;
                        }                   
                    } else {
                        this.flag = false 
                    }
                }
            }
            
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