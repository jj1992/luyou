<template>
  <mu-container   class="buildingLocalResult">
      
    <div v-if="noData === 1" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <span >暂无数据</span>
    </div>
    <div v-if="loadingData === 1" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <div v-loading="true" data-mu-loading-overlay-color="rgba(0, 0, 0, .6)" style="position: relative; width: 100%; height: 100%;"></div>
    </div>

    <!-- <mu-load-more  @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loaded-all="true"> -->
      <mu-list toggle-nested v-if="loading === 1">
 
          <!-- <template v-for="(item,0)  in data"   > -->
          <template >

              

            <mu-list-item  nested :open="open === 0">
        

                <mu-list-item-content @click="toggleShow(0)">
                    <mu-list-item-title class="wall_title">
                        <img src="../../assets/01_03_03.png" style="width:16px; height:16px;">
                        {{data.name}}
                    </mu-list-item-title>

                    <mu-list-item-sub-title >
                        <span class="item">
                        {{data.bureau}}|{{data.address}}
                        </span>
                    </mu-list-item-sub-title>

                </mu-list-item-content>

                <!-- <mu-list-item-action @click="showLocalInMap(item)">
                    <mu-icon value="location_on"/>
                </mu-list-item-action> -->
                <mu-list-item-action>
                    
                    <mu-list-item-after-text>

                    <router-link :to="{path:'/buildingDetail',query:{id:data.constructionNo,buildingType:data.buildingType}}" v-if="!!(hasDetail)">详情&nbsp;></router-link>
                           
                    </mu-list-item-after-text>
                </mu-list-item-action>
 


                <mu-list-item button  slot="nested" style="background:#F5F5F5;">
                    <mu-list-item-title >
                     
                            <mu-row class="wall_item">
                                <mu-col span="6">行政区|{{data.district}}</mu-col>
                                
                                <mu-col span="6">物理网络|{{data.reseau}}</mu-col> 
                            </mu-row>
                    </mu-list-item-title>
                </mu-list-item>


                <mu-list-item button  slot="nested" style="background:#F5F5F5;">
                    <mu-list-item-title>
                            <mu-row  class="wall_item">
                                <mu-col span="16">楼宇类型|{{getBuildingType(data.buildingType)}}</mu-col>
                            
                                <mu-col span="6">楼宇类别|{{data.buildingCategory}}</mu-col>
                            </mu-row>
                    </mu-list-item-title>
                </mu-list-item>
                
                <mu-list-item button   slot="nested" style="background:#F5F5F5;">

                        <mu-list-item-title>              
                            <mu-row  class="wall_item">
                                
                                <mu-col span="16">运行状态|{{data.status}}</mu-col>
                            
                                <mu-col span="6">是否综合布线|{{data.snthesize}}</mu-col>
                           
                            </mu-row>
                        </mu-list-item-title>
                    

                </mu-list-item>

                 
            </mu-list-item>

            

            <mu-divider></mu-divider>
          </template>

      </mu-list>
    <!-- </mu-load-more> -->
  </mu-container>
</template>


<script>
export default {

    props:[
        "type",
        "search",        
        "hasDetail"
    ],
    
    data(){

        return {
            open:'',
            // refreshing:false,
            loading:0,
            data:[],
            noData:0,
            loadingData:0
        };
    },
    mounted(){ 
        //挂载后 清除所有数据 重新加载
        this.loadData();
    },
    methods:{
        getBuildingType(num){
            if(num === '0'){
                return '楼宇'
            }else if(num === '1'){
                return '平房'
            }
        },
        toggleShow(i){
            this.open =  this.open ===  i  ? '' : i;
        },
        // refresh(){
        //     // this.refreshing = true;
        //     // this.loadData();
        // },
        load(){

        },
        loadData(){
            this.loadingData = 1; 
            let params=new URLSearchParams();
            params.append("buildingType",this.type);
            params.append("id",this.search);
            console.log(this.type,this.search)
            this.$axios.post("/building/details",params).then((response)=>{
                this.loadingData = 0;
                if(response.data.code !== 200){
                    this.noData=1;
                    this.loadingData = 0;
                    this.loading = 0;
                    this.$parent.$parent.openSheet=false;
                    this.$toast.error(response.data.msg);
                }else{
                    if(response.data.data){
                        this.loading = 1;
                        this.$parent.$parent.sheetButton=1;
                        this.data = response.data.data;
                        let buildId = this.data.constructionNo;
                        this.$parent.$parent.buildingId = buildId;
                        this.$parent.$parent.motorRoomCount = this.data.motorRoomCount;
                        this.$parent.$parent.wallPointCount = this.data.wallPointCount;
                        this.$parent.$parent.$parent.buildingId = buildId;
                        this.$parent.$parent.$parent.motorRoomCount = this.data.motorRoomCount;
                        this.$parent.$parent.$parent.wallPointCount = this.data.wallPointCount;
                        // this.$store.state.BuildingDevices.buildingId = buildId;
                        // this.$store.state.BuildingDevices.motorRoomCount = this.data.motorRoomCount;
                        // this.$store.state.BuildingDevices.wallPointCount = this.data.wallPointCount;
                        
                    }else{
                        this.$parent.$parent.sheetButton=0;
                        this.noData=1; 
                        this.loading = 0;
                    }
                }
                
           }).catch(function(e){
                this.noData = 1;
                this.loadingData = 0;
                this.loading = 0;
                this.$toast.error("数据加载错误");
           });

        }
        
    },

   
}
</script>


<style scoped>

.buildingLocalResult{
    padding: 0px;
}
.wall_item{
    font-size: 12px;
}
.wall_title{
    font-size: 14px;
    font-weight: bold;
}

</style>
