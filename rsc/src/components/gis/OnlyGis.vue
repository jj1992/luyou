<template>
  <div class="map">
      <vflex style="height:100vh" :middleStyle="{}">
          <div slot="top">
               <mu-appbar style="width: 100%;" color="primary">
                    <mu-button icon slot="left" @click="navigate_back">
                        <mu-icon value="navigate_before"></mu-icon>
                    </mu-button>
                    图选
                </mu-appbar>
          </div>

          <div slot="middle">


                    <iframe name="mapifram" src="./gisMap.html" style="overflow:hidden;height:100vh;width:100vw;" @load="success"></iframe>

                    <mu-icon id="local-icon" value="gps_fixed" style="z-index: 999;"  @click="localSearch"></mu-icon>

                    <!-- 中间弹窗信息 -->
                    <mu-dialog v-if='this.dlgType == 1 || 2' :title="dlgTitle"  :open.sync="openDialog" max-width="100%"  width="96%">
                        <div style="max-height:50vh;overflow: auto;">
                    <!-- <router-view  ></router-view> --> 
                            <croomList :type="dlgType" :buildId="buildingId" @change="changeCroomListItemIndex"></croomList>
                        </div>
                        <mu-button slot="actions" flat color="primary" @click="closeScrollDialog">关闭</mu-button>
                        <mu-button slot="actions" flat color="primary" @click="todoSomthing">确定</mu-button>
                    </mu-dialog>

                    <mu-dialog v-if='this.dlgType == 3' :title="dlgTitle"  :open.sync="openDialog1" max-width="100%" width="96%">
                        <div style="max-height:50vh;overflow: auto;">
                           <div>确认要入位吗？</div>
                        </div>
                        <mu-button slot="actions" flat color="primary" @click="closeScrollDialog1">关闭</mu-button>
                        <mu-button slot="actions" flat color="primary" @click="todoSomthing1">确定</mu-button>
                    </mu-dialog>

                    <mu-bottom-sheet :open.sync="openSheet">
                        <!-- 底部楼宇信息 -->
                        <div style="max-height:30vh;overflow: auto;">
                            <buildLocal :type="buildingType" :search="name" :hasDetail="false"></buildLocal>
                        </div>
                            <!-- 底部按钮 -->
                        <mu-flex class="btnUni" align-items="center">
                        <mu-flex justify-content="center" fill>
                            <mu-button color="primary" @click="showCRoom" style="width:40%;">机房({{ motorRoomCount }})</mu-button>
                            <mu-button color="primary" @click="showWallPoint" style="width:40%; margin-left:5%;">壁挂点({{ wallPointCount }})</mu-button>
                        </mu-flex>
                        </mu-flex>      
                    </mu-bottom-sheet>

                  <mu-bottom-sheet :open.sync="openSheet2">
                    <!-- 底部放置点信息 -->
                    <div v-if="type===5" style="max-height:30vh;overflow: auto;">
                      <outplocal :type="outplType" :search="name" :has-detail="true"/>
                    </div>
                    <!-- 底部按钮 -->
                    <mu-flex class="btnUni" align-items="center">
                    <mu-flex justify-content="center" fill>
                        <mu-button color="primary" @click="showPoint" style="width:40%;">POS入位</mu-button>
                    </mu-flex>
                    </mu-flex> 
                  </mu-bottom-sheet>
        </div>

      </vflex>
  </div>
</template>

<script >

