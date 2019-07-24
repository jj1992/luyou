/*
 * @Author: yuht 
 * @Date: 2018-11-23 13:38:53 
 * @Last Modified by: yuht
 * @Last Modified time: 2018-12-19 10:08:55
 * @desc 室外放置点详情  跳转到 机房资源 本页面需要传入 壁挂点id
 */

<template>
  <div class="OutDoorDetail">
    <!-- 标题 -->
    <div>
      <mu-appbar class="" style="width: 100vw;" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
          <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        室外放置点详情
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
        <mu-button color="primary" @click="toResourceDetails" style="width:27%;">设备列表</mu-button>
        <mu-button color="primary" @click="toAlertChange" style="width:27%;margin-left:1%;" v-if="$util.hasRight('outdoorPointUpdate')">类型修改</mu-button>
        <mu-button color="primary" @click="toCoordinateChange" style="width:27 %;margin-left:1%;">坐标修改</mu-button>
        <mu-button v-if="$util.hasRight('resourcePrediction')" color="primary" @click='toServiceBrace' style="margin-left:1%;">业务资源预判</mu-button>
      </mu-flex>
    </mu-flex>       
    <!-- 类型修改弹框1 -->
    <mu-dialog width="600" max-width="90%" :esc-press-close="false" :overlay-close="false" :open.sync="openChangeAlert">
  
      <mu-select label="类型" v-model="curType"  full-width> 

        <mu-option v-for="(option,index) in types" :key="index" :label="option.label" :value="option.value"></mu-option>

      </mu-select>

      <mu-button slot="actions" flat color="primary" @click="submitChangeDialog">确认</mu-button>
      <mu-button slot="actions" flat color="primary" @click="closeChangeDialog">取消</mu-button>
    </mu-dialog>

    <!-- 类型修改弹框2 -->
    <mu-dialog width="600" max-width="90%" :esc-press-close="false" :overlay-close="false" :open.sync="openChangePoint">
        <div>
              
          <mu-form :model="form1"  ref="form_point" >
          <mu-form-item prop="point" label="楼宇名称" label-position="left" :rules="pointRules" style="position:relative;">
              <mu-text-field v-model="form1.point" placeholder='请填写' @focus="()=>{this.flag=true}" @blur="()=>{this.flag=false}"></mu-text-field>                
          </mu-form-item>

          <mu-button color="primary" style="width:20%; float:right;" @click="searchPoint">查询</mu-button>

          </mu-form>
      
        </div>
        <!-- 查询名称 -->
        <div v-if="searchResult.length > 0" style="width:100%; height:300px; overflow:scroll;">
        <mu-load-more  :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">        
          <table class="" style="width:100%; border-collapse: collapse; border:none; margin-top:10px; font-size:14px;">
            <tr>
              <th>选中</th>
              <th>楼宇名称</th>
            </tr> 
            <tr v-for="item in searchResult" :key="item.id" style="text-align:center;">
              <td><mu-radio :value="item.id" v-model="radio"></mu-radio></td>
              <td>{{item.name}}</td>
            </tr>
          </table>
          </mu-load-more>               
        </div> 
        <mu-button slot="actions" v-if="confirmShow" flat color="primary" @click="confirmPointUpdate">确认</mu-button>
        <mu-button slot="actions" flat color="primary" @click="closePoint">关闭</mu-button>
    </mu-dialog>

    <!-- 坐标修改弹框 -->
    <mu-dialog width="600" max-width="90%" :esc-press-close="false" :overlay-close="false" :open.sync="openCoordinateChange">
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
      
    </mu-dialog>

  </div>

</template>

