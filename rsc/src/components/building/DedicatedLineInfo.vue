<template>
    <div>
        <mu-divider></mu-divider>
    <mu-list>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          专线号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.specialLineNo
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          产品类型
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.productType
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          电路类别
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.circuitType
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          电路用途
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.circuitUse
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          电路速率
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                data.circuitVelocity
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          客户名称
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.clientName
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          路由描述
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.routeDescribe
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          销售代表
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.sellName
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          销售代表联系电话
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.sellPhone
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          互联网端口速率
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.internetPortVelocity
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          互联网专线号码
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                data.internetPhone
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          用户IP
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.userIP
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          分配IP
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.allocationIP
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          Z端用户地址
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.zaddress
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          A端用户地址
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                data.aaddress
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          IP地址个数
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.ipnumber
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
    </mu-list>
    </div>
</template>
<script>
export default {
  props:['data'],
  
}
</script>

<style scoped>
    .mu-item .mu-item-action{
      font-size: 12px;
      text-align: right;
      min-width: 220px;
    }  
    .mu-item-title{
      font-weight: bold;
      font-size: 14px
    }
</style>
