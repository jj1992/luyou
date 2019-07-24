<template>

  <div class="passiveDevicePos">
     <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <span >暂无数据</span>
    </div>
    <div v-if="loadingData" style="width:100%;text-align:center;height:50px;line-height:50px;">
        <div v-loading="true" data-mu-loading-overlay-color="rgba(0, 0, 0, .6)" style="position: relative; width: 100%; height: 100%;"></div>
    </div>
    <mu-load-more :loaded-all="loadOver"   @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">           
      <template>
        <mu-expansion-panel :expand="expand3 === item" @change="toggleShow(item)" v-bind:key="item.id" v-for="item in content2" style="position:relative;">
          <div slot="header" style="">
              <img src="../../assets/08_03.png" style="width:16px; height:16px; float:left; margin-top:16px;">
            <!-- <span style="float:left;line-height:48px; margin-left:8px; font-size:13px;">{{item.name}}</span> -->
            <div style="float:left;line-height:48px; margin-left:8px; font-size:13px;width:280px">
                <p style="margin:0; height:45px; line-height:26px;">{{item.name}}</p>
                <p style="margin:0; height:26px; line-height:26px;">{{getStatus(item.status)}} | {{item.qrCode}}</p>
            </div>
            <span style="position:absolute; right:10px; top:14px; color:red; font-size:12px;" @click="alert1(item.id)">详情</span>
          </div>
          <div class="pasdev-passivePos" style="padding-top:0;">
            <p>
              <span>
                <span style="color:#999;">建筑物 | </span>  {{item.building}}</span>
              <span>
                <span style="color:#999;">局所 | </span> {{item.bureau}}</span>
            </p>
            <p>
              <span>
                <span style="color:#999;">安装位置 | </span> {{item.installationSite}}</span>
            </p>
            <p>
              <span>
                <span style="color:#999;">设备型号 | </span> {{item.model}}</span>
            </p>
            <!-- <p>
              <span>
                <span style="color:#999;">端子总数 | </span> {{item.totalTerminalNum}}</span>
              <span>
                <span style="color:#999;">空闲端子数 | </span> {{item.freeTerminalNum}}</span>
            </p>
            <p>
              <span>
                <span style="color:#999;">占用端子数 | </span> {{item.occupyTerminalNum}}</span>
              <span>
                <span style="color:#999;">未知占用端子数 | </span> {{item.unknownTerminalNum}}</span>
            </p> -->
          </div>
          <div style="margin-top:18px;">
            <mu-flex align-items="center">
            <!-- <mu-flex justify-content="center" fill>
              <mu-button color="primary" @click="toServiceBrace">业务支撑</mu-button>
            </mu-flex> -->
              <!-- <mu-flex justify-content="center" fill>
                <mu-button color="primary" style="width:100%;" @click="toAlertPos">POS入位</mu-button>
              </mu-flex> -->
              <!-- <mu-flex justify-content="center" fill>
              <mu-button color="primary" @click="toBuildService">楼内业务</mu-button>
            </mu-flex> -->
            </mu-flex>
          </div>
                      
        </mu-expansion-panel>

      </template>
</mu-load-more>

    <!--------------------------------------------------------divider------------------------------------------------------ -->

      <mu-dialog width="600" max-width="90%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
            
            <div>
              
              <mu-form :model="form"  ref="form_ly" >
                <mu-form-item prop="ly" label="楼宇" label-position="left" :rules="lyRules">
                  <mu-text-field v-model="form.ly"></mu-text-field>
                </mu-form-item>

 
             

              <mu-form-item prop="type" label="类型" label-position="left" :rules="typeRules">
                <mu-select   v-model="form.type" >
                  <mu-option v-for="(option,index) in types" :key="index"  :label="option.label" :value="option.value"></mu-option>
              </mu-select>

              </mu-form-item>


              <mu-button color="primary" style="width:20%; float:right;" @click="searchPos">查询</mu-button>

              </mu-form>
         
            </div>

            <div v-if="searchResult.length > 0" style="width:100%; height:300px; overflow:scroll;">

              <table class="" style="width:100%; border-collapse: collapse; border:none; margin-top:10px; font-size:14px;">
                <tr>
                  <th>选中</th>
                  <th>名称</th>
                  <th>所属楼宇</th>
                </tr> 
                <tr v-for="item in searchResult" :key="item.id"  style="text-align:center;">
                  <td><mu-radio :value="item.motorId" v-model="normal.radio"></mu-radio></td>
                  <td>{{item.motorName}}</td>
                  <td>{{item.buildName}}</td>
                </tr>
              </table>
                             
            </div>            

            
            <mu-button color="primary" style="" @click="toIndexGIS" >图选</mu-button>
            <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">确认</mu-button>
            <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">取消</mu-button>
            
          </mu-dialog>        



    </div>
  
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'

