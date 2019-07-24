<template>
  <mu-container   class="opticalCableSearch">

    <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <span >暂无数据</span>
    </div>
    <div v-if="loadingData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <div v-loading="true" data-mu-loading-overlay-color="rgba(0, 0, 0, .6)" style="position: relative; width: 100%; height: 100%;"></div>
    </div>

    <mu-load-more  :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">
      <mu-list toggle-nested >
 
          <template v-for="(item,index) in data" >

              

            <mu-list-item  nested :open="open === index">
        

                <mu-list-item-content @click="toggleShow(index)">
                    <mu-list-item-title class="wall_title">
                        <img src="../../assets/01_03_03.png" style="width:16px; height:16px;">
                        {{item.bianHao}}
                    </mu-list-item-title>

                    <mu-list-item-sub-title >
                        <span class="item">
                        {{item.office}}|{{item.state}}|{{item.opticalCablePurpose}}
                        </span>
                    </mu-list-item-sub-title>

                </mu-list-item-content>
                <!-- 定位 -->
                <mu-list-item-action @click="showOpticalCableInMap(item.id)" style="margin-right:20px;">
                    <img src="../../assets/01_14.png" style="width:30px; height:30px;" />
                </mu-list-item-action>
                <mu-list-item-action>
                    <mu-list-item-after-text>

                    <router-link style="margin-left:25px;" :to="{path:'/opticalCableDetail',query:{id:item.id}}">详情</router-link>
                           
                    </mu-list-item-after-text>
                </mu-list-item-action>

                <!-- <mu-list-item button  slot="nested" style="background:#F5F5F5;" >
                    <mu-list-item-title >
                            <mu-row class="wall_item">
                                <mu-col span="6">行政区|{{item.district}}</mu-col>
                                
                                <mu-col span="6">物理网络|{{item.physicsReseau}}</mu-col> 
                            </mu-row>
                    </mu-list-item-title>
                </mu-list-item>
                <mu-list-item button  slot="nested" style="background:#F5F5F5;">
                    <mu-list-item-title>
                            <mu-row  class="wall_item">
                                <mu-col span="16">光缆类型|{{item.buildingType}}</mu-col>
                            
                                <mu-col span="6">光缆类别|{{item.buildingCategory}}</mu-col>
                            </mu-row>
                    </mu-list-item-title>
                </mu-list-item> 
                <mu-list-item button   slot="nested" style="background:#F5F5F5;" >
                        <mu-list-item-title>              
                            <mu-row  class="wall_item">
                                
                                <mu-col span="16">运行状态|{{item.status}}</mu-col>
                            
                                <mu-col span="6">是否综合布线|{{item.snthesize}}</mu-col>
                           
                            </mu-row>
                        </mu-list-item-title>
                </mu-list-item> -->

                 
            </mu-list-item>

            

            <mu-divider></mu-divider>
          </template>

      </mu-list>
    </mu-load-more>
  </mu-container>
</template>


<script>
export default {
    props:["name"],
    data(){
        return {
            open:'',
            refreshing:false,
            loading:false,
            data:[],
            noData:false,
            loadingData:false,
            currPage:0,
            loadOver:false,
            total:0,
        };
    },

    mounted(){ 
        //挂载后 清除所有数据 重新加载
        this.loadingData = true;
        this.loadData();
    },
    methods:{
        toggleShow(i){
            // this.open =  this.open ===  i  ? '' : i;
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
            params.append("bianhao",this.name);
            params.append("page",this.currPage);
            
            this.$axios.post("/guanglan/list",params).then((res)=>{
                this.total = res.data.total
                let data = res.data.data
                this.loadingData = false
                this.refreshing = false
                this.loading = false
                if(res.data.code !== 200){
                    this.$toast.error(res.data.msg)
                }else{
                    // console.log(this.data)
                    this.data = this.data.concat(data);
                    if(this.data.length === 0){
                        this.noData = true
                    }
                }
               
           }).catch((e)=>{
                this.loadingData = false;
                this.$toast.error("数据加载错误");
           });

        },
        showOpticalCableInMap(guanglanId){
                let params=new URLSearchParams();
                params.append("id",guanglanId);
                this.$axios.post("/guanglan/location",params).then((res)=>{
                if(res.data.code == 200){
                console.log(res.data.data)
                var ids = new Array
                for(var i = 0;i < res.data.data.length;i ++){
                ids.push(res.data.data[i])
                // window.mapifram.gisParams.showTubulationInMap(ids[i]);
                }
                window.mapifram.gisParams.ziYuanLocation(ids,7,guanglanId);
                if(res.data.data.length <= 0){
                this.$toast.error('无光缆资源');
                }
                }
                })
            }

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

.buildingList{

    padding: 0px;

}
.wall_item{

    font-size: 12px;

}
.wall_title{
    font-size: 14px;
    font-weight: bold;
}
.mu_item{
    height:45px;
}
.mu-list{
    padding:0;
}
.container{
    padding-left:0;
    padding-right:0;
}
</style>

