<template>
    <div>
        <div v-if="flag" style="position:absolute;width:100%;height:100%;z-index:-1">
            <img  src="../../../public/images/loading.gif" style="z-index:1000; margin-top:270px;margin-left:45%;" />
        </div>
        <div v-if="noData" style="width:100%;text-align:center;height:50px;line-height:50px;font-size:16px;">
            <span >暂无数据</span>
        </div>
        <mu-container style="padding:0px;">
            <div style="z-index:999;background:#fff;">
            <div v-for='(item,index) in data' :key="index" style="border-bottom:1px solid #ccc;">
                <div class="dedicatedLine_top">
                    <div class="dedicatedLine">
                        <div style="display:flex;align-items:center;width:246px;">
                           
                            <img src="../../assets/02_07.png" style="width:16px; height:16px; float:left; margin-top:6px;">
                            
                            <mu-flex>
                            <span style="font-weight:bold;font-size:14px;color:#000;display:inline-block;margin-left:5px;min-width:210px;">{{item.userName}}</span>
                            </mu-flex>
                            <!-- <mu-flex>
                                <mu-icon  :value="index === curIndex ?'keyboard_arrow_up' : 'keyboard_arrow_down'"  style="font-size:18px;margin-top:24px;"/>
                            </mu-flex> -->
                        </div>
                        <span style="font-size:12px;">{{item.specialLineNo}} | {{item.status}}</span>
                    </div>
                    <mu-flex class="flex-demo btn-right" justify-content="center" >
                        <mu-button class="topRight" small textColor="#C0C0C0" flat color="warning" @click="toLineFullRoute(item.specialLineNo,item.status)" style="min-width:0;color:#ff4081;font-size:12px;">详情</mu-button>
                    </mu-flex>                    
                </div>
                <mu-expand-transition>
                <div v-if="index === curIndex" style="width:100%">
                    <div class="dedicatedLine_bottom">
                        <p><span>调单号 | {{item.singleCode}}</span></p>
                        <p><span>产品类型 | {{item.producType}}</span><span>速率 | {{item.velocity}}</span></p>
                        <p><span>用户Z端地址 | {{item.Zaddress}}</span></p> 
                        <p><span>用户A端地址 | {{item.Aaddress}}</span></p>    
                    </div>
                </div>
                </mu-expand-transition>
            </div>
            </div>
        </mu-container>
    </div>
</template>
<script>
export default {
    props:['data','idx'],
    data(){
        return{
            curIndex:-1,
            flag:false,
            list:[],
            noData:false,
        }
    },
    mounted() {
        this.loading1();
        //this.postData()
    },
    methods:{
        // toggle(index){
        //     this.curIndex = (this.curIndex === index ? '': index);  
        // },
        // postData(){    
        //     let params=new URLSearchParams();
        //     params.append("id",this.idx);
        //     this.$axios.post("/building/businesslist",params).then((res) => {
        //         if(res.data.code==200){                                 
        //             this.list = res.data.data.specialBusinessList
        //             console.log(this.list) 
        //         }else{
                    
        //         }
        //     }).catch(() => {
            
        //     });
            
        // },
        toLineFullRoute(code,type){
            //console.log(code,type)
            this.$router.push({path:'/lineFullRoute/',query:{code:code,leasedLineStatus:type}});
        },
        loading1(){
            this.flag = true;
            setTimeout(() => {
                this.flag = false;
                this.loading();
            },60000)   
        },
        loading(){
           if(this.data.length == 0){
                this.noData = true;
            } 
        }
    },
    watch:{
        '$route'(to,from){
            this.data = [];
            this.noData = false
        },
         data:{
            handler(){
                if(this.data.length === 0){
                    this.flag = true;
                    if(this.noData = true){
                        this.flag = false;
                    }                   
                } else {
                    this.flag = false 
                }
            }
        }
        
    }
}
</script>

<style  scoped>
    .dedicatedLine_top{
        width: 100%; 
        background: #fff;
        overflow: hidden;
        padding:5px 0;
    }
    .dedicatedLine{
        float:left;
        color:rgb(39, 38, 38);
        padding-left:10px;
    }
    .btn-right{
        float:right;
        margin-top:20px;
        min-width: 60px;
        margin-right: 25px;
    }
    .dedicatedLine_bottom{
        background:rgb(245, 245, 245);
        clear:both;
        margin:0;   
        font-size: 12px;
    }
    .dedicatedLine_bottom span{
        display: inline-block;
        padding:10px 30px 10px 10px;
        color: rgb(39, 38, 38);
    }
    .dedicatedLine_bottom p{
        margin:0;
        padding:0;
    }
</style>

