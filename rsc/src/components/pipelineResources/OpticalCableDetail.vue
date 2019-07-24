<template>
    <div class="activeDeviceDetail">
        <mu-appbar class="" style="width: 100%;position:fixed;top:0" color="primary">
        <mu-button icon slot="left" @click="navigate_back">
            <mu-icon value="navigate_before"></mu-icon>
        </mu-button>
        光缆详情
        </mu-appbar>
        
        <mu-list style="margin-top:56px;">
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          局所
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.office
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光缆编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.bianHao
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光缆类型
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
          产权类型
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.propertyRightType
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          产权单位
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.chanquanDanwei
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光纤型号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.opticalFiberType
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光缆用途
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.opticalCablePurpose
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光缆程式
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.opticalCableProgram
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光纤类型
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.fiberType
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          保密标识
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.securityLabel
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          设计长度
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.designLength
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          实际长度
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.actualLength
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          录入长度
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.entryLength
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          连接方式
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.connectionMode
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          维护单位
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.maintenanceUnit
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          生产厂家
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.manufacturer
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          固定资产编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.fixedAssetsNumber
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
              obj.state
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          光缆标牌内容
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.fiberOpticCableLabel
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          合同号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.contractNumber
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          操作员
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.operator
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false" class="active-d-list">
        <mu-list-item-title>
          操作时间
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.operationTime
          }}
        </mu-list-item-action>
      </mu-list-item>
    </mu-list>

    <mu-flex class="active-d-flex" align-items="center">
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toOpticalCableSegmentList">光缆段</mu-button>
      </mu-flex>
      <mu-flex justify-content="center" fill>
        <mu-button color="primary" @click="toOpticalCableRouting">光缆路由</mu-button>
      </mu-flex>
    </mu-flex>
    </div>
</template>

<script>
export default {
  props:["id"],
    data(){
        return{
          obj:{}
        }
    },
    methods:{
        navigate_back(){
            this.$router.back(-1);
        },
        //查看光缆段
        toOpticalCableSegmentList(){
          this.$router.push({path:'/opticalCableSegmentList',query:{guanglanId:this.obj.id}});
        },
        //查看光缆路由
        toOpticalCableRouting(){
          this.$router.push({path:'/opticalCableRouting',query:{id:this.obj.id}});
        },
        postData() {
          let params=new URLSearchParams();
          params.append("id",this.id);
          this.$axios.post("/guanglan/details",params).then((res) => {
            if(res.data.code==200){
              // console.log(res.data.data)
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


