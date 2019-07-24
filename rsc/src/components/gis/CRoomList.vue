<template>
    <div>
       <mu-load-more :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">
    <div v-for="(item,index) in data" :key="index">
        <mu-expansion-panel :expand="panel === index" @change="toggle(index)">
            <div slot="header">
                <mu-row>
                    <mu-radio :value="index" v-model="panel"  disabled  style="color: #2196f3"></mu-radio>&nbsp;
                    <div class="itemTitle">
                        <img src="../../assets/02_03.png" style="width:16px; height:16px;" v-if="item.deviceType == '机房'">
                        <img src="../../assets/03_03.png" style="width:16px; height:16px;" v-if="item.deviceType == '壁挂点'">  
                        {{item.name}}
                    </div>
                </mu-row>
                <mu-row>
                    <div class="itemTitle">
                        {{cachedData.bureau}}-{{cachedData.area}}|{{cachedData.buildName}}
                    </div>
                </mu-row>
            </div>
            <div slot="default">
                <div style="background-color:#F5F5F5;padding:0px 5px;">
                    <mu-row class="items-row">
                        <mu-col>
                            楼门 | {{item.floorDoor}}
                        </mu-col>
                        <mu-col>
                            楼层 | {{item.floor}}
                        </mu-col>
                    </mu-row>
                    <mu-row class="items-row">
                        <mu-col>
                            房间号 | {{item.roomNum}}
                        </mu-col>
                    </mu-row>
                    <mu-row class="items-row">
                        <mu-col>位置描述 | {{item.positionDescription}}</mu-col>
                    </mu-row>
                    <mu-row class="items-row">
                        <mu-col>机房类型 | {{item.motorRoomType}}</mu-col>
                    </mu-row>
                    <mu-row class="items-row">
                        <mu-col>归属维护三级单位 | {{item.ascriptionMaintenanceName}}</mu-col>
                    </mu-row>
                </div>
                
            </div>
        </mu-expansion-panel>
    </div>
    </mu-load-more>
  </div>

</template>

<script>
export default {
  props: ["buildId", "type"],
  data() {
    return {
      data: [],
      panel:'',
      cachedData:{
        'bureau':this.$store.state.BuildingDevices.bureau,'area':this.$store.state.BuildingDevices.area,'buildName':this.$store.state.BuildingDevices.buildName
      },
      refreshing:false,
      loading:false,
      currPage:0,
      loadOver:false,
      total:0,
    };
  },
  methods: {
    init() {
      switch (this.type) {
        case 1:
          this.queryCRoom();
          break;
        case 2:
          this.queryWallPoint();
          break;
      }
    },
    refresh(){
            this.loadOver = false
            this.total = 0
            this.refreshing = true;
            this.currPage = 0;
            this.data = [];
            this.init();
    },
    load(){
        this.loading = true;
        // if(data.pageSize > this.currPage){
            this.currPage++;
            // this.loadOver = false
        // } else {
            // this.loadOver = true
        // }
        this.init();
    },
 
    queryCRoom() {
    //   const loading = this.$loading();
      this.$axios
        .post("/motorRoom/list?id=" + this.buildId  + "&page=" + this.currPage)
        .then(response => {
             this.total = response.data.total
          let resultCode = response.data.code;
          const data = response.data.data;
          if (resultCode == 200) {
            //   if(!this.refreshing){
                   this.data = this.data.concat(data);
            //   } 
          }
            this.loadingData = false
            this.refreshing = false
            // this.loading = false
        //   loading.close();
          //   this.refreshing = false;
        })
        .catch(function() {
          // this.refreshing = false;
        });
    },
    queryWallPoint() {
    //   const loading = this.$loading();
      this.$axios
        .post("/wallpoint/list?id=" + this.buildId + "&page=" + this.currPage)
        .then(response => {
             this.total = response.data.total
          let resultCode = response.data.code;
          const data = response.data.data;
          if (resultCode == 200 && data.length > 0) {
            //   if(!this.refreshing){
                   this.data =this.data.concat(data);
            //   } 
          }
            this.loadingData = false
            this.refreshing = false
            this.loading = false
        //   loading.close();
          //   this.refreshing = false;
        })
        .catch(function() {
          // this.refreshing = false;
        });
    },
    toggle (panel) {
      this.panel = panel === this.panel ? '' : panel;
      this.$emit("change",this.panel,this.data[panel].id);
    }
  },
  mounted() {
    this.init();
  },
  watch: {
      type:{
          handler(){
              this.refresh()
          }
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
};
</script>

<style scoped>
.itemTitle{
    max-width:50vw;
    font-size: 14px;
}
.items-row{
    padding :5px 0px;
}
.mu-expansion-panel-header{
    font-size: 12px;
}
</style>
