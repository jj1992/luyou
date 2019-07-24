<template>
    <div style="width:100%;">
        <mu-divider></mu-divider>
        <mu-container style="padding:0px" >
            <div style="position:fixed;left:0;top:100px;z-index:10;background:#fff;width:100%">
            <div style="border-bottom:1px solid #ccc;padding:5px 0">
                    <div class="routeInfo">
                        <div style="display:flex;align-items:center;width:246px;">
                           
                            <img src="../../assets/02_07.png" style="width:16px; height:16px; float:left; margin-top:6px;">
                            
                            <mu-flex>
                            <span style="font-weight:bold;font-size:14px;color:#000;display:inline-block;margin-left:5px;min-width:340px;margin-top:10px;">{{this.aaddress}}</span>
                            </mu-flex>
                        </div>
                        <span style="font-size:12px;">{{this.code}} | {{this.leasedLineStatus}}</span>
                    </div>                   
            </div>
            </div>
        <div style="margin-top:70px">
        <div v-for='(value,key,index) in data' :key="value.id">
            <div v-for='(value1,key1,index1) in value' :key="index1">
            
            <div style="display:flex;align-items:center;height:60px;line-height:60px;" @click="toggle(index + index1)">
                <mu-flex>
                    <span style="font-weight:bold;font-size:14px;color:#000;display:inline-block;margin-left:16px;min-width:300px;">{{key}}({{key1}})</span>
                </mu-flex>
                <mu-flex>
                    <mu-icon :value="index + index1 === curIndex ?'keyboard_arrow_up' : 'keyboard_arrow_down'"  style="font-size:18px;margin-top:10px;"/>
                </mu-flex>
            </div>
            <mu-divider></mu-divider>
            <div v-if="index + index1 === curIndex">
                <mu-row style="text-align:center;line-height:40px;width:100%;font-weight:700">
                    <span style="width:75px">设备类型</span>
                    <span style="width:90px">设备编号</span>
                    <span style="width:73px">连接位置</span>
                    <span style="width:122px">备注</span>
                </mu-row> 
                <mu-divider></mu-divider>
            <div v-for='(value2,key2) in value1' :key="value2.id">
                <div class="routeInfo_top">
                    <div>
                        <span style="font-size:14px;color:#000;display:inline-block;margin-left:10px;min-width:270px;">{{key2}}</span>
                    </div>  
                    <mu-divider></mu-divider>            
                </div>
                <div v-for="item in value2" :key="item.id">
                    <div class="routeInfo_bottom">
                        <mu-row  style="text-align:center;line-height:25px;">
                            <span style="width:60px">{{item.deviceTypeName}}</span>
                            <span style="width:100px">{{item.deviceCode}}</span>
                            <span style="width:75px">{{item.connectionPosition}}</span>
                            <span style="width:130px">{{item.mark}}</span>
                        </mu-row>  
                        <mu-divider></mu-divider>
                    </div>
                </div>
            </div>
            </div>

            </div>
        </div>
        </div>
        </mu-container>
    </div>
</template>
<script>
export default {
    props:['code','leasedLineStatus','aaddress','data'],
    data(){
        return{
           
            curIndex:-1,
        }
    },
    methods:{
        
        toggle(index){
            //console.log(index)
            this.curIndex = (this.curIndex === index ? '': index);  
        },
    },
    mounted() {
      
    },
}
</script>

<style scoped>
    .mu-item .mu-item-action{
      font-size: 12px;
      text-align: right;
      min-width: 100px;
    }  
    .mu-item-title{
      font-weight: bold;
      font-size: 14px
    }
    .routeInfo_top{
        width: 100%; 
        background: #fff;
        overflow: hidden;
        padding-bottom:10px;
        height:40px;
        line-height:38px;
    }
    .routeInfo{
        color:rgb(39, 38, 38);
        padding-left:10px;
    }
    .routeInfo_bottom{
        background:rgb(245, 245, 245);
        clear:both;
        margin:0;   
        font-size: 10px;
    }
    .routeInfo_bottom span{
        display: inline-block;
        /* padding:10px 30px 10px 10px; */
        color: rgb(39, 38, 38);
    }
    .routeInfo_bottom p{
      margin:0;
      padding:0
    }
</style>
