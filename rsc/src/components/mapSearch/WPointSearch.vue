<template>
  <mu-container   class="WPointSearch">

    <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <span >暂无数据</span>
    </div>
    <div v-if="loadingData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <div v-loading="true" data-mu-loading-overlay-color="rgba(0, 0, 0, .6)" style="position: relative; width: 100%; height: 100%;"></div>
    </div>

    <mu-load-more :loaded-all="loadOver"   @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">  
      <mu-list toggle-nested >
 
          <template v-for="(item,index)  in data"   >

              

            <mu-list-item  nested :open="open === index">
        

                <mu-list-item-content @click="toggleShow(index)">
                    <mu-list-item-title class="wall_title">
                        <img src="../../assets/03_03.png" style="width:16px; height:16px;">
                        {{item.name}}
                    </mu-list-item-title>
                    <mu-list-item-sub-title >
                        <span class="item">
                        {{item.bureau}}<span v-show="item.bureau != null">|</span>{{item.buildName}}<span v-show="item.area != null">|</span>{{item.area}}
                        </span>
                    </mu-list-item-sub-title>

                </mu-list-item-content>


                <mu-list-item-action>
                    
                    <mu-list-item-after-text>

                    <router-link :to="{path:'/wallPointDetails',query:{id:item.id}}">详情</router-link>
                           
                    </mu-list-item-after-text>
                </mu-list-item-action>
 


                <mu-list-item button  slot="nested" style="background:#F5F5F5;" >
                    <mu-list-item-title >
                     
                            <mu-row class="wall_item">
                                <mu-col span="4">楼门|{{item.floorDoor}}</mu-col>
                                
                                <mu-col span="4">楼层|{{item.floor}}</mu-col> 

                                <mu-col span="4">房间号|{{item.roomNum}}</mu-col>
                            </mu-row>
                    </mu-list-item-title>
                </mu-list-item>

                <mu-list-item button  slot="nested" style="background:#F5F5F5;" >
                    <mu-list-item-title>
                            <mu-row  class="wall_item">
                                <mu-col span="12">位置描述|{{item.positionDescription}}</mu-col>
                            </mu-row>
                    </mu-list-item-title>
                </mu-list-item>

                <mu-list-item button  slot="nested" style="background:#F5F5F5;" >
                    <mu-list-item-title>
                            <mu-row  class="wall_item">
                                <mu-col span="6">机房类型|{{item.motorRoomType}}</mu-col>

                                <mu-col span="6">归属维护单位三级|{{item.ascriptionMaintenanceName}}</mu-col>
                            </mu-row>
                    </mu-list-item-title>
                </mu-list-item>
                

                 
            </mu-list-item>

            

            <mu-divider></mu-divider>
          </template>

      </mu-list>
    </mu-load-more>
  </mu-container>
</template>


<script>
export default {

    props:["type","search"],
    
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

            this.open =  this.open ===  i  ? '' : i;

 
        }
        ,
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
            
            params.append("type",this.type);
            params.append("name",this.search);
            params.append("page",this.currPage);

            this.$axios.post("/map/search",params).then((response)=>{
                 this.total = response.data.total
                let data = response.data.data

                if(response.data.code !== 200){
                    this.$toast.error(response.data.msg);
                }else{
                    if(!this.refreshing){
                        this.data = this.data.concat(data);
                    }
                     
                    if(this.data.length === 0){
                        this.noData = true
                    }

                }
                this.loadingData = false
                this.refreshing = false
                this.loading = false
               
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
            this.loadingData = true;
            this.currPage = 0;
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
