<template>
  <div class="OdfPostDetailTable">
    <ul class="pasdev-postInfo" style="padding-bottom:5px;">
      <li v-for="(item1,index) in terminalInfo" :key="index">
          <mu-chip style="border-radius:0px;margin-left: 12px;text-align:center; padding:0; font-size:12px;" :color="getStatus(item1.status)" @click="getItem(item1,index)">
              {{item1.terminalNum}}
          </mu-chip>
      </li>
    </ul>
    <div class="pasdev-postInfo-explain">
      <mu-chip color="rgb(128,128,128)">
      </mu-chip>
      <span>空闲</span>

      <mu-chip color="rgb(0,255,255)">
      </mu-chip>
      <span>预占</span>

      <mu-chip color="rgb(0,255,0)">
      </mu-chip>
      <span>占用</span>

      <mu-chip color="rgb(255,128,0)"> 
      </mu-chip>
      <span>预留</span>

      <mu-chip color="rgb(255,0,0)">
      </mu-chip>
      <span>故障</span>

      <mu-chip color="rgb(232,232,232)"> 
      </mu-chip>
      <span>空端子</span>      

      <mu-chip color="rgb(128,128,0)"> 
      </mu-chip>
      <span>未知占用</span>      

      <mu-chip color="rgb(0,0,255)">
      </mu-chip>
      <span>跳接</span>

       <mu-chip color="rgb(0,0,255)">
      </mu-chip>
      <span>宽带占用</span>     

      <mu-button v-if="$util.hasRight('ODFportStatusUpdate') && (status === '0' || status === '6')  " :color="color" small style=" margin-right: 0px;float:right;" @click="openAlertDialog1()">{{text}}</mu-button>
      <mu-button v-if="$util.hasRight('ODFportStatusUpdate') && (status === '0' || status === '6')  " small style=" margin-right: 0px;float:right; background:rgb(255,0,0); color:#fff;" @click="openAlertDialog2()">故障</mu-button>
    </div>
    <!-- 该状态弹窗1 -->
    <mu-dialog title="确认修改？" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert1">
        <mu-button slot="actions" flat color="primary" @click="change()">确认</mu-button>
        <mu-button slot="actions" flat color="primary" @click="closeAlertDialog1">取消</mu-button>
    </mu-dialog>
    <!-- 该状态弹窗2 -->
    <mu-dialog title="确认修改？" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert2">
        <mu-button slot="actions" flat color="primary" @click="change2()">确认</mu-button>
        <mu-button slot="actions" flat color="primary" @click="closeAlertDialog2">取消</mu-button>
    </mu-dialog>        
  </div>
</template>
<script>
export default {
    props:{
      terminalInfo:Array,
    },
    data() {
        return {
            curIndex:0,
            status:"-1",
            color:"",
            text:"",
            openAlert1:false,
            openAlert2:false
        };
    },
    mounted(){
        
    },
    methods:{
        openAlertDialog1() {
            this.openAlert1 = true;
        },
        closeAlertDialog1() {
            this.openAlert1 = false;
        },
        openAlertDialog2() {
            this.openAlert2 = true;
        },
        closeAlertDialog2() {
            this.openAlert2 = false;
        },                
        getStatus(status){
            if(status =="1"){
                return "rgb(0,255,255)";
            }else if(status=="2"){
                return "rgb(0,255,0)";
            }else if(status=="0"){
                return "rgb(128,128,128)";
            }else if(status=="6"){
                return "rgb(128,128,0)";
            }else if(status=="4"){
                return "rgb(255,0,0)";
            }else if(status == "3"){
                return "rgb(255,128,0)";
            }else if(status == "5"){
                return "rgb(232,232,232)";
            }else if(status == "7"){
                return "rgb(0,0,255)";
            }else if(status == "8"){
                return "rgb(0,0,255)";
            }
        },
        getItem(item,index){
            
            this.curIndex = index;
            this.status=item.status;
            this.$parent.itemExpend(item);
            if(item.status==="0"){

               this.color= "rgb(128,128,0)";
               this.text="未知占用"

            }else if(item.status==="6"){

               this.color= "rgb(128,128,128)";
                this.text="空闲"
            }
        },
        change(){
            this.openAlert1 = false;
            let updateString="";
            if(this.status=== "6"){
                updateString="UnknownToFree";
            }else if(this.status==="0"){
                updateString="FreeToUnknown";

            }
            let item=this.terminalInfo[this.curIndex];
            var params=new URLSearchParams();
            params.append("id",item.id);
            params.append("status",item.status);
            params.append("type",updateString);
            this.$axios.post("/odf/edit",params).then((response)=>{
                if(response.data.code==200){
                     this.$toast.message('修改成功');
                     if(this.status=== "6"){
                        this.terminalInfo[this.curIndex].status = "0";
                        this.status = "0";
                        this.color= "rgb(128,128,0)";
                        this.text="未知占用";
                    }else if(this.status==="0"){
                        this.terminalInfo[this.curIndex].status = "6";
                        this.status ="6";
                        this.color= "rgb(128,128,128)";
                        this.text="空闲"
                    }
                }else{
                     this.$toast.warning('修改失败');
                }
            }).catch(()=>{
                 this.$toast.warning('请求异常');
            })

        },
        change2(){
            this.openAlert2 = false;
            let updateString="";
            if(this.status=== "6"){
                updateString="UnknownToFault";
            }else if(this.status==="0"){
                updateString="FreeToFault";

            }
            let item=this.terminalInfo[this.curIndex];
            var params=new URLSearchParams();
            params.append("id",item.id);
            params.append("status",item.status);
            params.append("type",updateString);
            this.$axios.post("/odf/edit",params).then((response)=>{
                if(response.data.code==200){
                     this.$toast.message('修改成功');
                     if(this.status=== "6"){
                        this.terminalInfo[this.curIndex].status = "4";
                        this.status = "4";
                        this.color= "rgb(255,0,0)";
                        //this.text="未知占用";
                    }else if(this.status==="0"){
                        this.terminalInfo[this.curIndex].status = "4";
                        this.status ="4";
                        this.color= "rgb(255,0,0)";
                        //this.text="空闲"
                    }
                }else{
                     this.$toast.warning('修改失败');
                }
            }).catch(()=>{
                 this.$toast.warning('请求异常');
            })

        }       
    }
}
</script>

<style  scoped>
.pasdev-postInfo {  
    height: 176px;
    padding: 0;
    overflow: scroll;
}
.pasdev-postInfo li{
    margin-top: 5px;
    
    list-style: none;
    text-align: center;
    float: left;
    width: 16%;
    line-height: 30px;
    padding: 10px 10px 0px 10px;
}

.pasdev-postInfo-explain {
    overflow: hidden;
}
.pasdev-postInfo-explain span {
    margin-left: 5px;
    font-size: 12px;
}
.pasdev-postInfo-explain span:nth-child(odd) {
    width: 10px;
    height: 10px;
    margin-top: 4px;
}

.pasdev-postInfo-explain > .mu-chip {
    border-radius: 0px;
    padding: 0px;
    width: 100%;
}
.pasdev-postInfo >li>.mu-chip{
    width: 100%;
    display:block;
    
}

</style>
