<template>

  <div class="passiveDevice">
    <mu-tabs :value.sync="active2" color="#2196f3" text-color="#2196f3" indicator-color="#2196f3" inverse full-width>
      <mu-tab v-if="odfShow()">ODF</mu-tab>
      <mu-tab v-if="$util.hasRight('POSlist')">POS</mu-tab>
    </mu-tabs>
    <div class="demo-text" v-if="active2 === 0">
      <!-- <mu-load-more :loaded-all="loadOver_odf"  @refresh="refresh_odf" :refreshing="refreshing_odf" :loading="loading_odf" @load="load_odf" :loading-text=" loadOver_odf === true ? '已经到底了' : '正在努力加载...'"> -->
      <hf-load-more :config="config">
        <template name="loop" slot-scope="props" >
            <mu-expansion-panel :expand="expand2 === odf" v-for="odf in props.item" @change="toggleShow2(odf)" v-bind:key="odf.设备id">
              <div slot="header">
                <!-- <mu-button style="float:left; width:20px; color:#008cff;" icon slot="left"> -->
                  <!-- <mu-icon value="apps"></mu-icon> -->
                  <img src="../../assets/08_03.png" style="width:16px; height:16px; float:left; margin-top:16px;">
                <!-- </mu-button> -->
                <span style="float:left;line-height:48px; margin-left:8px;">{{odf.code}}</span>
              </div>
              <div style="width: 100%; background: #eee; padding: 8px;">
                <mu-row gutter style="text-align:center">
                  <mu-col span="4" v-for="item in odf.moduleInfo" @click="toOdfDetail(item.id,item.code)" :key="item.id">
                    <div class="grid-cell" style="border:1px solid #ccc; background:#fff; margin:8px; margin-bottom:8px;">{{item.code}}</div>
                  </mu-col>
                </mu-row>
              </div>
            </mu-expansion-panel>
        </template>
      </hf-load-more>
      <!-- </mu-load-more> -->
    </div>
    <div class="demo-text" v-if="active2 === 1">
       <hf-load-more :config="config1">
      <!-- <mu-load-more :loaded-all="loadOver_pos" @refresh="refresh_pos" :refreshing="refreshing_pos" :loading="loading_pos" @load="load_pos" :loading-text=" loadOver_pos === true ? '已经到底了' : '正在努力加载...'"> -->
        <template name="loop" slot-scope="props" >

          <mu-expansion-panel :expand="expand3 === item" @change="toggleShow(item)" v-bind:key="item.id" v-for="item in props.item" style="position:relative;">
            <div slot="header">
              <!-- <mu-button style="float:left; width:20px; color:#008cff;" icon slot="left"> -->
                <!-- <mu-icon value="domain"></mu-icon> -->
                <img src="../../assets/08_03.png" style="width:16px; height:16px; float:left; margin-top:16px;">
              <!-- </mu-button> -->
              <!-- <span style="float:left;line-height:48px; margin-left:8px;">{{item.name}}</span> -->
              <div style="float:left;line-height:48px; margin-left:8px; font-size:13px;">
                  <p style="margin:0; height:30px; line-height:30px;">{{item.name}}</p>
                  <p style="margin:0; height:30px; line-height:30px;">{{getStatus(item.status)}} | {{item.qrCode}}</p>
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
              <p>
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
              </p>
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
       </hf-load-more>
      <!-- </mu-load-more> -->
    <!--------------------------------------------------------divider------------------------------------------------------ -->

      <mu-dialog width="600" max-width="90%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
            
            <div>
              
              <mu-form :model="form"  ref="form_ly" >
                <mu-form-item prop="ly" label="楼宇" label-position="left" :rules="lyRules">
                  <mu-text-field v-model="form.ly"></mu-text-field>
                </mu-form-item>

 
             

              <mu-form-item prop="type" label="类型" label-position="left" :rules="typeRules">
                <mu-select   v-model="form.type" >
                  <mu-option v-for="(option,index) in types" :key="index" :label="option.label" :value="option.value"></mu-option>
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
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'

