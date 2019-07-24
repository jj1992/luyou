<template>
    <div class="" style="margin-top:5px">
        <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;">
            <span >暂无数据</span>
        </div>
        <mu-container style="padding:0px" >
            <mu-row v-if="tit" gutter style="background:#fff;height:60px;line-height:40px;text-align:center;padding:0 9px;width:102%;position: fixed;top:105px;left: 0px;z-index: 10;">                
                <mu-col span="4.5">                   
                <mu-select label="业务类型" v-model="filterable.value1" full-width class="cFont">
                    <div @click="all">
                      <mu-option :label="msg" :value="msg"></mu-option>  
                    </div>
                    <div v-for="(option,index) in netWork" :key="index" @click='filter(index)'>
                        <mu-option :label="option" :value="option"></mu-option>
                    </div>
                </mu-select>
                </mu-col>

                <mu-col span="4.5">
                <mu-select label="设备类型" v-model="filterable.value2" full-width class="cFont">
                    <div @click="all">
                      <mu-option :label="msg" :value="msg"></mu-option>  
                    </div>
                    <div v-for="(option,index) in type" :key="index" @click='filter2(index)'>
                        <mu-option :label="option" :value="option"></mu-option>
                    </div>
                </mu-select>
                </mu-col>
                <mu-col span="3" style="font-size:10px;color:rgba(0,0,0,.54);margin-top:25px;">
                    <div class="grid-cell velocity">共<i style="color:aqua;font-style:normal">{{this.num}}</i>条信息</div>
                </mu-col>  
            </mu-row>
            <mu-load-more :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">
                <div style="margin-top:55px;">
                <div v-for="(item,index) in newList" :key="item.id" style="border-bottom:1px solid #ccc;">
                    <div class="equipmentInfo_top">
                        <div class="equipmentInfo" @click="toggle(index)">
                            <div style="display:flex;align-items:center;width:246px;">
                                <!-- <mu-button style="width:20px; color:#008cff;" icon slot="left"> -->
                                    <img src="../../assets/02_07.png" style="width:16px; height:16px; float:left; margin-top:6px;">
                                <!-- </mu-button> -->
                                <mu-flex style="min-width:270px;">
                                <span style="font-weight:bold;font-size:14px;color:#000;display:inline-block;margin-left:5px;min-width:270px;word-wrap: break-word">{{item.name}}</span>
                                </mu-flex>
                                <mu-flex>
                                    <mu-icon  :value="index === curIndex ?'keyboard_arrow_up' : 'keyboard_arrow_down'"  style="font-size:18px;margin-top:24px;"/>
                                </mu-flex>
                            </div>
                            <span style="font-size:12px;">{{item.netWork}} | {{item.proCategory}}</span>
                        </div>
                        <mu-flex class="flex-demo btn-right" justify-content="center" >
                            <mu-button class="topRight" small textColor="#C0C0C0" flat color="warning" @click="toActiveDeviceDetail(item.id)" style="min-width:0;color:#ff4081;font-size:12px;">详情</mu-button>
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
                </div>

            </mu-load-more>
            
        <!-- </mu-flex> -->
        </mu-container>
    </div>
</template>
<script>
export default {
    props:["id"],
    data(){
        return{
            list:[],
            expand2:'',
            flag:false,
            type:[],
            netWork:[],
            newList:[],
            newList2:[],
            msg:"全部",
            num:0,
            curIndex:'',
            filterable: {
                value1: '请选择',
                value2: '请选择'
            },
            refreshing:false,
            loading:false,
            currPage:0,
            loadOver:false,
            total:0,
            noData:false,
            tit:true,
        }
    },
    methods:{

        toActiveDeviceDetail(id){
            //打开有源设备详情页
            this.$router.push({path:'/activeDeviceDetail/',query:{id:id}});
        },
        toggle(index){

            this.curIndex = (this.curIndex === index ? '': index);
            
        },
        postData() {
        this.$axios.post("/activedevice/list?id="+this.id + "&page=" + this.currPage).then((res) => {
                this.total = res.data.total
                if(res.data.code === 200){
                    if(!this.refreshing){
                        this.list = this.list.concat(res.data.data);
                    }
                    if(this.list.length === 0){
                        this.noData = true
                        this.tit = false
                    }
                }else{

                    this.$toast.error(this.data.msg);
                }
                this.refreshing = false
                this.loading = false
                this.newList = this.list;
                this.getFilm(); 
                this.num = this.list.length;
                
            })
        },
        toggleShow(item){
          this.expand2 = this.expand2 == item ? "" : item;
        },
        getFilm(){  
            for(let item of this.list){
                if(this.netWork.indexOf(item.netWork) === -1){
                   this.netWork.push(item.netWork); 
                }    
            }   
        },
        getEqu(){  
            this.type = [];
            for(let item of this.newList){
                if(this.type.indexOf(item.proCategory) === -1){
                    this.type.push(item.proCategory);     
                }    
            } 
        },
      filter(idx){ 
            this.newList = this.list.filter((item)=>{
                if(item.netWork === this.netWork[idx]){  
                    return item;
                }
            })
            //console.log(this.newList)
            this.num = this.newList.length;
            this.getEqu(); 
            this.newList2 = this.newList
            this.filterable.value2 = '请选择'
        },
        filter2(idx){ 
            this.newList = this.newList2
            this.newList = this.newList.filter((item)=>{
                if(item.proCategory === this.type[idx]){
                    return item
                }
            })
            //console.log(this.newList)
            this.num = this.newList.length;
        },
        all(){
            this.newList = this.list;
            this.num = this.newList.length; 
            this.type = [];
            this.filterable.value1 = '请选择'
            this.filterable.value2 = '请选择'
        },
        refresh(){
            this.loadOver = false
            this.total = 0
            this.refreshing = true;
            this.currPage = 0;
            this.postData();
        },
        load(){
            this.loading = true;
            // if(data.pageSize > this.currPage){
                this.currPage++;
                // this.loadOver = false
            // } else {
                // this.loadOver = true
            // }
            this.postData();
        },
    },
    mounted(){
        this.postData();
    },
    watch:{
        '$route'(to,from){
            this.list = [];
            this.currPage = 0;
            this.loading = false
            // this.postData();
        },
        list:{
            handler(){
                if(this.list.length >= this.total){
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
        margin-top:20px;
        min-width: 60px;
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

