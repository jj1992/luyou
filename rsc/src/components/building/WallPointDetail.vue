/*
 * @Author: yuht 
 * @Date: 2018-11-23 13:38:53 
 * @Last Modified by: yuht
 * @Last Modified time: 2018-12-25 15:17:00
 * @desc 壁挂点详情  跳转到 机房资源 本页面需要传入 壁挂点id
 */

<template>
  <div class="wpDetail">
    <!-- 标题 -->
    <div>
      <mu-appbar class="" style="width: 100vw;" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
          <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        壁挂点详情
      </mu-appbar>
      
    </div>

    <!-- 循环渲染表单 -->
    <div style="overflow:auto;padding-top:10px; margin-bottom:60px;">
      <mu-load-more @refresh="refresh" :refreshing="refreshing">
        <mu-row v-for="(item,index) in models" :key="index" class="line">
          <mu-col span="6" class="title">
            <span>{{item.title}}</span>
          </mu-col>
          <mu-col class="info">
            {{
            content[item.key]
            }}
          </mu-col>
          <mu-divider v-if="index < models.length-1"></mu-divider>
        </mu-row>
      </mu-load-more>
    </div>



    <!-- 底部的按钮 -->
    <mu-flex class="btnUni" align-items="center">
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toResourceDetails" style="width:40%;">设备列表</mu-button>
        <mu-button color="primary" @click="toAlertChange" style="width:40%; margin-left:5%;" v-if="$util.hasRight('wallPointUpdate')">类型修改</mu-button>
      </mu-flex>
    </mu-flex>  

    <!-- 类型修改弹框 -->
    <mu-dialog width="600" max-width="90%" :esc-press-close="false" :overlay-close="false" :open.sync="openChangeAlert">
      <mu-select label="类型" v-model="curType"  full-width>
        <mu-option v-for="(option,index) in types" :key="index" :label="option.label" :value="option.value"></mu-option>
      </mu-select>
      <mu-button slot="actions" flat color="primary" @click="submitChangeDialog">确认</mu-button>
      <mu-button slot="actions" flat color="primary" @click="closeChangeDialog">取消</mu-button>
    </mu-dialog>

    <!-- 坐标修改弹框 -->
    <!-- <mu-dialog width="600" max-width="90%" :esc-press-close="false" :overlay-close="false" :open.sync="openCoordinateChange">
      <mu-form :model="form"  ref="form_position" >
        <mu-form-item prop="longitude" label="经度" label-position="left" :rules="longitudeRules">
            <mu-text-field v-model="form.longitude" placeholder='请填写'></mu-text-field>                
        </mu-form-item>

        <mu-form-item prop="latitude" label="纬度" label-position="left" :rules="latitudeRules">
            <mu-text-field v-model="form.latitude" placeholder='请填写'></mu-text-field>                
        </mu-form-item>

      </mu-form> 
        <mu-button slot="actions" flat color="primary" @click="mapGetPixel">地图取点</mu-button>
        <mu-button slot="actions" flat color="primary" @click="currentCoordinates">当前坐标</mu-button>
        <mu-button slot="actions" flat color="primary" @click="submitChange">确认</mu-button>
        <mu-button slot="actions" flat color="primary" @click="closeChange">取消</mu-button>
      
    </mu-dialog> -->

  </div>

</template>

