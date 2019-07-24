<template>
  <mu-container   class="ManholeResult">

    <div v-if="noData === 1" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <span >暂无数据</span>
    </div>
    <div v-if="loadingData === 1" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <div v-loading="true" data-mu-loading-overlay-color="rgba(0, 0, 0, .6)" style="position: relative; width: 100%; height: 100%;"></div>
    </div>

    <!-- <mu-load-more   @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loaded-all="true"> -->
      <mu-list toggle-nested v-if="loading === 1">
 
          <!-- <template v-for="(item,index)  in data"   > -->
        <template>
            <mu-list-item  nested :open="open === 0">
        

                <mu-list-item-content @click="toggleShow(0)">
                    <mu-list-item-title class="wall_title">
                        <img src="../../assets/02_03.png" style="width:16px; height:16px;">
                        {{data.guanxianmingcheng}}-{{data.dijingbianhao}}
                    </mu-list-item-title>

                    <mu-list-item-sub-title >
                        <span class="item">
                        {{data.danweimingcheng}}|{{data.chanquanleixing}}
                        </span>
                    </mu-list-item-sub-title>

                </mu-list-item-content>


                <mu-list-item-action>
                    
                    <mu-list-item-after-text>

                    <router-link :to="{path:'/manholeDetail',query:{id:data.id}}">详情</router-link>
                           
                    </mu-list-item-after-text>
                </mu-list-item-action>

                <!-- <mu-list-item button  slot="nested" style="background:#F5F5F5;" >
                    <mu-list-item-title >
                     
                            <mu-row class="wall_item">
                                <mu-col span="6">维护单位|{{data.maintenanceDivision}}</mu-col>
                                
                                <mu-col span="6">放置点类型|{{data.type}}</mu-col>
                            </mu-row>
                    </mu-list-item-title>
                </mu-list-item>

                <mu-list-item button  slot="nested" style="background:#F5F5F5;" >
                    <mu-list-item-title>
                            <mu-row  class="wall_item">
                                <mu-col span="12">位置描述|{{data.positionDescription}}</mu-col>
                            </mu-row>
                    </mu-list-item-title>
                </mu-list-item>

                <mu-list-item button  slot="nested" style="background:#F5F5F5;" >
                    <mu-list-item-title>
                            <mu-row  class="wall_item">
                                <mu-col span="6">固定资产编号|{{data.fixedNumber}}</mu-col>

                                <mu-col span="6">归属维护单位三级|{{data.ascriptionMaintenanceName}}</mu-col>
                            </mu-row>
                    </mu-list-item-title>
                </mu-list-item> -->
                

                 
            </mu-list-item>

            

            <mu-divider></mu-divider>
          </template>

      </mu-list>
    <!-- </mu-load-more> -->
  </mu-container>
</template>


<script>
export default {

    props:["search"],
    
    data(){

        return {
            open:'',
            // refreshing:false,
            loading:0,
            data:{},
            noData:0,
            loadingData:0
        };
    },

    mounted(){ 
        //挂载后 清除所有数据 重新加载
        this.loadData();
    },
    methods:{
        toggleShow(i){
            // this.open =  this.open ===  i  ? '' : i;
        },
        loadData(){
            this.loadingData = 1;
            let that = this; 
            let params=new URLSearchParams();
            params.append("id",this.search);
            this.$axios.post("/well/wellDetails",params).then(function(response){
                that.loadingData = 0;
                if(response.data.code !== 200){
                    that.$toast.error(response.data.msg);
                }else{
                    if(response.data.data){
                        that.loading = 1;
                        that.data = response.data.data;
                    }else{
                        that.noData = 1;
                        that.loading = 0;
                    }
                }
               
           }).catch(function(e){
                that.noData = 1;
                that.loadingData = 0;
                that.loading = 0;
                that.$toast.error("数据加载错误");
           });

        },



    },

   
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
