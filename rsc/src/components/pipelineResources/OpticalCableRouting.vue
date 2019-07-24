<template>
    <div>
        <mu-appbar class="" style="width: 100%;position:fixed;top:0" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
            <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        光缆路由
        </mu-appbar>
        <mu-container style="margin-top:60px;">  
            <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <span >暂无数据</span>
    </div>
    <div v-if="loadingData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <div v-loading="true" data-mu-loading-overlay-color="rgba(0, 0, 0, .6)" style="position: relative; width: 100%; height: 100%;"></div>
    </div> 

    <mu-load-more  :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">
            <div v-if="data.length > 0" class="demo-container is-stripe" style="padding:0;overflow:scroll">
            <div style="font-weight:blod;font-size:15px;">
                <mu-row style="background:#fff;">
                    <mu-col span="3"><div class="grid-cell">前载体</div></mu-col>
                    <mu-col span="3"><div class="grid-cell">后载体</div></mu-col>
                    <mu-col span="3"><div class="grid-cell">段类型</div></mu-col>
                    <mu-col span="3"><div class="grid-cell">段承载位置</div></mu-col>
                </mu-row>
            </div>
            <div v-for="(item,index) in data" :key="item.id" @click="carrierDescription(index)"> 
                <mu-row style="background:#eee;">
                    <mu-col span="3"><div class="grid-cell">{{item.frontcarrier}}</div></mu-col>
                    <mu-col span="3"><div class="grid-cell">{{item.rearcarrier}}</div></mu-col>
                    <mu-col span="3"><div class="grid-cell">{{item.duantype}}</div></mu-col>
                    <mu-col span="3"><div class="grid-cell">{{item.bearingposition}}</div></mu-col>
                </mu-row>
                <mu-expand-transition>
                <div v-if="index === curIndex" style="padding-left:30px;">
                    <p style="font-size:14px;height:30px;line-height:30px;">
                        <span style="width:80px;display:inline-block;">前载体描述</span>
                        :&nbsp;&nbsp;&nbsp;
                        <span>{{item.frontcarrierdescription}}</span>
                    </p>
                    <p style="font-size:14px;height:30px;line-height:30px;">
                        <span style="width:80px;display:inline-block;">后载体描述</span>
                        :&nbsp;&nbsp;&nbsp;
                        <span>{{item.rearcarrierdescription}}</span>
                    </p>
                </div>
                </mu-expand-transition>
            </div>
            <div>
            </div>
            </div>
            </mu-load-more>
        </mu-container>
    </div>
</template>

<script>
export default {
    props:["id"],
    data(){
        return{
            data:[],
            curIndex:'',
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
        navigate_back(){
            this.$router.back(-1);
        },
        carrierDescription(index){
            this.curIndex = index;
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
        loadData() {
          let params=new URLSearchParams();
          params.append("id",this.id);
          params.append("page",this.currPage);
          this.$axios.post("/guanglan/luyou",params).then((res) => {
            this.total = res.data.total
            this.loadingData = false
            this.refreshing = false
            this.loading = false
            let data = res.data.data.content
            if(res.data.code !== 200){
                this.$toast.error(data.msg);
            }else{
                this.data = this.data.concat(data);
                if(this.data.length === 0){
                    this.noData = true
                }
            }
          }).catch(() => {
                this.loadingData = false;
                this.$toast.error("数据加载错误");
          });
        },
    },
    mounted(){
        this.loadingData = true;
        this.loadData()
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
    .demo-container .row{
        text-align: center;
        border-bottom:1px solid #ccc;
        height:40px;
        line-height:40px;
    }
    p{
        padding:0;
        margin:0;
    }
    .container{
        padding:0
    }
</style>