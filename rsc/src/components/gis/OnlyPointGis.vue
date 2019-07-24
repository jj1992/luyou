<template>
  <div class="map">
      <vflex style="height:100vh" :middleStyle="{}">
          <div slot="top">
               <mu-appbar style="width: 100%;" color="primary">
                    <mu-button icon slot="left" @click="navigate_back">
                        <mu-icon value="navigate_before"></mu-icon>
                    </mu-button>
                    选取坐标
                </mu-appbar>
          </div>

          <div slot="middle">


                    <iframe name="mapifram" src="./gisMapr.html" style="overflow:hidden;height:100vh;width:100vw;" @load="success"></iframe>

                    <mu-icon id="local-icon" value="gps_fixed" style="z-index: 999;" @click="localSearch"></mu-icon>

                    <!-- 选取坐标弹出框 -->
                    <!-- <mu-dialog :open.sync="openDialog" max-width="100%" width="96%" scrollable>
                        <div style="max-height:50vh;overflow: auto;">
                          <span style="font-size:20px;font-weight:bold;color:#000;">是否确认修改坐标为:</span><br/>
                          经度： <span>{{longitude}}</span> <br/>
                          纬度： <span>{{latitude}}</span>
                        </div>
                        <mu-button slot="actions" flat color="primary" @click="close">取消</mu-button>
                        <mu-button slot="actions" flat color="primary" @click="toOutDoorDetail">确定</mu-button>
                    </mu-dialog> -->

                    <mu-bottom-sheet :open.sync="openDialog" style="width:94%;margin-left:1.5%;padding-left:10px;margin-bottom:15px;">
                        <div style="max-height:50vh;overflow: auto;">
                          <span style="font-size:16px;font-weight:bold;color:#000;padding:8px 0;display:inline-block">是否确认修改坐标为:</span><br/>
                          经度： <span>{{longitude}}</span> <br/>
                          纬度： <span>{{latitude}}</span>
                        </div>
                        <mu-button flat color="primary" @click="close" style="margin-left:150px;">取消</mu-button>
                        <mu-button flat color="primary" @click="toOutDoorDetail">确定</mu-button>
                    </mu-bottom-sheet>

        </div>

      </vflex>
  </div>
</template>

<script >


export default {
  props:['id'],
  data() {
    return {
      longitude:'',
      latitude:'',
      openDialog: false,
    };
  },
  // created() {
  //   window.mapifram.gisParams.coordinate();
  // },
  methods: {
    navigate_back(){
        this.$router.back(-1);
    },
    localSearch(){
        window.mapifram.gisParams.getCurrentLocation();
    },
    success(){
        window.mapifram.gisParams.coordinate = this.coordinate;
    },
    coordinate(x,y){
      this.openDialog = true;
      this.longitude = x;
      this.latitude = y;
      // console.log(x,y)
    },
    close(){
      this.openDialog = false
    },
    toOutDoorDetail(){
      //this.$router.push({ path: "/outDoorDetail",query:{longitudes:longitude,latitudes:latitude,id:this.id}});
      this.navigate_back();
      //console.log(longitude,latitude)
      let params = new URLSearchParams();
      params.append("id",this.id);
      params.append("x",this.longitude);
      params.append("y",this.latitude);
      this.$axios.post("/outdoorpoint/update",params).then((res) => {
        if(res.data.code === 200){
          this.$toast.success(res.data.msg);
        }else{
          this.$toast.error(res.data.msg);
        }
      })
    }
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