<script>
export default {
  props:['id'],
  data() {
    return {
      searchResult:[],
      // types:[
      //   {label:'壁挂点',value:'WallPoint'},
      //    {label:'室外放置点',value:'OutdoorPoint'},
      //     {label:'机房',value:'MotorRoom'}
      // ],
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
          key: "type"
        },
        {
          title: "放置点名称",
          key: "name"
        },
        {
          title: "放置点编号",
          key: "code"
        },
        {
          title: "放置点类型",
          key: "deviceType"
        },
        {
          title: "位置描述",
          key: "positionDescription"
        },
        {
          title: "简称",
          key: "shortName"
        },
        {
          title: "区局",
          key: "reseau"
        },
        {
          title: "局所", 
          key: "bureau"
        },
        {
          title: "维护单位",
          key: "maintenanceDivision"
        },
        {
          title: "固定资产编号",
          key: "fixedNumber"
        },
        {
          title: "归属维护单位三级",
          key: "ascriptionMaintenanceName"
        }
      ],
      refreshing: false,
      alert:false,
      openChangeAlert: false,
      openCoordinateChange:false,
      openChangePoint:false,
      flag:false,
      confirmShow:false,
      radio:'',
      deviceClass:'',
      idx:'',
      loading:false,
      loadingData:false,
      currPage:0,
      loadOver:false,
      total:0,
      form:{
        longitude:'',
        latitude:'',
      },
      form1:{
        point:''
      },
      //经度校验
      longitudeRules: [  
      { validate: (val) =>(val >0 && val < 180 && val.length != 0), message: '经度整数部分为0-180,小数部分为0到9位!'}
      ],
      //纬度校验
      latitudeRules: [
        { validate: (val1) => (val1 >0 && val1 < 90 && val1.length != 0), message: '纬度整数部分为0-90,小数部分为0到9位!'}  
      ],
      //楼宇名称字数限制
      pointRules:[
        {validate: (val) => (val.length !==0 || val.length >= 2), message: '名称最少2个字'}
      ],
      curType:'请选择',   
    };
  },
  methods: {
    navigate_back() {
      this.$router.back(-1);
    },
    //跳转到资源预判页面
    toServiceBrace(){
      this.$router.push({ path:"/serviceBrace",query:{id:this.content.id,type:this.content.type,buildName:this.content.name,bureauId:this.content.bureauId}});
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
        .post("/outdoorpoint/details", params)
        .then(res => {
          this.content = res.data.data;
          this.refreshing = false;
          this.changeDevice()
          // console.log(this.content.type,this.deviceClass);
          this.serviceData.id = res.data.data.id
          this.serviceData.type = res.data.data.type
        })
        .catch(() => {
          this.refreshing = false;
        });
    },
    
    toAlertChange () {
      this.openChangeAlert = true;
    },
    //类型修改确认
    submitChangeDialog () {
      if(this.curType !== '' && this.curType !== '请选择'){
        //类型修改框1关闭
        this.openChangeAlert = false;
        //不是放置点的四种类型时弹出类型修改框2(放置点转机房或放置点转壁挂点)
        if(this.curType !== 'OutdoorActiveSwitchBox'&&this.curType !== 'OutdoorPassiveSwitchBox'&&this.curType !== 'OutdoorBaseStation'&&this.curType !== 'OutdoorPole'){
          this.openChangePoint = true;
        }else{
          //是放置点的四种类型时直接确定(放置点转放置点)
          this.pointChangePoint();
        }
      }
      this.searchResult = [];

    },
    //类型修改2中取消按钮
    closePoint(){
      this.openChangePoint = false;
      this.confirmShow = false;
      this.form1.point = '';
      this.curType = '请选择';
    },
    //类型修改2中查询按钮
    searchPoint(){
      this.confirmShow = true;
      this.$refs.form_point.validate().then((result) => {
          if(result){
              this.$axios.post("/wallpoint/queryBuilding?name=" + this.form1.point + "&page=" + this.currPage).then((resp)=>{     
                  this.total = resp.data.total
                  this.loadingData = false
                  this.refreshing = false
                  this.loading = false 
                  if(resp.data.code === 200){
                    if(!this.refreshing){
                        this.searchResult = this.searchResult.concat(resp.data.data);  
                    }
                    // this.searchResult = resp.data.data
                  }else{
                    this.$toast.error(resp.data.msg);
                  }
                  // if(this.searchResult.length === 0){
                  //   this.$toast.error('暂无数据');
                  // }
              }).catch((e)=>{

              });
          }
      });
    },
    refresh() {
      this.refreshing = true;
      this.loadOver = false
      this.total = 0
      this.currPage = 0;
      this.searchPoint();
      this.requestData();
    },
    load(){
        this.loading = true;
        // if(data.pageSize > this.currPage){
            this.currPage++;
            // this.loadOver = false
        // } else {
            // this.loadOver = true
        // }
        this.searchPoint();
    },
    //判断设备大类的型号，给后端传参-数字
    changeDevice(){
      if(this.content.type === '放置点'){
        this.deviceClass = '383'
      }
    },
    //放置点类型相互转换
    pointChangePoint(){
      let params = new URLSearchParams();
      params.append("id",this.id);
      params.append("type",this.curType);
      params.append("deviceClass",this.deviceClass);
      this.$axios.post("/wallpoint/update",params).then((resp)=>{
          if(resp.data.code === 200){
              this.$toast.success(resp.data.msg);
              
          }else{
            this.$toast.error(resp.data.msg);
          }
          
          this.openChangePoint = false;
      }).catch((e)=>{

      });
    },
    //查询名称后，确认提交，传递的参数有buildId  id type deviceClass
    confirmPointUpdate(){
      const relateId = this.radio 
      if(relateId!=''){
          let params = new URLSearchParams();
          params.append("id",this.id);
          params.append("type",this.curType);
          params.append("buildId",relateId);
          params.append("deviceClass",this.deviceClass);
          params.append("relateId",relateId);
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
      }
      // this.$router.push({ path: "/gisMap",query:{}});
    },
    toResourceDetails() {
      this.$router.push({path:"/computerRoomResource",query:{id:this.content.id}});
       
    },
    //类型修改框1取消
    closeChangeDialog () {
      this.openChangeAlert = false;
    },
    
    // 修改当前坐标的方法
    toCoordinateChange(){
      this.openCoordinateChange = true;
      // this.form.longitude = this.longitudes;
      // this.form.latitude = this.latitudes;
    },
    //确认提交  传参-经纬度和id
    submitChange(){
      if(this.form.longitude > 0 && this.form.longitude < 180 && this.form.latitude > 0 && this.form.latitude < 90){
        this.openCoordinateChange = false;
        this.$refs.form_position.validate().then((result) => {
          if(result){
            let params = new URLSearchParams();
            params.append("id",this.id);
            params.append("x",this.form.longitude);
            params.append("y",this.form.latitude);
            this.$axios.post("/outdoorpoint/update",params).then((res) => {
              if(res.data.code === 200){
                this.$toast.success(res.data.msg);
                this.$router.push({ path: "/gisMap",query:{}});
              }else{
                this.$toast.error(res.data.msg);
              }
            })
          }
        })
      }
      // console.log(this.id,this.form.longitude,this.form.latitude)
    },
    //取消
    closeChange(){
      this.openCoordinateChange = false;
      this.form.longitude = '';
      this.form.latitude = '';
      location.href
    },
    //获取当前坐标
    currentCoordinates(){ 
      var u = navigator.userAgent
      // var app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(isAndroid){
        var that = this;
        if(window.nativeApis){
          window.nativeApis.startLocation();
          window.onLocationResult =(longitudes,latitudes)=>{
            var wgs = that.$coordtransform.gcj02towgs84(longitudes,latitudes);
            this.form.longitude = wgs[0];
            this.form.latitude = wgs[1];
          }
        }
      }
      else if(isIOS){
          window.getLocation()
          window.alertTexts=(str1,str2)=>{
              this.form.longitude = str1;
              this.form.latitude = str2;
          }
      }
    },
    //地图取点
    mapGetPixel(){
      this.$router.push({ path: "/onlyPointGis",query:{id:this.id}});
    }
  },
  watch:{
      '$route'(to,from){
          this.searchResult = [];
          this.currPage = 0;
          this.loading = false;
          this.searchPoint();
      },
      searchResult:{
          handler(){
              if(this.searchResult.length >= this.total){
                  this.loadOver = true
              } else {
                  this.loadOver = false
              } 
          }
      }
  },
  mounted() {
    this.initData();
  },
};
</script>

<style scoped>
.OutDoorDetail {
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
.inp{
  width:113px;
  border:1px solid #ccc;
}
.mu-input{
  font-size:14px;
}
.mu-flat-button{
    min-width: 73px;
}
</style>
