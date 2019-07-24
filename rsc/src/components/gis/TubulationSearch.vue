<template>
  <mu-container   class="PoleResult">

    <div v-if="noData === 1" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <span >暂无数据</span>
    </div>
    <div v-if="loadingData === 1" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <div v-loading="true" data-mu-loading-overlay-color="rgba(0, 0, 0, .6)" style="position: relative; width: 100%; height: 100%;"></div>
    </div>
      <mu-list toggle-nested v-if="loading === 1">
        <template>
            <mu-list-item  nested :open="open === 0">
                <mu-list-item-content @click="toggleShow(0)">
                    <mu-list-item-title class="wall_title">
                        <img src="../../assets/02_03.png" style="width:16px; height:16px;">
                        {{data.ashebeimiaoshu}} - {{data.bshebeimiaoshu}}
                    </mu-list-item-title>

                    <mu-list-item-sub-title >
                        <span class="item">
                        {{data.jusuomingcheng}}|{{data.chanquanleixing}}
                        </span>
                    </mu-list-item-sub-title>

                </mu-list-item-content>

                <mu-list-item-action>
                    
                    <mu-list-item-after-text>

                    <router-link :to="{path:'/tubulationDetail',query:{id:data.id}}">详情</router-link>
                           
                    </mu-list-item-after-text>
                </mu-list-item-action>
  
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
            let params=new URLSearchParams();
            params.append("id",this.search);
            this.$axios.post("/guanduan/guanDuanDetails",params).then((res)=>{
                this.loadingData = 0;
                if(res.data.code !== 200){
                    this.$toast.error(res.data.msg);
                }else{
                    if(res.data.data){
                        this.loading = 1;
                        this.data = res.data.data;
                    }else{
                        this.noData = 1;
                        this.loading = 0;
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
