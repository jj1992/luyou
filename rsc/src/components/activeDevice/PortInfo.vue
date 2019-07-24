<template>
    <div  class="portInfoRoot"> 
        <div>
        <!-- 标题 -->
        <mu-appbar class="" style="width: 100%;padding:0px;" color="primary">
            <mu-button icon slot="left" @click="navigate_back">
                <mu-icon value="navigate_before"></mu-icon>
            </mu-button>
            端口信息详情
        </mu-appbar>
        </div>
        <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;">
            <span >暂无数据</span>
        </div>
        <mu-container class="demo-container is-stripe" style="padding:0;overflow:scroll">  
            <div v-if="tit" style="position: fixed;top: 50px;left: 0px;z-index: 10;">
                <mu-row gutter style="background:#fff;height:61px;line-height:40px;padding:0 26px;width:102%;">
                    <mu-col span="6">
                    <mu-select label="速率" v-model="filterable.value1" full-width class="cFont">
                        <div @click="all">
                        <mu-option :label="msg" :value="msg"></mu-option>  
                        </div>
                        <div v-for="(option,index) in arr" :key="index" @click='filter(index)'>
                            <mu-option :label="option" :value="option"></mu-option>
                        </div>
                    </mu-select>
                    </mu-col>

                    <mu-col span="6">
                    <mu-select label="状态" v-model="filterable.value2" full-width class="cFont">
                        <div @click="all">
                        <mu-option :label="msg" :value="msg"></mu-option>  
                        </div>
                        <div v-for="(option,index) in type" :key="index" @click='filter2(index)'>
                            <mu-option :label="option" :value="option"></mu-option>
                        </div>
                    </mu-select>
                    </mu-col>
                </mu-row>
                <mu-row style="background:#fff;">
                    <mu-col span="4"><div class="grid-cell">端口号</div></mu-col>
                    <mu-col span="2"><div class="grid-cell">速率</div></mu-col>
                    <mu-col span="3"><div class="grid-cell">光电类型</div></mu-col>
                    <mu-col span="3"><div class="grid-cell">状态</div></mu-col>
                </mu-row>
            </div>

            <mu-load-more :loaded-all="loadOver" @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loading-text=" loadOver === true ? '已经到底了' : '正在努力加载...'">
            <div style="margin-top:95px;">
            <div  v-for="(item,index) in newList" :key="index" style="position:relative;">
                <mu-row >
                    <mu-col span="4"><div class="grid-cell">{{item.portCode}}</div></mu-col>
                    <mu-col span="2"><div class="grid-cell">{{item.velocity}}</div></mu-col>
                    <mu-col span="3"><div class="grid-cell">{{item.portType}}</div></mu-col>
                    <mu-col span="3"><div class="grid-cell">{{item.status}}</div></mu-col>       
                </mu-row> 
                    <div @click="toggle(index)" v-if="item.status=='占用'">
                        <mu-icon  class="btn_tog" :value="flag == true&&curIndex==index ?'keyboard_arrow_up' : 'keyboard_arrow_down'" />
                    </div>
                    
                <mu-flex class="mu-transition-row" v-if="item.status=='占用' && curIndex==index">
                    <mu-expand-transition>
                        <div  v-if="index === curIndex" style="width:100%">
                            <div class="portInfo">
                                <h3 style="margin-bottom:5px;font-size:15px;">占用信息</h3> 
                                <p style="margin-left:8px;font-size:12px;margin-bottom:5px;">
                                    <span style="width:100px;display:inline-block;">用户名称</span><span v-for="item2 in item.userName" :key="item2.id" style="padding:0 8px;">{{item2}}</span>
                                </p> 
                                <p class="pp" style="margin-left:8px;font-size:12px;margin-bottom:5px;">
                                    <span style="display:inline-block;">电路编号/专线号</span>
                                    <span v-if="$util.hasRight('activeDeviceAllRouteList')" style="display:inline-block;background-color: rgb(76, 175, 80);color:#fff;padding:0 2px;" v-for="(item2,index) in item.specialLineCode" :key="item2.id" class="btn" @click="toFullRoute(item.specialLineCode[index],item.businessType)">{{item2}}</span>
                                </p> 
                            </div>
                        </div>
                    </mu-expand-transition>
                </mu-flex>
            </div>
            </div>
            </mu-load-more>
        </mu-container>
        </div>   
</template>