export default {
    props:["id",'name','type'],
    data() {
        return {

            types:[
              {label:'壁挂点',value:'WallPoint'},
              {label:'室外放置点',value:'OutdoorPoint'},
                {label:'机房',value:'MotorRoom'}
            ],
            // curType:'',
            active2: 0,
            expand2: "",
            expand3: "",
            content: [],
            content2: [],
            openAlert: false,
            normal: {
              checkbox: true,
              radio: 1,
              switch: false
            },
            show:false,

            searchResult:[],

            form:{
              ly:"请填写",
              type:'请选择'
            },

            lyRules: [
          
            { validate: (val) => (val.length ===0 || val.length >= 4), message: '楼宇名称最少4个字'}
            ],
            typeRules: [
              { validate: (val) => !!val, message: '必须选择类别'}
            
            ],
            noData:false,
            loadingData:false,
            currPage:0,
            refreshing:false,
            loading:false,            
            loadOver:false,
            total:0,

        };
    },
    methods: {
        getStatus(status){
          if(status =="1"){
              return '未关联未入位';
          }else if(status=="2"){
              return "已关联未入位";
          }else if(status=="3"){
              return "已关联已入位";
          }else if(status=="4"){
              return "已入位未关联";
          }
        },
        refresh(){
            this.loadOver = false
            this.total = 0
            this.refreshing = true;
            this.currPage = 0;
            this.requestDataPos();

        },
        load(){
          this.loading = true;
          this.currPage++;
          this.requestDataPos();
        },
        alert1(id){
          this.$router.push({path:"/posDetail/" , query:{id:id}});
        },
        toggleShow(item) {
            this.expand3 = this.expand3 == item ? "" : item;
        },
        // toggleShow2(odf) {
        //     this.expand2 = this.expand2 == odf ? "" : odf;
        // },
        // toOdfDetail(id) {
        //     //打开ODF详情页            
        //     this.$router.push({ path: "/OdfPostDetail" ,query:{id:id}});
        // },
        // requestData() {

        //   let params = new   URLSearchParams(); 

        //   if(this.name === undefined){
        //     this.name = "";
        //   }

        //   if(this.id != undefined ){

        //     params.append("id",this.id);

        //   }

        //   params.append("name",this.name);
          

        //     this.$axios
        //         .post("/odfdevice/list",params)
        //         .then(res => {
                  

        //             if(res.data.code === 200){
                      
        //               this.content = res.data.data;
                    
        //             }else{

        //               this.$toast.error(this.data.msg);
        //             }
                
        //           })
        //         .catch(() => {

        //           this.$toast.error("网络错误");

        //         });
        //     //}
        // },

        requestDataPos() {


          this.loadingData = false;
          let params = new   URLSearchParams(); 

          if(this.name === undefined){
            this.name = "";
          }

          if(this.id != undefined ){

            params.append("id",this.id);

          }

          params.append("name",this.name);
          params.append("page",this.currPage);
          params.append("type",this.type);

            this.$axios
                .post("/map/search",params)
                .then(res => {
                                     
                    this.total = res.data.total
                    if(res.data.code === 200){
                      if(!this.refreshing){
                        this.content2 = this.content2.concat(res.data.data);
                      }
                        
                      if(this.content2.length === 0){
                          this.noData = true
                      }                    
                    }else{

                      this.$toast.error(this.data.msg);
                    }
                    this.loadingData = false
                    this.refreshing = false
                    this.loading = false   

                })
                .catch(() => {
                    this.loadingData = 0;
                    this.$toast
                    .error(this.data.msg);
                });
            //}
        },
        toAlertPos () {
          this.openAlert = true;
          this.searchResult = [];
        },
        closeAlertDialog () {
          this.openAlert = false;
        },
        searchPos(index){

 

          this.$refs.form_ly.validate().then((result) => {

              if(result){

                  let params = new URLSearchParams();

                  params.append("name",this.form.ly);
                  params.append("type",this.form.type);


                  this.$axios.post("/posdevoce/into",params).then((resp)=>{


                      if(resp.data.code === 200){

                          this.searchResult = resp.data.data;

                      }else{

                        this.$toast.error(resp.data.msg);
                      }

                  }).catch((e)=>{



                  });

              }
          });


         
        },
        toIndexGIS(){
          this.$router.push({ path: "/gisMap"});
        }                
    },
    mounted() {
        // this.requestData();
        this.requestDataPos();
        this.loadingData = true;
    },
    watch:{
        '$route'(to,from){
            this.content2 = [];
            this.noData = false
            this.loadingData = true;
            this.refreshing = false;
            this.requestDataPos();
        },
        content2:{
            handler(){
                if(this.content2.length >= this.total){
                    this.loadOver = true
                } else {
                    this.loadOver = false
                }
            }
        }
    }    
};
</script>

<style scoped>
.pasdev-flex-wrapper {
    width: 100%;
    height: 56px;
    margin-top: 8px;
}
.pasdev-flex-demo {
    width: 200px;
    height: 32px;
    background-color: #fff;
    text-align: center;
    line-height: 32px;
    margin-left: 8px;
}
.pasdev-flex-wrapper:first-child {
    margin-top: 0;
}
.pasdev-flex-demo:first-child {
    margin-left: 0;
}
.pasdev-passivePos {
    clear: both;
}
.pasdev-passivePos p {
    margin-top: 0;
    margin-bottom: 0;
}
.pasdev-passivePos span {
    display: inline-block;
    padding: 6px 0 0 3px;
    color: rgb(39, 38, 38);
}
.mu-expansion-panel__expand{
  margin: 0;
}
.passiveDevicePos >>> .mu-expansion-toggle-btn.mu-button{
  display: none;
}
.passiveDevicePos >>> .mu-expansion-panel-header{
  padding: 0 12px;
}
</style>


