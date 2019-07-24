<template>
  <mu-container   class="CRoomSearch">

    <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <span >暂无数据</span>
    </div>
    <div v-if="loadingData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <div v-loading="true" data-mu-loading-overlay-color="rgba(0, 0, 0, .6)" style="position: relative; width: 100%; height: 100%;"></div>
    </div>

    <mu-load-more  :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">
            <div v-for="(item,index) in data" :key="index" style="border-bottom:1px solid #ccc;">
                <div class="equipmentInfo_top">
                    <div class="equipmentInfo" @click="toggle(index)">
                        <div style="display:flex;align-items:center;width:246px;">
                            <!-- <mu-button style="width:20px; color:#008cff;" icon slot="left"> -->
                                <img src="../../assets/02_07.png" style="width:16px; height:16px; float:left; margin-top:6px;">
                            <!-- </mu-button> -->
                            <mu-flex style="min-width:245px;">
                            <span style="font-weight:700;font-size:14px;color:#000;display:inline-block;margin-left:5px;min-width:245px;word-wrap: break-word;">{{item.name}}</span>
                            </mu-flex>
                            <!-- <mu-flex>
                                <mu-icon  :value="index === curIndex ?'keyboard_arrow_up' : 'keyboard_arrow_down'"  style="font-size:18px;margin-top:24px;"/>
                            </mu-flex> -->
                        </div>
                        <span style="font-size:12px;">{{item.netWork}} | {{item.proCategory}}</span>
                    </div>
                    <mu-flex class="flex-demo btn-right" justify-content="center" >
                        <!-- <mu-button class="topRight" small textColor="#C0C0C0" flat color="warning" @click="toActiveDeviceDetail(item.id)" style="min-width:0;color:#ff4081;font-size:12px;">详情</mu-button> -->
                        <router-link :to="{path:'/activeDeviceDetail/',query:{id:item.id}}">详情</router-link>
                    </mu-flex>                    
                </div>
        <!-- <mu-flex class="mu-transition-row"> -->
                <mu-expand-transition>
                <div v-if="index === curIndex" style="width:100%">
                    <div class="equipmentInfo_bottom">
                        <p><span>网络系统 | {{item.netWork}}</span><span>厂家 | {{item.manufacturer}}</span></p>
                        <p><span>设备型号 | {{item.model}}</span></p>
                        <p><span>设备LOOPBACK地址 | {{item.loopBackAddress}}</span></p>    
                    </div>
                </div>
                </mu-expand-transition>
            </div>
            </mu-load-more>
  </mu-container>
</template>


<script>
export default {

    props:["type1","search"],
    
    data(){

        return {
            refreshing:false,
            loading:false,
            data:[],
            noData:false,
            loadingData:false,
            currPage:0,
            loadOver:false,
            curIndex:'',
            total:0,
        };
    },

    mounted(){ 


        //挂载后 清除所有数据 重新加载
        this.loadingData = true;
        this.loadData();
        
     
    },
    methods:{

        // toActiveDeviceDetail(id){
        //     //打开有源设备详情页
        //     this.$router.push({path:'/activeDeviceDetail/',query:{id:id}});
        // },
        toggle(index){

            this.curIndex = (this.curIndex === index ? '': index);
            
        },
        refresh(){
            this.loadOver = false
            this.total = 0
            this.refreshing = true;
            this.currPage = 0;
            this.loadData();

        },
        load(){
            this.loading = true;
            // if(data.pageSize > this.currPage){
                this.currPage++;
                // this.loadOver = false
            // } else {
                // this.loadOver = true
            // }
            this.loadData();
        },
 
        loadData(){

            let params=new URLSearchParams();
            
            params.append("type",this.type1);
            params.append("name",this.search);
            params.append("page",this.currPage);

            this.$axios.post("/map/search",params).then((response)=>{
                this.total = response.data.total
                this.loadingData = false
                this.refreshing = false
                this.loading = false
                let data = response.data.data
                if(response.data.code !== 200){
                    this.$toast.error(data.msg);
                }else{
                    
                    this.data = this.data.concat(data);
                    if(this.data.length === 0){
                        this.noData = true
                    }

                }
               
           }).catch((e)=>{
                this.loadingData = 0;
                this.$toast.error("数据加载错误");
           });

        },



    },
    watch:{
        '$route'(to,from){
            this.data = [];
            this.noData = false
            this.currPage = 0;
            this.loadingData = true;
            this.loading = false
            this.loadData();
        },
         data:{
            handler(){
                if(this.data.length >= this.total){
                    this.loadOver = true
                } else {
                    this.loadOver = false
                }
            }
        }
        
    }
   
}
</script>


<style scoped>
    .equipmentInfo_top{
        width: 100%; 
        background: #fff;
        overflow: hidden;
        padding-bottom:10px;
        /* border-bottom: 1px solid  */
    }
    .equipmentInfo{
        float:left;
        color:rgb(39, 38, 38);
        padding-left:10px;
    }
    .equipmentInfo span{
        display: block;
        margin-top:5px;
    }
    .btn-right{
        float:right;
        font-size:12px;
        margin-top:20px;
        min-width: 50px;
    }
    .equipmentInfo_bottom{
        background:rgb(245, 245, 245);
        clear:both;
        margin:0;   
        font-size: 12px;
    }
    .equipmentInfo_bottom span{
        display: inline-block;
        padding:10px 30px 10px 10px;
        color: rgb(39, 38, 38);
    }
    .equipmentInfo_bottom p{
        margin:0;
        padding:0;
    }
    .material-icons{
        font-size:24px;
    }

    .mu-transition-row {
        margin: 0px;
        min-height: 10px;
    }
    .mu-option.is-selected .mu-item{
        color:dodgerblue
    }
    .cFont{
        font-size: 14px;
    }
</style>