<script>
export default {
  props:['id'],
  data() {
    return {
      types:[
        {label:'通信机房',value:'CommunicationRoom'},
        {label:'末端机房',value:'BottomRoom'},
        {label:'光交接点',value:'OpticalJunctionPoint'},
        {label:'室外基站塔房',value:'OutdoorBaseTower'},
        {label:'楼内壁挂点',value:'BuildingWallPoint'},
        {label:'已腾退通信机房',value:'RetreatCommunicationRoom'},
        {label:'大客户交换机房',value:'ClientSwitchRoom'},
        {label:'大客户传输机房',value:'TransmissionRoom'},
        {label:'大客户综合机房',value:'ClientMachineRoom'},
        {label:'其他',value:'OtherRoom'},

        {label:'室外有源交接箱',value:'OutdoorActiveSwitchBox'},
        {label:'室外无源交接箱',value:'OutdoorPassiveSwitchBox'},
        {label:'室外基站',value:'OutdoorBaseStation'},
        {label:'室外电杆',value:'OutdoorPole'},

        {label:'壁挂点',value:'PONWallPoint'},
        // {label:'基站壁挂点',value:'BaseStationWallPoint'},
      ],      
      content: {
        abbreviation: "",
        altitude: "",
        area: "",
        buildName: "",
        bureauName: "",
        code: "",
        fixedAssetsCode: "",
        floor: "",
        floorDoor: "",
        longness: "",
        motorRoomType: "",
        name: "",
        positionDescription: "",
        roomNum: "",
        wide: "",
        id: null
      },
      models: [
        {
          title: "位置类型",
          key: "deviceType"
        },
         {
          title: "壁挂点名称",
          key: "name"
        },
        {
          title: "壁挂点类型", 
          key: "wallPointUse"
        },
        {
          title: "壁挂点编号",
          key: "code"
        },
        {
          title: "位置描述",
          key: "positionDescription"
        },
        {
          title: "局所",
          key: "bureauName"
        },
        {
          title: "楼宇",
          key: "buildName"
        },
        {
          title: "简称",
          key: "abbreviation"
        },
        {
          title: "楼门",
          key: "floorDoor"
        },
        {
          title: "楼层",
          key: "floor"
        },
        {
          title: "房间号",
          key: "roomNum"
        },
        {
          title: "固定资产编号",
          key: "fixedAssetsCode"
        }
      ],
      refreshing: false,
      alert:false,
      openChangeAlert: false,
      openCoordinateChange:false,
      deviceClass:'',
      curType:'请选择', 
      form:{
        longitude:'',
        latitude:'',
      },
      //经度校验
      longitudeRules: [  
      { validate: (val) =>(val >0 && val < 180 && val.length != 0), message: '经度整数部分为0-180,小数部分为0到9位!'}
      ],
      //纬度校验
      latitudeRules: [
        { validate: (val1) => (val1 >0 && val1 < 90 && val1.length != 0), message: '纬度整数部分为0-90,小数部分为0到9位!'}  
      ],     
    };
  },
  methods: {
    navigate_back() {
      this.$router.back(-1);
    },
    closeAlert() {
      this.alert = false;
    },
    initData() {
      this.requestData();
    },
    requestData() {
      let params = new URLSearchParams();
      params.append("id", this.id);
      this.$axios
        .post("/wallpoint/details", params)
        .then(res => {
          this.content = res.data.data;
          this.refreshing = false;
          this.changeDevice()
          // console.log(this.content.deviceType)
        })
        .catch(() => {
          this.refreshing = false;
        });
    },
    refresh() {
      this.refreshing = true;
      this.requestData();
    },
    toAlertChange () {
      this.openChangeAlert = true;
    },
    //判断设备大类的型号，给后端传参-数字
    changeDevice(){
      if(this.content.deviceType === '壁挂点'){
        this.deviceClass = '382'
      }
    },
    //壁挂点转机房或壁挂点转壁挂点
    wallChangeWall(){
      let params = new URLSearchParams();
      params.append("id",this.id);
      params.append("type",this.curType);
      params.append("deviceClass",this.deviceClass);
      this.$axios.post("/wallpoint/update",params).then((resp)=>{
          if(resp.data.code === 200){
              this.$toast.success(resp.data.msg); 
              this.$router.push({ path: "/gisMap",query:{}});
          }else{
            this.$toast.error(resp.data.msg);
          }
          this.openChangePoint = false;
      }).catch((e)=>{

      });
    },
    //类型修改确认
    submitChangeDialog () {
      this.openChangeAlert = false;
      if(this.curType !== '' && this.curType !== '请选择'){
        //不是放置点的四种类型时直接确定(壁挂点转机房或壁挂点转壁挂点)
        if(this.curType !== 'OutdoorActiveSwitchBox'&&this.curType !== 'OutdoorPassiveSwitchBox'&&this.curType !== 'OutdoorBaseStation'&&this.curType !== 'OutdoorPole'){
          this.wallChangeWall();
          // this.$router.push({ path: "/gisMap",query:{}});
        }else{
          //是放置点的四种类型时弹框坐标修改(机房转放置点)
          this.openCoordinateChange = true;
        }
      }
    },
    //查看设备列表
    toResourceDetails() {
      this.$router.push({path:"/computerRoomResource",query:{id:this.content.id}});
       
    },
    //修改类型取消
    closeChangeDialog () {
      this.openChangeAlert = false;
    },     
    //确认提交  传参-经纬度和id
    // submitChange(){
    //   if(this.form.longitude > 0 && this.form.longitude < 180 && this.form.latitude > 0 && this.form.latitude < 90){
    //     this.openCoordinateChange = false;
    //     this.$refs.form_position.validate().then((result) => {
    //       if(result){
    //         let params = new URLSearchParams();
    //         params.append("id",this.id);
    //         params.append("type",this.curType);
    //         params.append("deviceClass",this.deviceClass);
    //         params.append("x",this.form.longitude);
    //         params.append("y",this.form.latitude);
    //         this.$axios.post("/wallpoint/update",params).then((res) => {
    //           if(res.data.code === 200){
    //             this.$toast.success(res.data.msg);
    //             this.$router.push({ path: "/gisMap",query:{}});
    //           }else{
    //             this.$toast.error(res.data.msg);
    //           }
    //         })
    //       }
    //     })
    //   }
    // },
    //修改坐标取消
    // closeChange(){
    //   this.openCoordinateChange = false;
    //   this.form.longitude = '';
    //   this.form.latitude = '';
    //   location.href
    // },
    //获取当前坐标
    // currentCoordinates(){ 
    //   var that = this;
    //   if(window.nativeApis){
    //     window.nativeApis.startLocation();
    //     window.onLocationResult =(longitudes,latitudes)=>{
    //       var wgs = that.$coordtransform.gcj02towgs84(longitudes,latitudes);
    //       this.form.longitude = wgs[0];
    //       this.form.latitude = wgs[1];
    //     }
    //   }
    // },
    //地图取点
    // mapGetPixel(){
    //   this.$router.push({ path: "/onlyWallAndRoomGis",query:{id:this.id,type:this.curType,deviceClass:this.deviceClass}});
    // }
  },
  mounted() {
    this.initData();
  },
  // watch:{
  //     content:{
  //         handler(){
  //             this.initData();
  //         },
  //     }
  // },
  
};
</script>

<style scoped>
.wpDetail {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.info {
  text-align: right;
  font-size: 12px;
  padding: 10px 0px;
}
.title {
  font-weight: 800;
  font-size: 14px;
  padding: 10px 0px;
}
.line {
  line-height: 200%;
  padding: 0px 15px;
}
.warrning {
  position: fixed;
  bottom: 0;
  z-index: 999;
}
.btnUni{
    position: fixed;
    bottom: 0;
    background-color: #fff;
    height: 60px;
    width:100%;
}
.mu-flat-button{
    min-width: 73px;
}
</style>
