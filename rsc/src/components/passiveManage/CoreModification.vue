<template>
    <div>
       
        <vflex :middleStyle="{}">
            <div slot="top">
                 <mu-appbar class="" color="primary">
                    <mu-button icon slot="left" @click="navigate_back">
                        <mu-icon value="navigate_before"></mu-icon>
                    </mu-button>
                    改芯
                    <mu-button icon slot="right" @click="openAlertDialog">
                        <mu-icon value="save"></mu-icon>
                    </mu-button>
                </mu-appbar>
                    <mu-row style="padding:10px;">
                        <mu-col style="font-size: 18px;font-weight: bold;">    
                            所属缆段: {{data.segment}}
                        </mu-col>
                        <mu-col style="font-size: 18px;font-weight: bold;">
                            业务类型: {{data.businessType == 'doubles' ? '双芯' : '单芯'}}
                        </mu-col>
                    </mu-row>
                <mu-divider></mu-divider>
                <mu-row>
                    <mu-col>
                        <mu-chip color="primary" class="selectChip" v-for="(chip, index) in chips" :key="chip" @delete="remove(index)" delete>{{chip}}</mu-chip>
                    </mu-col>
                </mu-row>
            </div>
           <div slot="middle">
                 <div v-for="(item,index) in data.modules" :key="index">
                     <mu-expansion-panel :expand="panel === index" @change="toggle(index)">
                        <div slot="header">{{item.code}}</div>
                        <ul class="pasdev-postInfo" style="padding-bottom:5px;">
                            <li v-for="(info,infoIndex) in item.terminalInfo" :key="infoIndex">
                                <mu-chip style="border-radius:0px;margin-left: 12px;text-align:center; padding:0; font-size:12px;" :color="getStatus(info.status)" @click="getItem(info,infoIndex,item.code)">
                                    {{info.code}}
                                </mu-chip>
                            </li>
                        </ul>
                    </mu-expansion-panel>
                </div> 
            </div>
        </vflex>
        <!-- 该状态弹窗1 -->
        <mu-dialog title="确认修改？" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
            <mu-button slot="actions" flat color="primary" @click="modifyChip()">确认</mu-button>
            <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">取消</mu-button>
        </mu-dialog>        
    </div>
</template>
<script>
export default {
    props:[
        "id"
    ],
    data(){
        return{
            panel:'',
            data:{},
            chips:[],
            chipsObj:[],
            maxChips:1,
            openAlert:false
        }
    },
    methods:{
        openAlertDialog() {
            this.openAlert = true;
        },
        closeAlertDialog() {
            this.openAlert = false;
        },        
        navigate_back() {
            this.$router.back(-1);
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
        getItem(item,index,code){
            if(item.status != 0) return;
            if(this.chips.length+1 > this.maxChips){
                this.$toast.warning('超过最大可选芯数');
                return ;
            } else {
                if(!this.chips.includes(code+" - "+item.code)){
                     this.chips.push(code+" - "+item.code);
                     this.chipsObj.push(item);
                }
            }
        },
        init(){
            var params = new URLSearchParams();

            params.append('id',this.id);

            this.$axios.post("/modifychip/list",params )
            .then((res)=>{
                this.data = res.data.data;
                this.maxChips = this.data.businessType == 'doubles' ? 2 : 1
            });
        },
        remove (index) {
            this.chips.splice(index, 1);
            this.chipsObj.splice(index, 1);
        },
        toggle(index){
            this.panel =  this.panel ===  index  ? '' : index;
        },
        modifyChip(){
            //modifychip/update
            this.openAlert = false;
            var params = new URLSearchParams();
            params.append("oldId",this.id);
            params.append("type",this.data.businessType);
            if(this.chipsObj != 0){
                if(this.chipsObj.length < this.maxChips && this.maxChips == 2){
                    this.$toast.warning('请选择两个光芯');
                    return;
                }

                switch (this.maxChips) {
                    case 1:
                        params.append('newId',this.chipsObj[0].id);
                        params.append('newId1','');
                        break;
                    case 2:
                        params.append('newId',this.chipsObj[0].id);
                        params.append('newId1',this.chipsObj[1].id);
                        break;
                }
            } else {
                this.$toast.warning('请选择要修改的光芯');
                return;
            }
            
            this.$axios.post("/modifychip/update",params )
            .then((res)=>{
                if(res.data.code == 200){
                    this.$toast.warning('修改成功');
                    this.$router.back(-1);
                }
            });
        }
    },
    mounted() {
        this.init();
    },
    watch: {
        data:{
            handler(oldVal,newVal){

                if(!this.data.businessType){
                    this.$toast.error('光芯类型为空');
                    this.$router.back(-1);
                }
            }
        }
    },
}
</script>


<style  scoped>
.pasdev-postInfo {  
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

.selectChip {
  margin: 8px;
  vertical-align: middle;
}


</style>

