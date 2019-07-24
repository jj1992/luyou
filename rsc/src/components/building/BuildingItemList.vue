<template>
  <mu-container   class="buildingItemList">

       <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <span >暂无数据</span>
    </div>
    <mu-load-more :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">
      <mu-list toggle-nested >
          
          <template v-for="(item,index) in data">

              

            <mu-list-item   nested :open="open === index" style="padding:5px 0;">
        

                <mu-list-item-content @click="toggleShow(index)">
                    <mu-list-item-title class="wall_title">
                        <img src="../../assets/02_03.png" style="width:16px; height:16px;" v-if="item.deviceType == '机房'">
                        <img src="../../assets/03_03.png" style="width:16px; height:16px;" v-if="item.deviceType == '壁挂点'">                      
                        {{item.name}}
                    </mu-list-item-title>

                    <mu-list-item-sub-title >
                        <span class="item">
                        {{cachedData.bureau}} - {{cachedData.area}} | {{cachedData.buildName}}
                        </span>
                    </mu-list-item-sub-title>

                </mu-list-item-content>

                <mu-list-item-action style="margin-right:10px;margin-top:2px;">
                    <mu-icon :value="open === index ?'keyboard_arrow_up' : 'keyboard_arrow_down'"/>
                </mu-list-item-action>
                <mu-list-item-action>
                    
                    <mu-list-item-after-text>

                        
                    <router-link v-if="item.deviceType !== '' " :to="{path: getPath(item.deviceType) ,query:{'id':item.id}}">详情</router-link>
                        
                        
                    </mu-list-item-after-text>
                </mu-list-item-action>
 

                <mu-list-item button  slot="nested" style="background:#F5F5F5;"  >
                    <mu-list-item-title>
                     
                            <mu-row class="wall_item">
                                <mu-col span="4">楼门 | {{item.floorDoor}}</mu-col>
                                
                                <mu-col span="4">楼层 | {{item.floor}}</mu-col>
                                
                                <mu-col v-if="item.roomNum != undefined" span="4">房间号 | {{item.roomNum}}</mu-col>
                            </mu-row>
                    </mu-list-item-title>
                </mu-list-item>


                <mu-list-item button  slot="nested" style="background:#F5F5F5;" >
                    <mu-list-item-title>
                            <mu-row  class="wall_item">
                                <mu-col span="12">位置描述 | {{item.positionDescription}}</mu-col>
                            </mu-row>
                    </mu-list-item-title>
                </mu-list-item>
                
                <mu-list-item button   slot="nested" style="background:#F5F5F5;" >

                        <mu-list-item-title>              
                            <mu-row  class="wall_item">
                                <mu-col span="4">机房类型 | {{item.motorRoomType}}</mu-col><mu-col span="8">归属维护三级单位 | {{item.ascriptionMaintenanceName}}</mu-col>
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

    props:["buildId","type"],
    
    data(){
        return {
            open: '',
            refreshing:false,
            loading:false,
            currPage:0,
            loadOver:false,
            data:[],
            total:0,
            cachedData:{
                'bureau':this.$store.state.BuildingDevices.bureau,
                'area':this.$store.state.BuildingDevices.area,'buildName':this.$store.state.BuildingDevices.buildName
            },
            noData:''
        };
    },

    mounted(){ 
 

        //挂载后 清除所有数据 重新加载

        // this.data = [];
        
        this.loadData();
        
     
    },
    methods:{


        refresh(){
            this.loadOver = false
            this.total = 0
            this.data = [];
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
        toggleShow(i){

            this.open =  this.open ===  i  ? '' : i;

 
        }
        ,
        loadData(){

            switch(this.type){

                case 0:
                    //全部
                    this.queryAll();
                break;

                case 1:
                //机房
               
                this.queryCRooms();

                break;

                case 2:
                //壁挂点
                this.queryWallPoints();

                break;

                case 3:
                break;
            }

        },

        queryCRooms(){
            //查询楼内机房
            this.$axios.post("/motorRoom/list?id=" + this.buildId + "&page=" + this.currPage).then((response)=>{
                
                this.total = response.data.total
                let data = response.data.data               
                this.refreshing = false
                this.loading = false
                if(response.data.code === 200){
                    this.data = this.data.concat(data);
                    if(this.data.length === 0){
                        this.noData = true
                    }else{
                        this.noData = false
                    }
                }else{
                    this.$toast.error(data.msg);
                }
            }).catch(()=>{
                this.refreshing = false
                this.loading = false
            });
        },
        queryWallPoints(){

            this.$axios.post("/wallpoint/list?id=" + this.buildId  + "&page=" + this.currPage).then((response)=>{
                
                this.total = response.data.total
                let data = response.data.data
                this.refreshing = false
                this.loading = false
                if(response.data.code === 200){
                    this.data = this.data.concat(data);
                    if(this.data.length === 0){
                        this.noData = true
                    }else{
                        this.noData = false
                    }
                }else{
                    this.$toast.error(data.msg);
                }

            }).catch(()=>{
                this.refreshing = false
                this.loading = false
            });

        },
        queryAll(){ 

            this.$axios.post("/motorRoom/all?id=" + this.buildId  + "&page=" + this.currPage).then((response)=>{
                this.total = response.data.total
                let data = response.data.data
                // if(this.refreshing){
                //     this.data = [];
                // }
                this.refreshing = false
                this.loading = false
                if(response.data.code === 200){
                    this.data = this.data.concat(data);
                    if(this.data.length === 0){
                        this.noData = true
                    }else{
                        this.noData = false
                    }
                }else{
                    this.$toast.error(data.msg);
                }
            }).catch(()=>{
                this.refreshing = false;
                this.loading = false
            });
        },
        getPath(deviceType){
 
            switch(deviceType){
 
                 case "机房":
 
                 return "/computerRoomDetails";
     
                 case "壁挂点":
 
                return "/wallPointDetails";
                 
             }
        }
    },

    watch:{
        type:{
            handler(curVal,oldVal){
                this.data = [];     
                //重置展开状态
                this.open = "";
                // if(!(curVal) && curVal != 0) return;
                // if(this.data.length == 0)
                // {
                //     this.loadData();
                
                // }
                this.refreshing = true
                this.loadOver = false
                this.total = 0
                this.currPage = 0;
                this.loadData();
            },
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
        
        
    },
   
}
</script>


<style scoped>

.buildingItemList{

    padding: 0px;
    height:100%;

}
.wall_item{
    font-size: 12px;
}
.wall_title{
    font-size: 12px;
    font-weight: bold;
    overflow:visible;
    white-space: normal;
    height:28px;
    line-height: 16px;
    margin-top:7px;
}
.mu-list{
    padding:0;
    
}
.container{
    padding-left:0;
    padding-right:0;
}
.mu-item-action{
    min-width: 24px;
}
.material-icons{
    font-size: 20px;
}
.mu-item-sub-title{
    margin-top:3px;
}
</style>
