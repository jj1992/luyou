<template>
  <div class="v-flexContainer">

    <!-- 头部 -->
    <div :style="topStyle">
      <slot name='top'></slot>
    </div>

    <!-- 中间 -->
    <div class="middle" :style="middleStyle">
      <slot name="middle"></slot>
    </div>

    <!-- 底部 -->
    <div :style="bottomStyle">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script>
export default {
    props:{
        topStyle:{
            type:Object,
            default(){
                return {
                    width:'100vw',
                }
            }
        },
        middleStyle:{
            type:Object,
            default(){
                return {
                    paddingTop:'10px',
                    marginBottom:'60px'
                }
            }
        },
        bottomStyle:{
            type:Object,
            default(){
                return {
                    width:'100vw',
                }
            }
        }
    },
}
</script>

<style scoped>
.v-flexContainer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}
.middle {
  overflow: auto;
}
</style>
