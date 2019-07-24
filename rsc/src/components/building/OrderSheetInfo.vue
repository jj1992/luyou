<template>
    <div>
        <mu-divider></mu-divider>
      
        <mu-list>
          
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          调单号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.workNo
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          专线状态
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.type
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          订单号
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.oderNo
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          要求完成时间
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.stipulatesFinishDate
          }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          实际完成时间
        </mu-list-item-title>
        <mu-list-item-action>
            {{
                data.actualFinishDate
            }}
        </mu-list-item-action>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item :ripple="false">
        <mu-list-item-title>
          接单时间
        </mu-list-item-title>
        <mu-list-item-action>
          {{
              data.orderReceivingDate
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
      min-width: 150px;
    }  
    .mu-item-title{
      font-weight: bold;
      font-size: 14px
    }
</style>
