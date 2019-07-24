<template>
    <div>
        <mu-divider></mu-divider>
    <mu-list>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          电路编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.reayingNo
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          业务类型
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.businessType
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          移动电路编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.moveCircuitNumber
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          长途电路编号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.longCircuitNumber
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          报竣时间
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.commentDate
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          限速速率
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.rateLimitingVelocity
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          业务状态
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.businessStatus
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A端区局
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.aDistrictBureau
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          Z端区局
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.zDistrictBureau
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A端接口类型
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.aInterfaceType
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          Z端接口类型
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.zInterfaceType
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          Z端设备
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.zDevice
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A端局所
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.aBureau
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A端设备端口
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.aDevicePort
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          Z端设备端口
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.zDevicePort
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          Z端机房
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.zMotorroom
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A端机房
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.aMotorroom
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A端设备
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                obj.aDevice
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          Z端局所
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              obj.zBureau
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
    </mu-list>
    </div>
</template>
<script>
export default {
  props:['specialLineCode'],
    data(){
        return{
            obj:{}
        }
    },
    methods:{
        postData(){
            let params=new URLSearchParams();
            params.append("specialLineCode",this.specialLineCode);
            this.$axios.post("/relaying/details",params).then((res) => {
                if(res.data.code==200){
                    this.obj = res.data.data
                    //console.log(this.obj)
                }else{
                    this.obj = {}
                }
            }).catch(() => {
            
            });
        },
    },
    mounted() {
      this.postData();
    },
}
</script>

<style scoped>
    .mu-item .mu-item-action{
      font-size: 12px;
      text-align: right;
      min-width: 150px;
    }  
    .mu-item-title{
      font-weight: bold;
      font-size: 14px
    }
</style>