<script>
export default {
    props:["id"],
  data () {
    return {
        flag:false,
        curIndex:'',
        arr:[],
        type:[],
        newList:[],
        newList2:[],
        list:[],
        msg:'全部',
        filterable: {
            value1: '请选择',
            value2: '请选择'
        },
        code:'',
        leasedLineStatus:'',
        refreshing:false,
        loading:false,
        currPage:0,
        loadOver:false,
        total:0,
        noData:false,
        tit:true,
    }
  },
  mounted(){
    this.postData();
  },
  methods: {
      postData() {
        //   let params=new URLSearchParams();
        //   params.append("id",this.id);
      this.$axios.post("/activedeviceport/list?id="+this.id + "&page=" + this.currPage).then((res) => {
          this.total = res.data.total
          if(res.data.code==200){
            if(!this.refreshing){
                this.list = this.list.concat(res.data.data);
            }
            if(this.list.length === 0){
                this.noData = true
                this.tit = false
            }
            this.newList = this.list;
            this.newList2 = this.list
            this.getSta()
            this.getVel();
          }else{
            this.$toast.error(this.data.msg);
            this.list = [];
            this.newList = [];
            this.newList2 = []
          }
        this.refreshing = false
        this.loading = false
           
        })
    },
      getVel(){  
            for(let item of this.list){
                if(this.arr.indexOf(item.velocity) === -1){
                   this.arr.push(item.velocity); 
                }    
            } 
      },
      getSta(){  
            for(let item of this.list){
                if(this.type.indexOf(item.status) === -1){
                   this.type.push(item.status); 
                }    
            } 
      },
    navigate_back(){
            this.$router.back(-1);
    },
    toggle(index){
        //this.curIndex=index,
        this.flag = !this.flag;
        this.curIndex = (this.curIndex === index ? '': index);
    },
    filter(idx){   
        this.newList = this.list.filter((item)=>{
            if(item.velocity === this.arr[idx]){
                return item
            }
        })
        this.newList2 = this.newList;
        this.filterable.value2 = '请选择';
    },
    filter2(idx){
        this.newList = this.newList2
        this.newList = this.newList.filter((item)=>{
            if(item.status === this.type[idx]){
                return item
            }
        })
        
    },
    all(){
        this.newList2 = this.list
        this.newList = this.list;
        this.filterable.value1 = '请选择'
        this.filterable.value2 = '请选择'

    },
    toFullRoute(specialLineNo,type){
        this.code = specialLineNo.split(':')[0]
        this.leasedLineStatus = specialLineNo.split(':')[1]
        //console.log(this.code,specialLineNo)
        if(type==='1'){
            this.$router.push({path:'/lineFullroute/',query:{leasedLineStatus:this.leasedLineStatus,code:this.code}});
        }
        else if(type==='2'){
            this.$router.push({path:'/relayFullroute/',query:{specialLineCode:specialLineNo}});
        }
    },
    refresh(){
        this.loadOver = false
        this.total = 0
        this.refreshing = true;
        this.currPage = 0;
        this.postData();

    },
    load(){
        this.loading = true;
        // if(data.pageSize > this.currPage){
            this.currPage++;
            // this.loadOver = false
        // } else {
            // this.loadOver = true
        // }
        this.postData();
    },
  },
watch:{
    '$route'(to,from){
        this.list = [];
        this.currPage = 0;
        this.loading = false
        this.loadData();
    },
    list:{
        handler(){
            if(this.list.length >= this.total){
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

    .portInfoRoot{
        height:100vh;
        display: flex;
        flex-direction: column;   
    }

    .demo-container .row{
        text-align: center;
        border-bottom:1px solid #ccc;
        height:40px;
        line-height:40px;
    }
    /* .material-icons{
        font-size: 18px;
    } */

    .btn_tog{      
        position:absolute;
        right:5px;
        top:0;
        margin-top:15px;
        line-height: 10px;
    }

    .btn{
        border:0;
        margin-left:5px;
        margin-top: 5px;
        background:rgb(245, 245, 245);
    }
    .pp span:nth-of-type(2){
        margin-left:50px;
    }

    .portInfo{
        border-bottom:1px solid #ccc;
        padding-left:15px;
        background:rgb(245, 245, 245);
    }
    .portInfo p,.portInfo h3{
        margin:0;
        padding:0;
    }
    .mu-input.has-label .mu-input-label {
        top: 8px;
        position: absolute;
        font-size: 22px;
        left: 40px;
    }
    .mu-select-input.is-enable{
        text-align: center;
    }
    .mu-item-action{
        width:100px;
    }
</style>


