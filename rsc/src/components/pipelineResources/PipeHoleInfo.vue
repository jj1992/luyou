<template>
    <div style="height:100vh;" class="PipeHoleInfo">
       <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <span >暂无数据</span>
    </div>
    <div v-if="loadingData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <div v-loading="true" data-mu-loading-overlay-color="rgba(0, 0, 0, .6)" style="position: relative; width: 100%; height: 100%;"></div>
    </div> 

    <mu-load-more  :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">
    <div class="" >
            <mu-paper class="" :z-depth="2">
            <div v-for="(item,index) in data" :key="index" >
                <div @click="toggle(index)" style="padding:10px 0;border-bottom:1px solid #ccc;">
                <mu-row class="gqp-ofDetail-mu-row "  >
                    <mu-col class="gqp-ofDetail-mu-col" span="2" style="text-align:center;">
                        <!-- <img src="../../assets/07_03.png" style="width:18px; height:16px;"> -->
                        缆编号：
                    </mu-col>
                    <mu-col class="gqp-ofDetail-mu-col" span="9">
                        <span>{{item.lanbianhao}}</span>
                    </mu-col>
                     <mu-col class="gqp-ofDetail-mu-col" span="1">
                            <mu-icon v-if="item != null"  :value="index === showIndex ?'keyboard_arrow_up' : 'keyboard_arrow_down'"/>
                    </mu-col>
                </mu-row>
                <mu-row class="gqp-ofDetail-mu-row">
                    <mu-col class="gqp-ofDetail-mu-col col-center" span="6">缆段号 | {{item.landuahao}}</mu-col>
                    <mu-col class="gqp-ofDetail-mu-col col-center" span="6">管孔编号 | {{item.guankongbianhao}}</mu-col>
                </mu-row >
                </div>
            
                <div v-show="index === showIndex" style="background:#eee;margin-bottom:10px">
                    <mu-row class="gqp-ofDetail-mu-row">
                        <mu-col class="gqp-ofDetail-mu-col col-left">缆类型: {{item.lanleixing}}</mu-col>
                        <mu-col class="gqp-ofDetail-mu-col col-left">孔类型: {{item.guankongleixing}}</mu-col>
                    </mu-row>
                    <mu-row class="gqp-ofDetail-mu-row">
                        <mu-col class="gqp-ofDetail-mu-col col-left">产权单位: {{item.chanquandanwei}}</mu-col>
                        <mu-col class="gqp-ofDetail-mu-col col-left">芯数: {{item.xinshu}}</mu-col>
                    </mu-row>
                    <mu-row class="gqp-ofDetail-mu-row">
                        <mu-col class="gqp-ofDetail-mu-col col-left">路由: {{item.luyou}}</mu-col>
                    </mu-row>
                </div>
            </div>
            </mu-paper>

    </div>
    </mu-load-more>
    </div>
</template>
<script>
    export default{
        props:["id"],
        data(){
            return {
                data:[],
                showIndex:'',
                refreshing:false,
                loading:false,
                noData:false,
                loadingData:false,
                currPage:0,
                loadOver:false,
                total:0,
            }
        },
        methods:{
            navigate_back() {
                this.$router.back(-1);
            },
            refresh(){
                this.total = 0;
                this.loadOver = false
                this.refreshing = true;
                this.currPage = 0;
                this.loadData();

            },
            load(){
                this.loading = true;
                this.currPage++;
                this.loadData();
            },
            loadData(){
                let params=new URLSearchParams();
                params.append("pipeId",this.id);
                params.append("page",this.currPage);
                this.$axios.post("/pore/queryPoreByPipeId",params).then((res)=>{
                    this.total = res.data.total
                    this.loadingData = false
                    this.refreshing = false
                    this.loading = false
                    let data = res.data.data
                    if(res.data.code !== 200){
                        this.$toast.error(data.msg);
                    }else{
                        this.data = this.data.concat(data);
                        console.log(this.data)
                        if(this.data.length === 0){
                            this.noData = true
                        }
                    }
                }).catch(() => {
                        this.loadingData = false;
                        this.$toast.error("数据加载错误");
                });
            },
            // refresh () {
            //     this.refreshing = true;
            //     setTimeout(() => {
            //         this.getFormData();
            //             this.refreshing = false;
            //     }, 2000)
            // },
            toggle(index){
                this.showIndex = (this.showIndex === index ? '':index);
            },   
        },
        mounted(){
            this.loadingData = true;
            this.loadData();
        },
        watch:{
        '$route'(to,from){
            this.data = [];
            this.noData = false
            this.currPage = 0
            this.loadingData = true;
            this.refreshing = false
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
    .gqp-ofDetail-title{
        font-size: 16px;
    }
    .material-icons{
        font-size: 24px;
    }
</style>

