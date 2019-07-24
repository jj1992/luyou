<template>
  <div class="OdfPostDetailList">
    <div style="height:211px; overflow:scroll; padding-left:23px; padding-right:23px;">
      <table class="pasdev-post-table" border="1" style="width:100%; border-collapse: collapse; border:none;">
        <tr>
          <th style="width:14%;">端子号</th>
          <th style="width:18%;">状态</th>
          <th style="width:34%;">电路编号/专线号</th>
          <th style="width:34%;">用户名称</th>
        </tr> 
        <tr v-for="item in this.terminalInfo" :key="item.id" style="text-align:center;">
          <td>{{item.terminalNum}}</td>
          <td>{{getStatus(item.status)}}</td>
          <td>
            <span style="display:inline-block;margin-left:3px;" v-for="(item1,index) in item.specialLineCode" :key="index">{{item1}}</span>
          </td>
          <td>{{item.userName}}</td>
        </tr>
      </table>
    </div>

  </div>
</template>
<script>
export default {
    props:{
      terminalInfo:Array,
    },
    data() {
        return {};
    },
    methods:{
      getStatus(status){
        // if(status=="2"){
        //     return "占用";
        // }else if(status=="0"){
        //     return "空闲";
        // }else if(status=="6"){
        //     return "未知占用";
        // }else if(status=="4"){
        //     return "故障";
        // }else{
        //     return "未知";
        // }

        if(status =="1"){
            return "预占";
        }else if(status=="2"){
            return "占用";
        }else if(status=="0"){
            return "空闲";
        }else if(status=="6"){
            return "未知占用";
        }else if(status=="4"){
            return "故障";
        }else if(status == "3"){
            return "预留";
        }else if(status == "5"){
            return "空端子";
        }else if(status == "7"){
            return "跳接";
        }else if(status == "8"){
            return "宽带占用";
        }

      }
    }
};
</script>
<style scoped>
.pasdev-post-table th{
  border:none;
}
.pasdev-post-table td{
  border:none;
}
</style>
