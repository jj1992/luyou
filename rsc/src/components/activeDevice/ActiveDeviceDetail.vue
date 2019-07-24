<template>
    <div class="activeDeviceDetail">
        <mu-appbar class="" style="width: 100%;position:fixed;top:0" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
            <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        有源设备详情
        </mu-appbar>

        <mu-list style="margin-top:56px;">
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          网元编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.code
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          网元名称
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.name
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          所属机房
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.motorRoom
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          所属居所
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.bureau
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          网络
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.type
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          网络层次
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.netWork
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          设备大类
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.sort
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          设备型号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.model
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          设备LoopBack地址 
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.loopAddress
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          状态
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.status
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          机列
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.machineRoomList
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          机架
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.rack
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false" class="active-d-list">
        <mu-list-item-title>
          备注
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.remark
          }}
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>

    <mu-flex class="active-d-flex" align-items="center">
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toPortInfo(obj.id)" v-if="$util.hasRight('activeDeviceList')">查看端口信息</mu-button>
        <!-- <mu-button color="primary" @click="toPortInfo(obj.id)">查看端口信息</mu-button> -->
      </mu-flex>
    </mu-flex>
    </div>
</template>

<script>
export default {
  props:['id'],
    data(){
        return{
          obj:{}
        }
    },
    methods:{
        navigate_back(){
            this.$router.back(-1);
        },
        toPortInfo(id){
          this.$router.push({path:'/portInfo',query:{id:id}});
        },
        postData() {
          let params=new URLSearchParams();
          params.append("id",this.id);
          this.$axios.post("/activedevice/details",params).then((res) => {
            if(res.data.code==200){
              this.obj = res.data.data;
            }else{
              this.obj={};
            }
          })
          .catch(() => {
          
          });
        },
    },
    mounted(){
      this.postData()
    }
}
</script>

<style scoped>
    .active-d-flex{
        position: fixed;
        bottom: 0;
        background-color: #fff;
        height: 60px;
        width:100%;
        box-shadow: -1px 4px 2px 0px rgba(0,0,0,.2), 0 5px 4px 0 rgba(0,0,0,.14), 0 -4px 10px 0 rgba(0,0,0,.12);
    }
    .active-d-list{
        margin-bottom: 60px;
    }
    .mu-item{
      display:none;
    }
    .mu-item .mu-item-action{
      font-size: 12px;
      text-align: right;
      min-width: 235px;
    }  
    .mu-item-title{
      font-weight: blod;
      font-size: 14px;
    }
</style>