export default {
    props:["id",'name'],
    data() {
        return {
            types:[
              {label:'壁挂点',value:'WallPoint'},
              {label:'室外放置点',value:'OutdoorPoint'},
                {label:'机房',value:'MotorRoom'}
            ],
            name1:this.name,
            curType:'',          
            active2: 0,
            expand2: "",
            expand3: "",
            // content: [],
            // content2: [],
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
            config:{
              url:'/odfdevice/list',
              params:{
                id: this.id === undefined ? "" : this.id,
                name:this.name1 === undefined ? "" : this.name1,
              },
            },
            config1:{
              url:'/posdevoce/list',
              params:{
                id: this.id === undefined ? "" : this.id,
                name:this.name1 === undefined ? "" : this.name1,
              },
            },
            // refreshing_odf:false,
            // loading_odf:false,
            // currPage_odf:0,
            // loadOver_odf:false,
            // total_odf:0,

            // refreshing_pos:false,
            // loading_pos:false,
            // currPage_pos:0,
            // loadOver_pos:false,
            // total_pos:0,

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
        odfShow(){
          let flag = this.$util.hasRight('ODFlist');
          if(!flag){
            this.active2 = 1
          } 
          return flag;
        },
        alert1(id){
          this.$router.push({path:"/posDetail/" , query:{id:id}});
        },        
        toggleShow(item) {
            this.expand3 = this.expand3 == item ? "" : item;
        },
        toggleShow2(odf) {
            this.expand2 = this.expand2 == odf ? "" : odf;
        },
        toOdfDetail(id,code1) {
            //打开ODF详情页
             //增加权限
             if(this.$util.hasRight('ODFportList')){
                this.$router.push({ path: "/OdfPostDetail" ,query:{id:id,code1:code1}});
             }
            
            //console.log(this.code1)
        },
        // requestData() {

        //   let params = new   URLSearchParams(); 

        //   if(this.name === undefined){
        //     this.name1 = "";
        //   }

        //   if(this.id != undefined ){

        //     params.append("id",this.id);

        //   }

        //   params.append("name",this.name1);

        //   params.append("page",this.currPage_odf);
          

        //     this.$axios
        //         .post("/odfdevice/list",params)
        //         .then(res => {
        //            this.total_odf = res.data.total
        //             this.refreshing_odf = false
        //             this.loading_odf = false
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

        // requestDataPos() {



        //   let params = new   URLSearchParams(); 

        //   if(this.name === undefined){
        //     this.name1 = "";
        //   }

        //   if(this.id != undefined ){

        //     params.append("id",this.id);

        //   }

        //   params.append("name",this.name1);
        //   params.append("page",this.currPage_pos);

        //     this.$axios
        //         .post("/posdevoce/list",params)
        //         .then(res => {
        //            this.total_pos = res.data.total
        //             this.refreshing_pos = false
        //             this.loading_pos = false
        //             if(res.data.code === 200){
                      
        //               this.content2 = res.data.data;
                    
        //             }else{

        //               this.$toast.error(this.data.msg);
        //             }

        //         })
        //         .catch(() => {

        //             this.$toast
        //             .error("网络错误");
        //         });
        //     //}
        // },
        toAlertPos () {
          this.openAlert = true;
          this.searchResult = [];
        },
        closeAlertDialog () {
          this.openAlert = false;
        },
        searchPos(){
          this.show = true;
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

                  }).catch(()=>{



                  });

              }
          });


         
        },
        toIndexGIS(){
          this.$router.push({ path: "/gisMap"});
        },
        // refresh_pos(){

        //     this.refreshing_pos = true;
        //     this.currPage_pos = 0;
        //     this.requestDataPos();

        // },
        // load_pos(){
        //     this.loading_pos = true;
        //     // if(data.pageSize > this.currPage){
        //         this.currPage_pos++;
        //         // this.loadOver = false
        //     // } else {
        //         // this.loadOver = true
        //     // }
        //     this.requestDataPos();
        // },
        // refresh_odf(){

        //     this.refreshing_odf = true;
        //     this.currPage_odf = 0;
        //     this.requestData();

        // },
        // load_odf(){
        //     this.loading_odf = true;
        //     // if(data.pageSize > this.currPage){
        //         this.currPage_odf++;
        //         // this.loadOver = false
        //     // } else {
        //         // this.loadOver = true
        //     // }
        //     this.requestData();
        // },
                 
    },
    mounted() {
        // this.requestData();
        // this.requestDataPos();
    },
    watch: {
      // content:{
      //       handler(){
      //           if(this.content.length >= this.total_odf){
      //               this.loadOver_odf = true
      //           } else {
      //               this.loadOver_odf = false
      //           }
      //       }
      //   },
      //    content2:{
      //       handler(){
      //           if(this.content2.length >= this.total_pos){
      //               this.loadOver_pos = true
      //           } else {
      //               this.loadOver_pos = false
      //           }
      //       }
      //   }
    },
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
.passiveDevice >>> .mu-expansion-toggle-btn.mu-button{
  display: none;
}
.passiveDevice >>> .mu-expansion-panel-header{
  padding: 0 12px;
}
</style>
