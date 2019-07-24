<template>
    <div>
        <!-- <div v-if="flag" style="position:absolute;width:100%;height:100%;z-index:-1">
            <img  src="../../../public/images/loading.gif" style="z-index:1000; margin-top:270px;margin-left:45%;" />
        </div> -->
        <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;font-size:16px;">
            <span >暂无数据</span>
        </div>
        <mu-container style="padding:0px" >
    <!-- <mu-load-more  :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">         -->
        <div v-for='(item,index) in data' :key="index" style="border-bottom:1px solid #ccc;">
                <div class="dedicatedLine_top">
                    <div class="dedicatedLine">
                        <div style="display:flex;align-items:center;width:246px;">
                                <img src="../../assets/02_07.png" style="width:16px; height:16px; float:left; margin-top:6px;">   
                            <mu-flex>
                                <span style="font-weight:bold;font-size:14px;color:#000;display:inline-block;margin-left:5px;min-width:210px;">{{item.code}}</span>
                            </mu-flex>
                            <!-- <mu-flex>
                                <mu-icon  :value="index === curIndex ?'keyboard_arrow_up' : 'keyboard_arrow_down'"  style="font-size:18px;margin-top:24px;"/>
                            </mu-flex> -->
                        </div>
                        <span style="font-size:12px;">{{item.workNo}} | {{item.netToneWord}}</span>
                    </div>
                    <mu-flex class="flex-demo btn-right" justify-content="center" >
                        <mu-button class="topRight" small textColor="#C0C0C0" flat color="warning" @click="toRelayFullRoute(item.code)" style="min-width:0;color:#ff4081;font-size:12px;">详情</mu-button>
                    </mu-flex>                    
                </div>
                <mu-expand-transition>
                <div v-if="index === curIndex" style="width:100%">
                    <div class="dedicatedLine_bottom">
                        <p><span>订单号 | {{item.singleCode}}</span></p>
                        <p><span>产品类型 | {{item.producType}}</span></p>
                        <p><span>用户Z端地址 | {{item.ZmotorRoom}}</span></p> 
                        <p><span>用户A端地址 | {{item.AmotorRoom}}</span></p>    
                    </div>
                </div>
                </mu-expand-transition>
            </div>
        <!-- </mu-load-more> -->
        </mu-container>
    </div>
</template>
<script>
export default {
    props:['data','idx'],
    data(){
        return{
            curIndex:-1,
            list:[],
            flag:true,
            noData:false,
            // refreshing:false,
            // loading:false,
            // loadingData:false,
            // currPage:0,
            // loadOver:false,
            // total:0,
        }
    },
    mounted() {
        //this.postData()
         this.loading()
    },
    // watch:{
    //     '$route'(to,from){
    //         this.list = [];
    //         this.currPage = 0;
    //         this.loading = false
    //         this.postData();
    //     },
    //     list:{
    //         handler(){
    //             if(this.list.length >= this.total){
    //                 this.loadOver = true
    //             } else {
    //                 this.loadOver = false
    //             }
    //         }
    //     }
    // },
    methods:{
        // toggle(index){
        //     this.curIndex = (this.curIndex === index ? '': index);  
        // },
        // postData(){    
        //     // let params=new URLSearchParams();
        //     // params.append("id",this.idx);
        //     this.$axios.post("/building/businesslist?id="+this.idx + "&page=" + this.currPage).then((res) => {
        //         this.total = res.data.total
        //         this.loadingData = false
        //         this.refreshing = false
        //         this.loading = false
        //         if(res.data.code==200){ 
        //             if(!this.refreshing){
        //                 this.list = this.list.concat(res.data.data.relayingBusinessList);
        //             }                                
        //             if(this.list.length === 0){
        //                 this.noData = true
        //             }
        //         }else{
        //             this.$toast.error(this.data.msg);
        //         }
        //     }).catch(() => {
        //         this.loadingData = 0;
        //         this.$toast.error("数据加载错误");
        //     });
        // },
        toRelayFullRoute(code){
            this.$router.push({path:'/relayFullRoute/',query:{specialLineCode:code}});
        },
        // loading1(){
        //     setTimeout(() => {
        //         this.flag = false;
        //     },3000)  
        // },
        loading(){
            if(this.data.length == 0){
                this.noData = true;
            }
        }
        // refresh(){
        //     this.loadOver = false
        //     this.total = 0
        //     this.refreshing = true;
        //     this.currPage = 0;
        //     this.postData();

        // },
        // load(){
        //     this.loading = true;
        //     // if(data.pageSize > this.currPage){
        //         this.currPage++;
        //         // this.loadOver = false
        //     // } else {
        //         // this.loadOver = true
        //     // }
        //     this.postData();
        // },
    },
}
</script>

<style  scoped>
    .dedicatedLine_top{
        width: 100%; 
        background: #fff;
        overflow: hidden;
        padding:5px 0;
    }
    .dedicatedLine{
        float:left;
        color:rgb(39, 38, 38);
        padding-left:10px;
    }
    .btn-right{
        float:right;
        margin-top:20px;
        min-width: 60px;
        margin-right: 25px;
    }
    .dedicatedLine_bottom{
        background:rgb(245, 245, 245);
        clear:both;
        margin:0;   
        font-size: 12px;
    }
    .dedicatedLine_bottom span{
        display: inline-block;
        padding:10px 30px 10px 10px;
        color: rgb(39, 38, 38);
    }
    .dedicatedLine_bottom p{
        margin:0;
        padding:0;
    }
</style>