import croomList from "./CRoomList.vue"
import buildLocal from "./BuildingLocalResult"
import outplocal from "./OutPLocalResult";
export default {
  props:["posId"],
  components:{
    croomList,buildLocal,outplocal
  },
  data() {
    return {
      openSheet: false,
      openSheet2: false,
      openDialog: false,
      openDialog1: false,
      buildingId:"",
      backShow:false,
      dlgType:1,
      dlgTitle:'',
      croomListItemIndex:'',
      croomListItemId:'',
      motorRoomCount: 0,
      wallPointCount: 0,
      name:'',
      buildingType: "",
      idd:''
    };
  },
  mounted() {

   

    window.onScanResult=(str)=>{

      this.$toast.success(str);
    }
  },
  methods: {
    navigate_back(){
        this.$router.back(-1);
    },
    localSearch(){
        window.mapifram.gisParams.getCurrentLocation();
    },
    showError(msg){
      this.$toast.error(msg);
    },
    getBuildingItem(ids){
      var params=new URLSearchParams();
      for(var i=0,len=ids.length;i<len;i++){
        params.append("ids",ids[i]);
      }
      this.$axios.post("/building/getBuildingItem",params).then((response)=>{
        if(response.data.data.length > 0){
          window.mapifram.gisParams.showCRoomInMap(response.data.data);
        }
      });
    },
    success(){
        window.mapifram.gisParams.showLocalResult = this.showLocalResult;
        window.mapifram.gisParams.showOutPLocalResult = this.showOutPLocalResult;
        window.mapifram.gisParams.showError = this.showError;
        window.mapifram.gisParams.getBuildingItem = this.getBuildingItem;
        // window.mapifram.gisParams.getPlacePointList = this.getPlacePointList;
        // this.getPlacePointList('','','','');
    
    },
    showCRoom(){
        this.type = 4;
        this.openDialog = true;
        this.dlgType = 1;
        this.dlgTitle = "机房";
        // this.$router.push({path:"/ItemCRoomResult",query:{type:1,buildId:this.buildingId}});
    },
    showWallPoint(){
      this.type = 4;
      this.openDialog = true;
      this.dlgType = 2
      this.dlgTitle = "壁挂点";
        // this.$router.push({path:"/ItemWallPointResult",query:{type:2,buildId:this.buildingId}});
    },
    showPoint(){
      this.type = 5;
      this.openDialog1 = true;
      this.dlgType = 3;
      this.dlgTitle = "";
    },
    closeScrollDialog(){
      this.openDialog = false;
    },
    closeScrollDialog1(){
      this.openDialog1 = false;
    },
    changeCroomListItemIndex(croomListItemIndex,croomListItemId){
      this.croomListItemIndex = croomListItemIndex;
      this.croomListItemId = croomListItemId;
    },
    todoSomthing(){
      if(this.croomListItemIndex !== ''){
        this.openDialog = false;
        let params = new URLSearchParams();
        params.append("id", this.posId);
        params.append("type" , this.dlgType == 1 ? "MotorRoom" : (this.dlgType == 2 ? "WallPoint" : "OutdoorPoint")); 
        params.append("relateId" , this.croomListItemId); 

        this.$axios.post("/posdevoce/update",params).then((response)=>{
            if(response.data.code == 200){
                this.$toast.success('入位成功');
            }
            this.$router.back(-1);
        }).catch(function(e){
        });
      } else {
        this.$toast.warning('请选择一条');
      } 
      
    },
    todoSomthing1(){
        this.openDialog1 = false;
        let params = new URLSearchParams();
        params.append("id", this.posId);
        params.append("type" , this.dlgType == 3 ? "OutdoorPoint" : ""); 
        params.append("relateId" , this.idd); 

        this.$axios.post("/posdevoce/update",params).then((response)=>{
            if(response.data.code == 200){
                this.$toast.success('入位成功');
            }
            this.$router.back(-1);
        }).catch(function(e){
        });
    },
    showLocalResult(name,buildingType){
      this.typeShow=false;
      this.listShow=false;
			this.type = 3;
      this.openSheet=true;
      this.name = name;
      this.buildingType = buildingType;
			// this.$router.push({path:"/buildingLocalResult",query:{type:'Build',search:name}});
    },
    showOutPLocalResult(id) {
      this.typeShow = false;
      this.listShow = false;
      this.type = 5;
      this.openSheet2 = true;
      this.name = id;
      this.outplType = "OutdoorPoint";
      this.idd = id;

      // this.$router.push({
      //   path: "/outPLocalResult",
      //   query: { type: "OutdoorPoint", search: id }
      // });
    },
  }
};
</script>
<style  scoped>
#map-container {
  z-index: 1;
}
#search-container {
  margin-top: 5px;
}

#result-container {
  background-color: white;
  width: 100vw;
  max-width: 100vw;
  z-index: 999;
}
.mu-list > li {
  display: block;
  float: left;
  width: 30%;
}
.mu-list .mu-item-title {
  /* border-right: 1px solid #000; */
  color: blue;
}
.mu-input-content {
  background-color: white;
}

#local-icon{
	position: fixed;
	font-size: 24px;
  width: 30px;
  height: 30px;
	line-height:28px;
  color: rgb(244, 67, 54);
	top: 196px;
  left: 22px;
	background-color: #FFFFFF;
  border: solid #57585A 0.0525em;
  border-radius: 5px;
	background-position: center;
  background-repeat: no-repeat;
	text-align: center;
}

.btnUni{
    /* position: fixed; */
    bottom: 0;
    background-color: #fff;
    height: 60px;
    width:100%;
    box-shadow: -1px 4px 2px 0px rgba(0,0,0,.2), 0 5px 4px 0 rgba(0,0,0,.14), 0 -4px 10px 0 rgba(0,0,0,.12);
}

</style>

